# servidor_wireshark_api.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import json
import threading
import time
import re
from collections import defaultdict, deque
from datetime import datetime
import psutil

app = Flask(__name__)
CORS(app)  # Permitir CORS para la conexión desde el navegador

class WiresharkMonitor:
    def __init__(self):
        self.is_monitoring = False
        self.process = None
        self.stats = {
            'upload_speed': 0,
            'download_speed': 0,
            'total_packets': 0,
            'total_bytes': 0,
            'packets_per_second': 0,
            'interfaces': []
        }
        self.packet_history = deque(maxlen=60)  # Últimos 60 segundos
        self.byte_history = deque(maxlen=60)
        self.start_time = None
        
        # Detectar interfaces de red disponibles
        self.detect_interfaces()
        
    def detect_interfaces(self):
        """Detecta las interfaces de red disponibles"""
        try:
            # Usar tshark para listar interfaces
            result = subprocess.run(['tshark', '-D'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                interfaces = []
                for line in result.stdout.strip().split('\n'):
                    if line.strip():
                        # Formato: "1. eth0 (Ethernet)"
                        match = re.match(r'(\d+)\.\s+([^\s]+)', line)
                        if match:
                            interfaces.append({
                                'id': int(match.group(1)),
                                'name': match.group(2),
                                'description': line
                            })
                self.stats['interfaces'] = interfaces
        except Exception as e:
            print(f"Error detectando interfaces: {e}")
            # Interfaces por defecto
            self.stats['interfaces'] = [
                {'id': 1, 'name': 'eth0', 'description': 'Ethernet'},
                {'id': 2, 'name': 'wlan0', 'description': 'WiFi'}
            ]

    def start_monitoring(self, interface='any', filter_expr=''):
        """Inicia el monitoreo de tráfico con tshark"""
        if self.is_monitoring:
            return False
            
        try:
            # Comando tshark para capturar paquetes
            cmd = [
                'tshark',
                '-i', interface,  # Interfaz (any para todas)
                '-T', 'json',     # Salida en formato JSON
                '-e', 'frame.time_epoch',
                '-e', 'frame.len',
                '-e', 'ip.src',
                '-e', 'ip.dst',
                '-e', 'tcp.srcport',
                '-e', 'tcp.dstport',
                '-e', 'frame.protocols'
            ]
            
            if filter_expr:
                cmd.extend(['-Y', filter_expr])
            
            # Iniciar proceso tshark
            self.process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1,
                universal_newlines=True
            )
            
            self.is_monitoring = True
            self.start_time = time.time()
            
            # Iniciar thread para procesar datos
            threading.Thread(target=self._process_packets, daemon=True).start()
            threading.Thread(target=self._calculate_stats, daemon=True).start()
            
            return True
            
        except Exception as e:
            print(f"Error iniciando monitoreo: {e}")
            return False

    def stop_monitoring(self):
        """Detiene el monitoreo"""
        self.is_monitoring = False
        if self.process:
            self.process.terminate()
            self.process = None

    def _process_packets(self):
        """Procesa los paquetes capturados por tshark"""
        buffer = ""
        
        while self.is_monitoring and self.process:
            try:
                # Leer línea por línea
                line = self.process.stdout.readline()
                if not line:
                    break
                    
                buffer += line
                
                # Intentar parsear JSON cuando tenemos una línea completa
                if line.strip().endswith('}') or line.strip().endswith('},'):
                    try:
                        # Limpiar el buffer para JSON válido
                        json_str = buffer.strip().rstrip(',')
                        if json_str:
                            packet_data = json.loads(json_str)
                            self._process_packet(packet_data)
                        buffer = ""
                    except json.JSONDecodeError:
                        # Si no es JSON válido, continuar acumulando
                        pass
                        
            except Exception as e:
                print(f"Error procesando paquetes: {e}")
                break

    def _process_packet(self, packet_data):
        """Procesa un paquete individual"""
        try:
            current_time = time.time()
            
            # Extraer información del paquete
            layers = packet_data.get('_source', {}).get('layers', {})
            frame = layers.get('frame', {})
            
            packet_size = int(frame.get('frame.len', [0])[0]) if frame.get('frame.len') else 0
            timestamp = float(frame.get('frame.time_epoch', [current_time])[0]) if frame.get('frame.time_epoch') else current_time
            
            # Agregar a historial
            self.packet_history.append({
                'timestamp': timestamp,
                'size': packet_size,
                'packet_data': packet_data
            })
            
            self.byte_history.append({
                'timestamp': current_time,
                'bytes': packet_size
            })
            
        except Exception as e:
            print(f"Error procesando paquete individual: {e}")

    def _calculate_stats(self):
        """Calcula estadísticas en tiempo real"""
        while self.is_monitoring:
            try:
                current_time = time.time()
                
                # Filtrar datos del último minuto
                recent_packets = [p for p in self.packet_history 
                                if current_time - p['timestamp'] <= 60]
                recent_bytes = [b for b in self.byte_history 
                              if current_time - b['timestamp'] <= 60]
                
                # Calcular paquetes por segundo (últimos 10 segundos)
                last_10_sec_packets = [p for p in recent_packets 
                                     if current_time - p['timestamp'] <= 10]
                packets_per_sec = len(last_10_sec_packets) / 10 if last_10_sec_packets else 0
                
                # Calcular bytes por segundo (velocidad)
                last_10_sec_bytes = [b for b in recent_bytes 
                                   if current_time - b['timestamp'] <= 10]
                bytes_per_sec = sum(b['bytes'] for b in last_10_sec_bytes) / 10 if last_10_sec_bytes else 0
                
                # Actualizar estadísticas
                self.stats.update({
                    'upload_speed': bytes_per_sec / 2048,  # Aproximación upload (KB/s)
                    'download_speed': bytes_per_sec / 1024,  # Aproximación download (KB/s)
                    'total_packets': len(self.packet_history),
                    'total_bytes': sum(p['size'] for p in self.packet_history),
                    'packets_per_second': packets_per_sec,
                    'bytes_per_second': bytes_per_sec,
                    'monitoring_time': current_time - (self.start_time or current_time)
                })
                
                time.sleep(1)  # Actualizar cada segundo
                
            except Exception as e:
                print(f"Error calculando estadísticas: {e}")
                time.sleep(1)

# Instancia global del monitor
monitor = WiresharkMonitor()

# Rutas de la API REST
@app.route('/api/interfaces', methods=['GET'])
def get_interfaces():
    """Obtiene las interfaces de red disponibles"""
    return jsonify({
        'status': 'success',
        'interfaces': monitor.stats['interfaces']
    })

@app.route('/api/start', methods=['POST'])
def start_monitoring():
    """Inicia el monitoreo de red"""
    data = request.get_json() or {}
    interface = data.get('interface', 'any')
    filter_expr = data.get('filter', '')
    
    success = monitor.start_monitoring(interface, filter_expr)
    
    return jsonify({
        'status': 'success' if success else 'error',
        'message': 'Monitoreo iniciado' if success else 'Error iniciando monitoreo',
        'monitoring': monitor.is_monitoring
    })

@app.route('/api/stop', methods=['POST'])
def stop_monitoring():
    """Detiene el monitoreo de red"""
    monitor.stop_monitoring()
    return jsonify({
        'status': 'success',
        'message': 'Monitoreo detenido',
        'monitoring': monitor.is_monitoring
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Obtiene las estadísticas actuales"""
    return jsonify({
        'status': 'success',
        'data': {
            'uploadSpeed': round(monitor.stats['upload_speed'], 2),
            'downloadSpeed': round(monitor.stats['download_speed'], 2),
            'totalData': round(monitor.stats['total_bytes'] / (1024 * 1024), 2),  # MB
            'packetsPerSec': round(monitor.stats['packets_per_second'], 2),
            'totalPackets': monitor.stats['total_packets'],
            'bytesPerSecond': monitor.stats.get('bytes_per_second', 0),
            'monitoringTime': monitor.stats.get('monitoring_time', 0),
            'isMonitoring': monitor.is_monitoring,
            'connections': monitor.get_recent_connections(30)  # Últimas 30 conexiones
        }
    })

@app.route('/api/connections', methods=['GET'])
def get_connections():
    """Obtiene solo las conexiones activas"""
    limit = int(request.args.get('limit', 50))
    protocol_filter = request.args.get('protocol', '').upper()
    
    connections = monitor.get_recent_connections(limit)
    
    if protocol_filter:
        connections = [c for c in connections if c['protocol'] == protocol_filter]
    
    return jsonify({
        'status': 'success',
        'connections': connections,
        'total': len(connections)
    })

@app.route('/api/status', methods=['GET'])
def get_status():
    """Obtiene el estado del monitor"""
    return jsonify({
        'status': 'success',
        'monitoring': monitor.is_monitoring,
        'uptime': time.time() - (monitor.start_time or time.time()) if monitor.start_time else 0
    })

@app.route('/api/system-info', methods=['GET'])
def get_system_info():
    """Obtiene información del sistema"""
    return jsonify({
        'status': 'success',
        'system': {
            'cpu_percent': psutil.cpu_percent(),
            'memory_percent': psutil.virtual_memory().percent,
            'network_interfaces': list(psutil.net_if_addrs().keys())
        }
    })

if __name__ == '__main__':
    print("🚀 Iniciando servidor API REST para Wireshark...")
    print("📡 Endpoints disponibles:")
    print("   GET  /api/interfaces - Listar interfaces")
    print("   POST /api/start - Iniciar monitoreo") 
    print("   POST /api/stop - Detener monitoreo")
    print("   GET  /api/stats - Obtener estadísticas")
    print("   GET  /api/status - Estado del monitor")
    print("   GET  /api/system-info - Info del sistema")
    print("\n🔗 Ejemplo de uso:")
    print("   curl http://localhost:5000/api/stats")
    print("\n⚠️  Asegúrate de tener tshark instalado y permisos de administrador")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
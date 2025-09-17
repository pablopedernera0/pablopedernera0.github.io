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
        self.connections = deque(maxlen=1000)  # Historial de conexiones
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
                print(f"✅ Interfaces detectadas: {[i['name'] for i in interfaces]}")
        except Exception as e:
            print(f"❌ Error detectando interfaces: {e}")
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
            print(f"🔄 Iniciando monitoreo en interfaz: {interface}")
            
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
                '-e', 'frame.protocols',
                '-l'  # Flush de salida línea por línea
            ]
            
            if filter_expr:
                cmd.extend(['-Y', filter_expr])
                print(f"🔍 Filtro aplicado: {filter_expr}")
            
            print(f"🚀 Ejecutando comando: {' '.join(cmd)}")
            
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
            
            # Iniciar threads para procesar datos
            threading.Thread(target=self._process_packets, daemon=True).start()
            threading.Thread(target=self._calculate_stats, daemon=True).start()
            threading.Thread(target=self._check_tshark_errors, daemon=True).start()
            
            print("✅ Monitoreo iniciado correctamente")
            return True
            
        except Exception as e:
            print(f"❌ Error iniciando monitoreo: {e}")
            return False

    def _check_tshark_errors(self):
        """Verifica errores de tshark"""
        if not self.process:
            return
            
        while self.is_monitoring and self.process:
            try:
                error_line = self.process.stderr.readline()
                if error_line:
                    print(f"⚠️ tshark error: {error_line.strip()}")
                if not error_line and self.process.poll() is not None:
                    break
            except Exception as e:
                print(f"❌ Error leyendo stderr: {e}")
                break

    def stop_monitoring(self):
        """Detiene el monitoreo"""
        print("🛑 Deteniendo monitoreo...")
        self.is_monitoring = False
        if self.process:
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()
            self.process = None
        print("✅ Monitoreo detenido")

    def _process_packets(self):
        """Procesa los paquetes capturados por tshark"""
        packet_count = 0
        
        while self.is_monitoring and self.process:
            try:
                # Leer línea por línea
                line = self.process.stdout.readline()
                if not line:
                    if self.process.poll() is not None:
                        print("⚠️ Proceso tshark terminado")
                        break
                    continue
                
                # Intentar parsear JSON
                line = line.strip()
                if line and (line.startswith('{') or line.startswith('[')):
                    try:
                        packet_data = json.loads(line)
                        self._process_packet(packet_data)
                        packet_count += 1
                        if packet_count % 10 == 0:
                            print(f"📦 Procesados {packet_count} paquetes")
                    except json.JSONDecodeError as e:
                        print(f"⚠️ Error JSON: {e} - Línea: {line[:100]}")
                        
            except Exception as e:
                print(f"❌ Error procesando paquetes: {e}")
                break
        
        print(f"🏁 Finalizando procesamiento. Total paquetes: {packet_count}")

    def _process_packets_fields(self):
        """Procesa los paquetes cuando tshark usa formato de campos"""
        packet_count = 0
        header_processed = False
        
        while self.is_monitoring and self.process:
            try:
                line = self.process.stdout.readline()
                if not line:
                    if self.process.poll() is not None:
                        print("⚠️ Proceso tshark terminado")
                        break
                    continue
                
                line = line.strip()
                if not line:
                    continue
                
                # Saltar el header
                if not header_processed:
                    if line.startswith('frame.time_epoch'):
                        header_processed = True
                        print("📋 Header procesado, iniciando captura de datos...")
                        continue
                
                if header_processed:
                    # Procesar línea de datos (separada por |)
                    fields = line.split('|')
                    if len(fields) >= 7:
                        try:
                            timestamp = float(fields[0]) if fields[0] else time.time()
                            packet_size = int(fields[1]) if fields[1] else 0
                            ip_src = fields[2] if fields[2] else None
                            ip_dst = fields[3] if fields[3] else None
                            src_port = int(fields[4]) if fields[4].isdigit() else None
                            dst_port = int(fields[5]) if fields[5].isdigit() else None
                            protocols = fields[6] if fields[6] else ""
                            
                            # Determinar protocolo
                            protocol = "UNKNOWN"
                            if 'tcp' in protocols.lower():
                                protocol = 'TCP'
                            elif 'udp' in protocols.lower():
                                protocol = 'UDP'
                            elif 'icmp' in protocols.lower():
                                protocol = 'ICMP'
                            
                            # Crear estructura de datos similar al JSON
                            packet_data = {
                                'timestamp': timestamp,
                                'size': packet_size,
                                'src_ip': ip_src,
                                'dst_ip': ip_dst,
                                'src_port': src_port,
                                'dst_port': dst_port,
                                'protocol': protocol
                            }
                            
                            self._process_packet_simple(packet_data)
                            packet_count += 1
                            if packet_count % 10 == 0:
                                print(f"📦 Procesados {packet_count} paquetes (formato campos)")
                                
                        except (ValueError, IndexError) as e:
                            print(f"⚠️ Error procesando línea: {e} - {line}")
                        
            except Exception as e:
                print(f"❌ Error procesando paquetes (campos): {e}")
                break
        
        print(f"🏁 Finalizando procesamiento (campos). Total paquetes: {packet_count}")

    def _process_packet_simple(self, packet_data):
        """Procesa un paquete en formato simple (no JSON)"""
        try:
            current_time = time.time()
            
            timestamp = packet_data.get('timestamp', current_time)
            packet_size = packet_data.get('size', 0)
            
            # Agregar a historial de paquetes
            self.packet_history.append({
                'timestamp': timestamp,
                'size': packet_size,
                'packet_data': packet_data
            })
            
            self.byte_history.append({
                'timestamp': current_time,
                'bytes': packet_size
            })
            
            # Agregar a historial de conexiones si tenemos IPs
            if packet_data.get('src_ip') and packet_data.get('dst_ip'):
                self.connections.append({
                    'timestamp': current_time,
                    'src_ip': packet_data['src_ip'],
                    'dst_ip': packet_data['dst_ip'],
                    'src_port': packet_data.get('src_port'),
                    'dst_port': packet_data.get('dst_port'),
                    'protocol': packet_data.get('protocol', 'UNKNOWN'),
                    'size': packet_size
                })
            
        except Exception as e:
            print(f"❌ Error procesando paquete simple: {e}")

    def _process_packet(self, packet_data):
        """Procesa un paquete individual"""
        try:
            current_time = time.time()
            
            # Extraer información del paquete
            if isinstance(packet_data, list) and len(packet_data) > 0:
                packet_data = packet_data[0]
            
            layers = packet_data.get('_source', {}).get('layers', {})
            frame = layers.get('frame', {})
            
            # Obtener datos del frame
            packet_size = 0
            timestamp = current_time
            
            if isinstance(frame.get('frame.len'), list):
                packet_size = int(frame['frame.len'][0]) if frame['frame.len'] else 0
            elif frame.get('frame.len'):
                packet_size = int(frame['frame.len'])
            
            if isinstance(frame.get('frame.time_epoch'), list):
                timestamp = float(frame['frame.time_epoch'][0]) if frame['frame.time_epoch'] else current_time
            elif frame.get('frame.time_epoch'):
                timestamp = float(frame['frame.time_epoch'])
            
            # Extraer información de conexión
            ip_src = None
            ip_dst = None
            src_port = None
            dst_port = None
            protocol = "UNKNOWN"
            
            ip = layers.get('ip', {})
            tcp = layers.get('tcp', {})
            
            if isinstance(ip.get('ip.src'), list):
                ip_src = ip['ip.src'][0] if ip['ip.src'] else None
            elif ip.get('ip.src'):
                ip_src = ip['ip.src']
                
            if isinstance(ip.get('ip.dst'), list):
                ip_dst = ip['ip.dst'][0] if ip['ip.dst'] else None
            elif ip.get('ip.dst'):
                ip_dst = ip['ip.dst']
            
            if isinstance(tcp.get('tcp.srcport'), list):
                src_port = int(tcp['tcp.srcport'][0]) if tcp['tcp.srcport'] else None
            elif tcp.get('tcp.srcport'):
                src_port = int(tcp['tcp.srcport'])
                
            if isinstance(tcp.get('tcp.dstport'), list):
                dst_port = int(tcp['tcp.dstport'][0]) if tcp['tcp.dstport'] else None
            elif tcp.get('tcp.dstport'):
                dst_port = int(tcp['tcp.dstport'])
            
            # Determinar protocolo
            protocols = frame.get('frame.protocols', [''])
            if isinstance(protocols, list):
                protocol_str = ':'.join(protocols)
            else:
                protocol_str = str(protocols)
            
            if 'tcp' in protocol_str.lower():
                protocol = 'TCP'
            elif 'udp' in protocol_str.lower():
                protocol = 'UDP'
            elif 'icmp' in protocol_str.lower():
                protocol = 'ICMP'
            
            # Agregar a historial de paquetes
            self.packet_history.append({
                'timestamp': timestamp,
                'size': packet_size,
                'packet_data': packet_data
            })
            
            self.byte_history.append({
                'timestamp': current_time,
                'bytes': packet_size
            })
            
            # Agregar a historial de conexiones
            if ip_src and ip_dst:
                self.connections.append({
                    'timestamp': current_time,
                    'src_ip': ip_src,
                    'dst_ip': ip_dst,
                    'src_port': src_port,
                    'dst_port': dst_port,
                    'protocol': protocol,
                    'size': packet_size
                })
            
        except Exception as e:
            print(f"❌ Error procesando paquete individual: {e}")

    def get_recent_connections(self, limit=50):
        """Obtiene las conexiones recientes"""
        try:
            # Convertir deque a lista y tomar los últimos elementos
            recent_connections = list(self.connections)[-limit:] if self.connections else []
            return recent_connections
        except Exception as e:
            print(f"❌ Error obteniendo conexiones: {e}")
            return []

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
                print(f"❌ Error calculando estadísticas: {e}")
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
    self.use_json_format = False  # Forzar formato de campos
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
    print("🔡 Endpoints disponibles:")
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
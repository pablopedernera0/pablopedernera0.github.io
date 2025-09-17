#!/usr/bin/env python3
"""
Script de diagnóstico para verificar el entorno de Wireshark
"""
import subprocess
import sys
import requests
import time
import json

def check_tshark():
    """Verifica que tshark esté instalado y funcional"""
    print("🔍 Verificando tshark...")
    try:
        result = subprocess.run(['tshark', '--version'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"✅ tshark encontrado: {result.stdout.split()[1]}")
            return True
        else:
            print(f"❌ Error ejecutando tshark: {result.stderr}")
            return False
    except FileNotFoundError:
        print("❌ tshark no está instalado")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def check_interfaces():
    """Verifica interfaces de red disponibles"""
    print("\n🔍 Verificando interfaces de red...")
    try:
        result = subprocess.run(['tshark', '-D'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            interfaces = result.stdout.strip().split('\n')
            print("✅ Interfaces encontradas:")
            for interface in interfaces:
                if interface.strip():
                    print(f"   {interface}")
            return len(interfaces) > 0
        else:
            print(f"❌ Error listando interfaces: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_capture():
    """Prueba una captura rápida"""
    print("\n🔍 Probando captura de paquetes (5 segundos)...")
    try:
        cmd = ['tshark', '-i', 'any', '-c', '5', '-T', 'json', '-e', 'frame.len']
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
        
        if result.returncode == 0:
            if result.stdout.strip():
                try:
                    # Intentar parsear como JSON
                    lines = result.stdout.strip().split('\n')
                    packet_count = 0
                    for line in lines:
                        if line.strip() and line.strip().startswith('['):
                            json.loads(line)
                            packet_count += 1
                    print(f"✅ Captura exitosa: {packet_count} paquetes capturados")
                    return True
                except json.JSONDecodeError:
                    print(f"⚠️ Captura exitosa pero JSON inválido")
                    print(f"Salida: {result.stdout[:200]}...")
                    return False
            else:
                print("⚠️ No se capturaron paquetes (puede ser normal si no hay tráfico)")
                return True
        else:
            print(f"❌ Error en captura: {result.stderr}")
            if "permission denied" in result.stderr.lower():
                print("💡 Solución: Ejecuta con sudo o configura permisos")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_api_server():
    """Prueba el servidor API"""
    print("\n🔍 Probando servidor API...")
    try:
        # Probar endpoint de status
        response = requests.get('http://localhost:5000/api/status', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Servidor respondiendo: {data}")
            return True
        else:
            print(f"❌ Servidor respondió con error: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al servidor. ¿Está ejecutándose?")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Función principal de diagnóstico"""
    print("🚀 Iniciando diagnóstico del sistema Wireshark...\n")
    
    all_ok = True
    
    # Verificar tshark
    if not check_tshark():
        all_ok = False
        print("💡 Instala tshark: sudo apt-get install tshark (Ubuntu/Debian)")
    
    # Verificar interfaces
    if not check_interfaces():
        all_ok = False
        print("💡 Problema con interfaces de red")
    
    # Verificar captura
    if not test_capture():
        all_ok = False
        print("💡 Problema con captura de paquetes")
        print("   - Ejecuta como administrador: sudo python3 wireshark_api_server.py")
        print("   - O configura permisos: sudo setcap cap_net_raw,cap_net_admin+eip $(which dumpcap)")
    
    # Verificar API (si está corriendo)
    print("\n⏳ Verificando servidor API (asegúrate de que esté ejecutándose)...")
    time.sleep(2)
    test_api_server()
    
    print("\n" + "="*50)
    if all_ok:
        print("✅ Diagnóstico completo: Todo parece estar bien")
        print("💡 Si aún no ves datos, verifica:")
        print("   1. Que el servidor esté corriendo con permisos de admin")
        print("   2. Que haya tráfico de red para capturar")
        print("   3. Los logs del servidor para errores específicos")
    else:
        print("❌ Se encontraron problemas. Revisa las sugerencias anteriores.")
    
    print("\n🔗 Comandos útiles:")
    print("   sudo python3 wireshark_api_server.py")
    print("   curl http://localhost:5000/api/interfaces")
    print("   curl http://localhost:5000/api/stats")

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
Prueba simple de tshark para diagnosticar problemas de JSON
"""
import subprocess
import json
import time

def test_tshark_json():
    """Prueba tshark con formato JSON"""
    print("🔍 Probando tshark con formato JSON...")
    
    cmd = [
        'tshark', 
        '-i', 'any', 
        '-c', '3',  # Solo 3 paquetes
        '-T', 'json',
        '-e', 'frame.len',
        '-e', 'ip.src'
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
        print(f"Código de salida: {result.returncode}")
        print(f"Stdout: {result.stdout}")
        print(f"Stderr: {result.stderr}")
        
        if result.stdout:
            print("\n📋 Intentando parsear JSON...")
            try:
                # Intentar parsear cada línea
                lines = result.stdout.strip().split('\n')
                for i, line in enumerate(lines):
                    if line.strip():
                        print(f"Línea {i+1}: {line[:100]}...")
                        try:
                            parsed = json.loads(line)
                            print(f"✅ JSON válido en línea {i+1}")
                        except json.JSONDecodeError as e:
                            print(f"❌ JSON inválido en línea {i+1}: {e}")
            except Exception as e:
                print(f"❌ Error general parseando: {e}")
        
    except subprocess.TimeoutExpired:
        print("❌ Timeout - puede que no haya tráfico de red")
    except Exception as e:
        print(f"❌ Error ejecutando tshark: {e}")

def test_tshark_fields():
    """Prueba tshark con formato de campos"""
    print("\n🔍 Probando tshark con formato de campos...")
    
    cmd = [
        'tshark', 
        '-i', 'any', 
        '-c', '3',
        '-T', 'fields',
        '-e', 'frame.len',
        '-e', 'ip.src',
        '-e', 'ip.dst',
        '-E', 'header=y',
        '-E', 'separator=|'
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
        print(f"Código de salida: {result.returncode}")
        print(f"Stdout:\n{result.stdout}")
        if result.stderr:
            print(f"Stderr: {result.stderr}")
        
    except subprocess.TimeoutExpired:
        print("❌ Timeout - puede que no haya tráfico de red")
    except Exception as e:
        print(f"❌ Error ejecutando tshark: {e}")

def generate_traffic():
    """Genera un poco de tráfico de red"""
    print("\n🔄 Generando tráfico de red...")
    try:
        # Hacer ping para generar tráfico
        subprocess.Popen(['ping', '-c', '3', '8.8.8.8'], 
                        stdout=subprocess.DEVNULL, 
                        stderr=subprocess.DEVNULL)
        time.sleep(2)
        print("✅ Tráfico generado")
    except Exception as e:
        print(f"⚠️ No se pudo generar tráfico: {e}")

def main():
    print("🚀 Prueba simple de tshark\n")
    
    # Generar tráfico primero
    generate_traffic()
    
    # Probar formato JSON
    test_tshark_json()
    
    # Probar formato de campos
    test_tshark_fields()
    
    print("\n💡 Si ves errores de JSON, usa el formato de campos")
    print("💡 Si no ves paquetes, verifica permisos y tráfico de red")

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""Alta de un profe en el editor de cuestionarios (editor/usuarios.json).

Uso:
    python3 _herramientas/alta-profe.py <email>          # alta o reemplazo
    python3 _herramientas/alta-profe.py --baja <email>   # saca la entrada

Pide por consola (sin eco) el token fine-grained de GitHub que va a usar ese profe,
genera una contraseña, cifra el token con ella y escribe la entrada en
editor/usuarios.json. La contraseña se muestra una sola vez: pasásela al profe.

Cifrado: PBKDF2-SHA256 (600.000 iteraciones, salt aleatorio) sobre "email|contraseña"
→ clave AES-256-GCM. Es lo mismo que hace editor/index.html con crypto.subtle al
entrar: si la contraseña está mal, el descifrado falla y no hay token.

Para revocar a alguien de verdad: borrar su token en GitHub (Settings → Developer
settings → Fine-grained tokens). Sacarlo de usuarios.json solo le saca el botón.
"""
import base64
import getpass
import json
import os
import secrets
import sys
from pathlib import Path

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

USUARIOS = Path(__file__).resolve().parent.parent / "editor" / "usuarios.json"
ITERACIONES = 600_000
# Sin caracteres que se confunden al dictarla o copiarla (0/O, 1/l/I).
ALFABETO = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"


def b64(b: bytes) -> str:
    return base64.b64encode(b).decode()


def generar_password() -> str:
    bloques = ["".join(secrets.choice(ALFABETO) for _ in range(4)) for _ in range(4)]
    return "-".join(bloques)


def cifrar(email: str, password: str, token: str) -> dict:
    salt = os.urandom(16)
    iv = os.urandom(12)
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=ITERACIONES)
    clave = kdf.derive(f"{email}|{password}".encode())
    cifrado = AESGCM(clave).encrypt(iv, token.encode(), None)
    return {"email": email, "iter": ITERACIONES, "salt": b64(salt), "iv": b64(iv), "token": b64(cifrado)}


def leer() -> list:
    return json.loads(USUARIOS.read_text()) if USUARIOS.exists() else []


def escribir(usuarios: list) -> None:
    USUARIOS.parent.mkdir(parents=True, exist_ok=True)
    USUARIOS.write_text(json.dumps(usuarios, indent=1, ensure_ascii=False) + "\n")


def main() -> None:
    args = sys.argv[1:]
    if len(args) == 2 and args[0] == "--baja":
        email = args[1].strip().lower()
        usuarios = [u for u in leer() if u["email"] != email]
        escribir(usuarios)
        print(f"Saqué a {email} de {USUARIOS.name}. Acordate de borrar su token en GitHub.")
        return
    if len(args) != 1 or "@" not in args[0]:
        sys.exit(__doc__)

    email = args[0].strip().lower()
    token = getpass.getpass(f"Token fine-grained de GitHub para {email} (no se ve al pegar): ").strip()
    if not token.startswith("github_pat_"):
        sys.exit("Eso no parece un token fine-grained (empiezan con github_pat_). No guardé nada.")

    password = generar_password()
    usuarios = [u for u in leer() if u["email"] != email]
    usuarios.append(cifrar(email, password, token))
    escribir(usuarios)

    print(f"\nListo: {email} quedó en {USUARIOS.relative_to(USUARIOS.parent.parent)}.")
    print(f"Contraseña (se muestra una sola vez, pasásela al profe):\n\n    {password}\n")
    print("Falta commitear y pushear usuarios.json para que la página la vea.")


if __name__ == "__main__":
    main()

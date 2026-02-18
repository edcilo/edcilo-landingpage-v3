---
title: 'SSH: generar y gestionar llaves de autenticación'
description: 'Guía completa para generar llaves SSH con ssh-keygen, elegir el algoritmo adecuado, configurar la autenticación por llave en servidores remotos y buenas prácticas de seguridad.'
date: 2026-02-18T16:00:00
tags: [ssh, linux, seguridad, sre]
draft: false
---

**SSH** (Secure Shell) es el protocolo estándar para acceder de forma segura a servidores remotos. Por defecto, la autenticación se realiza con usuario y contraseña, pero este método es vulnerable a ataques de fuerza bruta. La autenticación por llaves criptográficas elimina este riesgo: en lugar de transmitir una contraseña, el cliente demuestra que posee una llave privada que corresponde a una llave pública registrada en el servidor.

## Generar un par de llaves

```bash
ssh-keygen -t rsa -b 4096
```

El comando inicia un flujo interactivo que solicita la ruta del archivo (por defecto `~/.ssh/id_rsa`) y una passphrase opcional para cifrar la llave privada. Al finalizar, genera dos archivos:

- `~/.ssh/id_rsa` — llave privada. Nunca debe salir de tu máquina.
- `~/.ssh/id_rsa.pub` — llave pública. Se copia al servidor remoto.

### Flags principales

| Flag | Descripción                                      | Ejemplo                    |
| ---- | ------------------------------------------------ | -------------------------- |
| `-t` | Algoritmo de cifrado                             | `-t ed25519`               |
| `-b` | Número de bits de la llave                       | `-b 4096`                  |
| `-C` | Comentario identificador (generalmente un email) | `-C "user@example.com"`    |
| `-f` | Ruta y nombre del archivo de salida              | `-f ~/.ssh/id_trabajo_rsa` |

## Algoritmos disponibles

| Algoritmo | Comando                      | Tamaño de llave | Notas                                     |
| --------- | ---------------------------- | --------------- | ----------------------------------------- |
| Ed25519   | `ssh-keygen -t ed25519`      | 256 bits (fijo) | Rápido, seguro, llaves compactas          |
| RSA       | `ssh-keygen -t rsa -b 4096`  | 4096 bits       | Amplia compatibilidad, llaves más grandes |
| ECDSA     | `ssh-keygen -t ecdsa -b 521` | 521 bits        | Buen balance, menor adopción que Ed25519  |

**Recomendación:** usa **Ed25519** como primera opción. Es más rápido, genera llaves más pequeñas y ofrece un nivel de seguridad equivalente a RSA-3072. Reserva **RSA-4096** para sistemas legacy que no soporten Ed25519.

## Copiar la llave al servidor

La forma más directa es con `ssh-copy-id`:

```bash
ssh-copy-id usuario@servidor
```

Este comando copia la llave pública al archivo `~/.ssh/authorized_keys` del servidor remoto.

### Alternativa manual

Si `ssh-copy-id` no está disponible, copia el contenido de la llave pública directamente:

```bash
cat ~/.ssh/id_rsa.pub | ssh usuario@servidor "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Permisos requeridos

En el servidor, los permisos deben ser estrictos. SSH rechaza llaves si los permisos son demasiado abiertos:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## Verificar la conexión

```bash
ssh -i ~/.ssh/id_rsa usuario@servidor
```

Si la configuración es correcta, la conexión se establece sin solicitar contraseña. Para depurar problemas de conexión, usa el flag `-v`:

```bash
ssh -v -i ~/.ssh/id_rsa usuario@servidor
```

El modo verbose muestra cada paso del handshake, incluyendo qué llaves se ofrecen y si el servidor las acepta.

## Deshabilitar autenticación por contraseña

> **Advertencia:** verifica que la autenticación por llave funcione correctamente ANTES de deshabilitar las contraseñas. Si la llave no está configurada correctamente, perderás acceso al servidor.

Edita el archivo de configuración del servicio SSH:

```bash
sudo nano /etc/ssh/sshd_config
```

Cambia o agrega la siguiente directiva:

```
PasswordAuthentication no
```

Reinicia el servicio para aplicar los cambios:

```bash
sudo systemctl restart sshd
```

## Buenas prácticas

- **Usa passphrase siempre** — cifra la llave privada para que no sea utilizable si es robada.
- **Prefiere Ed25519** — mejor rendimiento y seguridad que RSA con llaves más compactas.
- **Una llave por dispositivo** — facilita la revocación sin afectar otros equipos.
- **Rota llaves periódicamente** — elimina llaves antiguas de `authorized_keys` y genera nuevas.
- **Nunca compartas la llave privada** — si necesitas acceso desde otro equipo, genera un nuevo par de llaves.
- **Permisos estrictos** — `600` para llaves privadas, `700` para el directorio `~/.ssh`.

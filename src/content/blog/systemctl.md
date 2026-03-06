---
title: 'systemctl: gestión de servicios con Systemd en Linux'
description: 'Guía de referencia de systemctl: acciones principales, banderas, gestión avanzada del sistema y cómo crear servicios personalizados con Systemd en Linux.'
date: 2026-03-06T22:00:00
tags: [linux, terminal, sre]
draft: false
---

**Systemd** es el sistema de inicio y gestor de servicios (demonio init) más utilizado en las distribuciones Linux modernas como Ubuntu, Debian, CentOS 7+, Fedora, entre otras. El comando **systemctl** es la herramienta principal para interactuar con Systemd y controlar el estado de todo el sistema: servicios, dispositivos montados, sockets y el estado de la propia máquina. Permite iniciar, detener, habilitar o comprobar el estado de cualquier servicio.

## Sintaxis

```bash
systemctl [ACCIÓN] [NOMBRE_DE_LA_UNIDAD]
```

Una **unidad** (unit) es el archivo de configuración que describe un servicio, un dispositivo o un punto de montaje (por ejemplo: `apache2.service`, `sshd.service`). Si no se especifica el sufijo `.service`, `systemctl` lo asume automáticamente.

## Acciones principales

| Acción      | Descripción                                                                            | Ejemplo                           |
| ----------- | -------------------------------------------------------------------------------------- | --------------------------------- |
| `status`    | Muestra el estado actual del servicio (activo, inactivo, fallido, etc.) y últimos logs | `systemctl status sshd`           |
| `start`     | Inicia un servicio                                                                     | `sudo systemctl start apache2`    |
| `stop`      | Detiene un servicio en ejecución                                                       | `sudo systemctl stop nginx`       |
| `restart`   | Detiene y vuelve a iniciar un servicio                                                 | `sudo systemctl restart php-fpm`  |
| `reload`    | Recarga la configuración sin interrumpir el servicio (si el servicio lo soporta)       | `sudo systemctl reload nginx`     |
| `enable`    | Habilita el servicio para que inicie automáticamente al arrancar el sistema            | `sudo systemctl enable firewalld` |
| `disable`   | Deshabilita el servicio para que no inicie automáticamente al arrancar                 | `sudo systemctl disable httpd`    |
| `is-active` | Comprueba si la unidad está activa (devuelve código de salida `0` si lo está)          | `systemctl is-active sshd`        |

## Banderas comunes

| Bandera    | Descripción                                                                                      | Ejemplo                   |
| ---------- | ------------------------------------------------------------------------------------------------ | ------------------------- |
| `--user`   | Controla la instancia de Systemd a nivel de usuario (servicios iniciados por ti), no del sistema | `systemctl --user status` |
| `--failed` | Muestra solo los servicios que han fallado en su ejecución                                       | `systemctl --failed`      |

## Gestión avanzada del sistema

Más allá de controlar servicios individuales, `systemctl` permite administrar el estado general de la máquina y consultar información detallada sobre las unidades cargadas.

| Tarea                                                | Comando                                |
| ---------------------------------------------------- | -------------------------------------- |
| Listar todos los servicios cargados en memoria       | `systemctl list-units --type=service`  |
| Ver la jerarquía de dependencias de un servicio      | `systemctl list-dependencies sshd`     |
| Apagar el sistema                                    | `sudo systemctl poweroff`              |
| Reiniciar el sistema                                 | `sudo systemctl reboot`                |
| Cambiar al modo de un solo usuario (rescate)         | `sudo systemctl isolate rescue.target` |
| Recargar Systemd tras modificar un archivo de unidad | `sudo systemctl daemon-reload`         |

> **Importante:** ejecuta `sudo systemctl daemon-reload` cada vez que crees o modifiques un archivo de unidad (`.service`). Sin este paso, Systemd no reconocerá los cambios.

## Crear servicios personalizados

Los archivos de unidad de servicio le indican a Systemd cómo debe manejar un programa: cómo iniciarlo, dónde encontrarlo, qué usuario debe usarlo y qué hacer si falla. A continuación se muestra el proceso completo usando una aplicación **Next.js** como ejemplo.

### Crear el archivo de unidad (.service)

Crea un archivo con la extensión `.service` en el directorio de configuración de Systemd:

```bash
sudo nano /etc/systemd/system/nextjs-app.service
```

### Contenido del archivo

Añade el siguiente contenido, reemplazando los valores entre corchetes (`[...]`) con los datos de tu aplicación:

```ini
[Unit]
Description=Servicio de aplicacion Next.js para [nombre_de_tu_app]
After=network.target

[Service]
User=[usuario_linux]
WorkingDirectory=/home/[usuario_linux]/[ruta_a_tu_app]
ExecStart=/usr/bin/npm start
Restart=always
StandardOutput=syslog
StandardError=syslog

[Install]
WantedBy=multi-user.target
```

| Sección     | Directiva          | Descripción                                                                        |
| ----------- | ------------------ | ---------------------------------------------------------------------------------- |
| `[Unit]`    | `Description`      | Nombre descriptivo del servicio                                                    |
| `[Unit]`    | `After`            | Asegura que el servicio inicie después de que la red esté activa                   |
| `[Service]` | `User`             | Usuario bajo el que se ejecutará el servicio (ej. `www-data` o tu usuario)         |
| `[Service]` | `WorkingDirectory` | Directorio raíz de la aplicación                                                   |
| `[Service]` | `ExecStart`        | Comando para iniciar el servicio (usa la ruta completa al binario)                 |
| `[Service]` | `Restart`          | Política de reinicio (`always` reinicia el servicio si se detiene inesperadamente) |
| `[Service]` | `StandardOutput`   | Redirige la salida estándar a los logs del sistema                                 |
| `[Service]` | `StandardError`    | Redirige los errores a los logs del sistema                                        |
| `[Install]` | `WantedBy`         | Indica que el servicio debe iniciarse en el modo multiusuario (arranque normal)    |

> La ruta completa a `npm` o `node` (por ejemplo `/usr/bin/npm`) se puede encontrar ejecutando `which npm` o `which node`.

### Aplicar y habilitar el servicio

Una vez guardado el archivo, ejecuta los siguientes comandos para que Systemd reconozca, cargue y active el nuevo servicio:

| Tarea            | Comando                                    | Descripción                                                                         |
| ---------------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| Recargar Systemd | `sudo systemctl daemon-reload`             | Obliga a Systemd a leer y cargar el nuevo archivo `.service`. Este paso es esencial |
| Habilitar inicio | `sudo systemctl enable nextjs-app.service` | Configura el servicio para que inicie automáticamente en cada arranque del sistema  |
| Iniciar ahora    | `sudo systemctl start nextjs-app.service`  | Inicia el servicio inmediatamente, sin necesidad de reiniciar                       |

### Verificar y depurar

Utiliza estos comandos para confirmar que la aplicación se está ejecutando correctamente:

| Tarea              | Comando                                     |
| ------------------ | ------------------------------------------- |
| Ver estado         | `systemctl status nextjs-app.service`       |
| Ver logs en vivo   | `sudo journalctl -u nextjs-app.service -f`  |
| Reiniciar servicio | `sudo systemctl restart nextjs-app.service` |

## Buenas prácticas

- **Ejecuta `daemon-reload` después de cada cambio** — siempre que crees o modifiques un archivo `.service`, recarga Systemd para que los cambios surtan efecto.
- **Usa `enable` junto con `start`** — habilitar un servicio solo configura el inicio automático en el arranque; no lo inicia en el momento. Combina ambos comandos para activarlo de inmediato.
- **Prefiere `reload` sobre `restart` cuando sea posible** — si el servicio soporta recarga de configuración en caliente, usa `reload` para evitar interrupciones en las conexiones activas.
- **Consulta los logs con `journalctl`** — usa `sudo journalctl -u nombre.service -f` para depurar servicios en tiempo real y diagnosticar fallos rápidamente.
- **Especifica rutas absolutas en `ExecStart`** — el entorno de ejecución de Systemd es mínimo y no carga el `PATH` completo del usuario. Usa `which` para obtener la ruta al binario.
- **Configura `Restart=always` en servicios críticos** — garantiza que el servicio se recupere automáticamente ante caídas inesperadas.
- **Revisa los servicios fallidos periódicamente** — ejecuta `systemctl --failed` para identificar servicios que requieren atención.
- **Usa un usuario no root en `User`** — ejecutar servicios con un usuario específico y con privilegios limitados reduce la superficie de ataque en caso de una vulnerabilidad.

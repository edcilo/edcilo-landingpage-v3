---
title: 'Fail2ban: protección contra ataques de fuerza bruta en Linux'
description: 'Guía de referencia de Fail2ban: instalación en Debian, configuración de jails, comandos esenciales y buenas prácticas para proteger servicios expuestos a internet.'
date: 2026-03-04T12:00:00
tags: [linux, seguridad, sre]
draft: false
---

**Fail2ban** es un servicio de prevención de intrusiones que monitorea los logs del sistema en busca de intentos fallidos de autenticación. Cuando detecta múltiples intentos fallidos desde una misma dirección IP, la bloquea automáticamente durante un periodo configurable mediante reglas de firewall (`iptables`, `nftables` o `ufw`).

Es especialmente útil para proteger servicios expuestos a internet como SSH, Nginx, Apache o servidores de correo.

## Instalación

```bash
sudo apt update && sudo apt install fail2ban
```

Fail2ban se instala como servicio de systemd. Después de la instalación, verifica que esté activo:

```bash
sudo systemctl status fail2ban
```

Para habilitarlo en el arranque del sistema:

```bash
sudo systemctl enable fail2ban
```

## Archivos de configuración

| Archivo                       | Descripción                                                           |
| ----------------------------- | --------------------------------------------------------------------- |
| `/etc/fail2ban/fail2ban.conf` | Configuración general del demonio (nivel de log, socket, etc.)        |
| `/etc/fail2ban/jail.conf`     | Definición de todos los jails disponibles con sus valores por defecto |
| `/etc/fail2ban/jail.local`    | **Archivo de personalización** — sobreescribe valores de `jail.conf`  |
| `/etc/fail2ban/jail.d/*.conf` | Archivos de configuración adicionales por servicio                    |
| `/etc/fail2ban/filter.d/`     | Filtros (expresiones regulares) que analizan los logs                 |
| `/etc/fail2ban/action.d/`     | Acciones a ejecutar cuando se detecta un ataque                       |

> **Importante:** nunca edites `jail.conf` directamente. Las actualizaciones del paquete sobreescriben este archivo. Usa `jail.local` o archivos en `jail.d/` para tus personalizaciones.

## Configuración básica

Crea el archivo de configuración local:

```bash
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

Edita el archivo con los valores globales deseados:

```bash
sudo nano /etc/fail2ban/jail.local
```

### Parámetros globales

En la sección `[DEFAULT]` se definen los valores que aplican a todos los jails:

```ini
[DEFAULT]
# Tiempo de bloqueo en segundos (10 minutos)
bantime  = 600

# Ventana de tiempo en la que se cuentan los intentos fallidos
findtime = 600

# Número máximo de intentos fallidos antes del bloqueo
maxretry = 5

# Acción de bloqueo (iptables, nftables, ufw, etc.)
banaction = iptables-multiport

# Dirección de correo para notificaciones (opcional)
destemail = admin@ejemplo.com

# Remitente del correo de notificación
sender   = fail2ban@ejemplo.com
```

| Parámetro   | Descripción                                                     |
| ----------- | --------------------------------------------------------------- |
| `bantime`   | Duración del bloqueo. Usa `-1` para bloqueo permanente          |
| `findtime`  | Periodo en el que se acumulan los intentos fallidos             |
| `maxretry`  | Intentos fallidos permitidos antes de aplicar el bloqueo        |
| `banaction` | Backend de firewall para aplicar los bloqueos                   |
| `ignoreip`  | IPs o rangos que nunca serán bloqueados (ej. `127.0.0.1/8 ::1`) |

## Configurar un jail para SSH

El jail de SSH suele estar habilitado por defecto. Para personalizarlo, agrega o edita en `jail.local`:

```ini
[sshd]
enabled  = true
port     = ssh
filter   = sshd
logpath  = /var/log/auth.log
maxretry = 3
bantime  = 3600
```

Después de modificar la configuración, reinicia el servicio:

```bash
sudo systemctl restart fail2ban
```

## Jails comunes

### Nginx (autenticación básica)

```ini
[nginx-http-auth]
enabled  = true
port     = http,https
filter   = nginx-http-auth
logpath  = /var/log/nginx/error.log
maxretry = 3
```

### Apache (autenticación básica)

```ini
[apache-auth]
enabled  = true
port     = http,https
filter   = apache-auth
logpath  = /var/log/apache2/error.log
maxretry = 3
```

### Nginx (bloquear bots y escaneos)

```ini
[nginx-botsearch]
enabled  = true
port     = http,https
filter   = nginx-botsearch
logpath  = /var/log/nginx/access.log
maxretry = 2
```

## Comandos esenciales

### Estado general

```bash
sudo fail2ban-client status
```

Muestra la lista de jails activos.

### Estado de un jail específico

```bash
sudo fail2ban-client status sshd
```

Muestra las IPs bloqueadas, el total de bloqueos y los intentos fallidos detectados.

### Bloquear una IP manualmente

```bash
sudo fail2ban-client set sshd banip 192.168.1.100
```

### Desbloquear una IP

```bash
sudo fail2ban-client set sshd unbanip 192.168.1.100
```

### Recargar configuración

```bash
sudo fail2ban-client reload
```

Recarga la configuración sin detener el servicio ni perder los bloqueos activos.

### Verificar un filtro contra un log

```bash
sudo fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf
```

Útil para probar que un filtro detecta correctamente los intentos fallidos en un archivo de log.

## Crear un filtro personalizado

Si necesitas proteger un servicio que no tiene un filtro incluido, puedes crear uno en `/etc/fail2ban/filter.d/`:

```bash
sudo nano /etc/fail2ban/filter.d/mi-app.conf
```

```ini
[Definition]
failregex = ^<HOST> - .* "POST /login HTTP/.*" 401
ignoreregex =
```

Luego, crea el jail correspondiente en `jail.local`:

```ini
[mi-app]
enabled  = true
port     = http,https
filter   = mi-app
logpath  = /var/log/mi-app/access.log
maxretry = 5
bantime  = 1800
```

## Bloqueo incremental

Desde la versión 0.11, Fail2ban soporta incremento progresivo del tiempo de bloqueo para reincidentes:

```ini
[DEFAULT]
bantime.increment    = true
bantime.factor       = 2
bantime.maxtime      = 4w
bantime.overalljails = true
```

| Parámetro              | Descripción                                              |
| ---------------------- | -------------------------------------------------------- |
| `bantime.increment`    | Habilita el incremento progresivo                        |
| `bantime.factor`       | Multiplicador del tiempo de bloqueo en cada reincidencia |
| `bantime.maxtime`      | Tiempo máximo de bloqueo (ej. `4w` = 4 semanas)          |
| `bantime.overalljails` | Cuenta las reincidencias a través de todos los jails     |

## Buenas prácticas

- **Configura `ignoreip` con tus IPs de confianza** — evita bloquearte a ti mismo al conectarte desde tu red local o VPN.
- **Usa `bantime.increment`** — el bloqueo progresivo disuade a atacantes persistentes sin bloquear permanentemente errores legítimos.
- **Revisa los logs periódicamente** — ejecuta `sudo fail2ban-client status sshd` para detectar patrones de ataque.
- **Combina Fail2ban con UFW** — usa `banaction = ufw` si ya usas UFW como firewall principal.
- **Prueba los filtros antes de activarlos** — usa `fail2ban-regex` para validar que las expresiones regulares coincidan con las líneas del log.
- **No reduzcas `maxretry` demasiado** — un valor muy bajo puede bloquear usuarios legítimos que cometen errores al escribir su contraseña.

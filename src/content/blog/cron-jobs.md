---
title: 'Cron Jobs: programacion de tareas automaticas en Linux'
description: 'Guia tecnica completa sobre Cron Jobs en Linux: sintaxis del crontab, variables de entorno, gestion del servicio, ejemplos de produccion, comparativa con anacron y systemd timers, errores comunes y buenas practicas de seguridad.'
date: 2026-03-07T18:00:00
tags: [linux, terminal, sre]
draft: false
---

**Cron** es el demonio (servicio en segundo plano) de programacion de tareas en sistemas operativos tipo Unix. Un **Cron Job** es una tarea o comando que se ejecuta automaticamente en un momento o intervalo regular y predefinido. Es una de las herramientas mas fundamentales para la administracion de sistemas Linux, utilizada en tareas como backups automaticos, limpieza de archivos temporales, renovacion de certificados SSL y monitoreo de servicios.

## Verificacion e instalacion

Cron viene preinstalado en la mayoria de distribuciones Linux. Para verificar su disponibilidad:

```bash
crontab -V
which cron
```

En caso de no estar instalado:

```bash
# Debian/Ubuntu
sudo apt install cron

# RHEL/Fedora
sudo dnf install cronie

# Arch Linux
sudo pacman -S cronie
```

Despues de instalar, asegurate de que el servicio este activo:

```bash
sudo systemctl enable --now cron
```

## Archivo de tareas (Crontab)

Cada usuario tiene su propio archivo de configuracion de tareas llamado **crontab** (cron table). El sistema tambien mantiene un crontab global en `/etc/crontab` y directorios de ejecucion periodica en `/etc/cron.d/`, `/etc/cron.daily/`, `/etc/cron.hourly/`, `/etc/cron.weekly/` y `/etc/cron.monthly/`.

### Sintaxis del horario

Cada linea en el crontab sigue este formato para definir cuando se ejecutara la tarea:

```
* * * * * [Comando a ejecutar]
| | | | |
| | | | +-- Dia de la semana (0 - 7, donde 0 o 7 es Domingo)
| | | +-- Mes (1 - 12)
| | +-- Dia del mes (1 - 31)
| +-- Hora (0 - 23)
+-- Minuto (0 - 59)
```

### Operadores especiales

| Operador | Descripcion      | Ejemplo                          |
| -------- | ---------------- | -------------------------------- |
| `*`      | Cualquier valor  | `* * * * *` (cada minuto)        |
| `,`      | Lista de valores | `0,30 * * * *` (minuto 0 y 30)   |
| `-`      | Rango de valores | `0 9-17 * * *` (de 9:00 a 17:00) |
| `/`      | Incremento       | `*/10 * * * *` (cada 10 minutos) |

### Atajos predefinidos

Cron acepta cadenas especiales que reemplazan los cinco campos de tiempo:

| Atajo      | Equivalente | Descripcion                                |
| ---------- | ----------- | ------------------------------------------ |
| `@reboot`  | --          | Se ejecuta una vez al iniciar el sistema   |
| `@yearly`  | `0 0 1 1 *` | Una vez al ano (1 de enero a medianoche)   |
| `@monthly` | `0 0 1 * *` | El primer dia de cada mes a medianoche     |
| `@weekly`  | `0 0 * * 0` | Una vez a la semana (domingo a medianoche) |
| `@daily`   | `0 0 * * *` | Una vez al dia a medianoche                |
| `@hourly`  | `0 * * * *` | Al inicio de cada hora                     |

### Ejemplos de sintaxis de tiempo

| Expresion          | Descripcion                                         |
| ------------------ | --------------------------------------------------- |
| `0 2 * * *`        | Todos los dias a las 2:00 AM                        |
| `*/15 * * * *`     | Cada 15 minutos (a los minutos 0, 15, 30, 45)       |
| `0 0 1 * *`        | El primer dia de cada mes a medianoche              |
| `30 8 * * 1-5`     | Lunes a viernes a las 8:30 AM                       |
| `0 */4 * * *`      | Cada 4 horas (a las 0:00, 4:00, 8:00, ...)          |
| `0 9,18 * * *`     | A las 9:00 y a las 18:00 todos los dias             |
| `0 0 * * 0`        | Cada domingo a medianoche                           |
| `0 3 1,15 * *`     | Los dias 1 y 15 de cada mes a las 3:00 AM           |
| `*/5 9-17 * * 1-5` | Cada 5 min en horario laboral (lun-vie, 9:00-17:00) |

## Variables de entorno en el crontab

El entorno de ejecucion de cron es minimo y no carga el perfil del usuario (`~/.bashrc`, `~/.profile`). Es posible definir variables de entorno directamente al inicio del archivo crontab:

```bash
# Shell que ejecutara los comandos
SHELL=/bin/bash

# PATH para localizar binarios
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Direccion de correo para notificaciones de salida
MAILTO=admin@ejemplo.com

# Zona horaria (requiere soporte del sistema)
TZ=America/Mexico_City

# --- Tareas programadas ---
0 2 * * * /usr/local/bin/backup.sh
```

| Variable | Descripcion                                                                                     |
| -------- | ----------------------------------------------------------------------------------------------- |
| `SHELL`  | Define el interprete de comandos. Por defecto es `/bin/sh`                                      |
| `PATH`   | Rutas donde cron buscara los binarios. Si no se define, el PATH es muy limitado                 |
| `MAILTO` | Direccion de correo para enviar la salida de los jobs. Si se deja vacio (`MAILTO=""`), no envia |
| `TZ`     | Zona horaria para la evaluacion de los horarios. Util en servidores con zona UTC                |

## Gestion del servicio (demonio Cron)

El servicio principal que ejecuta las tareas se llama generalmente `cron` o `crond`.

| Tarea               | Comando (systemd)             | Comando (SysVinit)          |
| ------------------- | ----------------------------- | --------------------------- |
| Iniciar servicio    | `sudo systemctl start cron`   | `sudo service cron start`   |
| Detener servicio    | `sudo systemctl stop cron`    | `sudo service cron stop`    |
| Reiniciar servicio  | `sudo systemctl restart cron` | `sudo service cron restart` |
| Habilitar al inicio | `sudo systemctl enable cron`  | --                          |
| Ver estado          | `sudo systemctl status cron`  | `sudo service cron status`  |

> **Nota:** en distribuciones basadas en RHEL/CentOS, el servicio se llama `crond` en lugar de `cron`.

## Gestion de los Cron Jobs

Para trabajar con tu archivo crontab personal:

| Tarea               | Comando                      | Descripcion                                                                                |
| ------------------- | ---------------------------- | ------------------------------------------------------------------------------------------ |
| Editar/Agregar      | `crontab -e`                 | Abre el editor de texto para agregar, modificar o eliminar tareas                          |
| Listar              | `crontab -l`                 | Muestra una lista de todas las tareas programadas actualmente                              |
| Eliminar todos      | `crontab -r`                 | **Peligroso:** elimina todas las tareas programadas por el usuario actual sin confirmacion |
| Eliminar (confirm)  | `crontab -ri`                | Solicita confirmacion antes de eliminar (disponible en algunas distribuciones)             |
| Ver de otro usuario | `sudo crontab -u usuario -l` | Muestra las tareas de otro usuario (requiere privilegios root)                             |

## Ejemplos listos para produccion

### Backup diario de base de datos

```bash
# Backup de PostgreSQL todos los dias a las 2:00 AM
0 2 * * * /usr/bin/pg_dump -U postgres mi_base | /usr/bin/gzip > /backups/db/mi_base-$(date +\%Y\%m\%d).sql.gz 2>> /var/log/backup-db.log
```

### Rotacion y limpieza de logs

```bash
# Eliminar logs con mas de 30 dias cada domingo a las 3:00 AM
0 3 * * 0 /usr/bin/find /var/log/app/ -name "*.log" -mtime +30 -delete >> /var/log/limpieza.log 2>&1
```

### Renovacion de certificados SSL

```bash
# Intentar renovar certificados con Certbot dos veces al dia
0 3,15 * * * /usr/bin/certbot renew --quiet --deploy-hook "/usr/bin/systemctl reload nginx" >> /var/log/certbot-renew.log 2>&1
```

### Monitoreo de disco

```bash
# Verificar uso de disco cada hora y alertar si supera el 90%
0 * * * * /usr/local/bin/check-disk.sh >> /var/log/disk-monitor.log 2>&1
```

### Sincronizacion de archivos entre servidores

```bash
# Sincronizar archivos con un servidor remoto cada 6 horas
0 */6 * * * /usr/bin/rsync -avz --delete /var/www/app/ usuario@backup-server:/backups/app/ >> /var/log/rsync-sync.log 2>&1
```

### Reinicio programado de servicio

```bash
# Reiniciar la aplicacion web cada lunes a las 4:00 AM
0 4 * * 1 /usr/bin/systemctl restart mi-app.service >> /var/log/restart-app.log 2>&1
```

## Ver logs (registro de ejecucion)

Los Cron Jobs registran su actividad en el sistema para permitirte verificar si se ejecutaron correctamente.

| Sistema de log              | Ruta tipica del log  | Comando para ver                  |
| --------------------------- | -------------------- | --------------------------------- |
| Sistemas modernos (systemd) | Utiliza `journalctl` | `sudo journalctl -u cron.service` |
| Debian/Ubuntu               | syslog               | `sudo grep CRON /var/log/syslog`  |
| RHEL/CentOS                 | cron                 | `sudo cat /var/log/cron`          |

Para ver los logs en tiempo real:

```bash
# Seguimiento en vivo de la ejecucion de cron jobs
sudo journalctl -u cron.service -f

# Filtrar logs de cron en syslog (Debian/Ubuntu)
sudo tail -f /var/log/syslog | grep CRON
```

## Cron vs Anacron vs Systemd Timers

| Caracteristica    | Cron                            | Anacron                          | Systemd Timers                     |
| ----------------- | ------------------------------- | -------------------------------- | ---------------------------------- |
| Precision         | Al minuto                       | Al dia                           | Al segundo (o monotonic)           |
| Maquina apagada   | No ejecuta tareas perdidas      | Ejecuta al encender si se perdio | Configurable con `Persistent=true` |
| Requiere root     | No (cada usuario tiene crontab) | Si (solo root por defecto)       | No (soporta unidades de usuario)   |
| Configuracion     | Archivo crontab                 | `/etc/anacrontab`                | Archivos `.timer` y `.service`     |
| Caso de uso ideal | Servidores 24/7                 | Escritorios y laptops            | Tareas con dependencias complejas  |

- **Cron** es la opcion clasica y mas extendida para servidores que estan encendidos permanentemente.
- **Anacron** complementa a cron en sistemas que no estan siempre encendidos (laptops, estaciones de trabajo), asegurando que las tareas diarias/semanales/mensuales se ejecuten aunque la maquina haya estado apagada.
- **Systemd Timers** son la alternativa moderna que ofrece mayor control: precision al segundo, dependencias entre servicios, logs integrados con `journalctl` y ejecucion de tareas perdidas.

## Errores comunes y diagnostico

### La tarea no se ejecuta

```bash
# 1. Verificar que el servicio cron esta activo
sudo systemctl status cron

# 2. Verificar que la tarea esta registrada
crontab -l

# 3. Revisar los logs en busca de errores
sudo grep CRON /var/log/syslog
```

### Problemas frecuentes

| Problema                                   | Causa                                             | Solucion                                                        |
| ------------------------------------------ | ------------------------------------------------- | --------------------------------------------------------------- |
| Comando no encontrado                      | El `PATH` de cron es minimo                       | Usar rutas absolutas (`/usr/bin/python3` en lugar de `python3`) |
| El script no tiene permisos                | Falta el bit de ejecucion                         | `chmod +x /ruta/al/script.sh`                                   |
| Variables de entorno no disponibles        | Cron no carga `~/.bashrc`                         | Definir variables en el crontab o al inicio del script          |
| El `%` causa errores                       | Cron interpreta `%` como salto de linea           | Escapar con `\%` (ej. `date +\%Y\%m\%d`)                        |
| La tarea se ejecuta pero no produce salida | La salida no esta redirigida                      | Agregar `>> /ruta/log.log 2>&1`                                 |
| Zona horaria incorrecta                    | El servidor usa UTC y el crontab asume hora local | Definir `TZ` en el crontab o ajustar la hora del sistema        |
| Tarea ejecutada en horario inesperado      | Error en la sintaxis de los cinco campos          | Validar la expresion en [crontab.guru](https://crontab.guru)    |

### Depuracion paso a paso

```bash
# Ejecutar el comando manualmente para confirmar que funciona
/usr/local/bin/mi-script.sh

# Verificar permisos del script
ls -la /usr/local/bin/mi-script.sh

# Simular el entorno minimo de cron
env -i SHELL=/bin/bash PATH=/usr/bin:/bin HOME=$HOME /usr/local/bin/mi-script.sh

# Verificar que el archivo crontab no tiene errores de sintaxis
crontab -l | head -20
```

## Buenas practicas

- **Usa rutas absolutas en los comandos** -- el entorno de ejecucion de cron es minimo y no carga el `PATH` completo del usuario. Ejecuta `which comando` para obtener la ruta.
- **Redirige la salida a un log** -- agrega `>> /var/log/mi-tarea.log 2>&1` al final del comando para capturar tanto la salida estandar como los errores.
- **Prueba el comando manualmente antes de programarlo** -- ejecuta el comando directamente en la terminal para verificar que funciona antes de agregarlo al crontab.
- **Documenta cada entrada con un comentario** -- agrega una linea `# Descripcion de la tarea` encima de cada job para facilitar el mantenimiento.
- **Evita `crontab -r` sin precaucion** -- un error al escribir `-r` en lugar de `-e` eliminara todas tus tareas sin confirmacion. Usa `crontab -ri` si tu distribucion lo soporta.
- **Respalda tu crontab periodicamente** -- ejecuta `crontab -l > ~/crontab-backup.txt` para mantener una copia de seguridad.
- **Escapa el caracter `%`** -- cron interpreta `%` como un salto de linea. Usa `\%` dentro de los comandos.
- **Evita comandos destructivos sin proteccion** -- nunca uses `rm -rf /` o similares sin validaciones previas. Usa variables con rutas verificadas.
- **Establece `MAILTO` para notificaciones** -- recibir la salida por correo permite detectar fallos rapidamente.
- **Revisa los logs periodicamente** -- verifica que las tareas se ejecutan en el horario esperado y sin errores.
- **Usa permisos restrictivos en los scripts** -- asegurate de que solo el propietario pueda modificar los scripts ejecutados por cron (`chmod 700`).

## Cheat sheet

### Expresiones de tiempo

| Expresion      | Descripcion                   |
| -------------- | ----------------------------- |
| `* * * * *`    | Cada minuto                   |
| `*/5 * * * *`  | Cada 5 minutos                |
| `0 * * * *`    | Cada hora                     |
| `0 0 * * *`    | Cada dia a medianoche         |
| `0 0 * * 0`    | Cada domingo a medianoche     |
| `0 0 1 * *`    | Primer dia de cada mes        |
| `0 0 1 1 *`    | Primer dia del ano            |
| `30 8 * * 1-5` | Lunes a viernes a las 8:30 AM |
| `0 */4 * * *`  | Cada 4 horas                  |
| `@reboot`      | Al iniciar el sistema         |

### Comandos clave

| Tarea                         | Comando                      |
| ----------------------------- | ---------------------------- |
| Editar crontab                | `crontab -e`                 |
| Listar tareas                 | `crontab -l`                 |
| Eliminar todas las tareas     | `crontab -ri`                |
| Respaldar crontab             | `crontab -l > ~/crontab.bak` |
| Restaurar crontab             | `crontab ~/crontab.bak`      |
| Ver tareas de otro usuario    | `sudo crontab -u usuario -l` |
| Ver logs de cron              | `sudo journalctl -u cron -f` |
| Verificar estado del servicio | `sudo systemctl status cron` |

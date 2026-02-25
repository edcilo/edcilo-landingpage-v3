---
title: 'Cron Jobs: programación de tareas automáticas en Linux'
description: 'Guía de referencia sobre Cron Jobs en Linux: sintaxis del crontab, gestión del servicio, administración de tareas y revisión de logs.'
date: 2026-02-25T20:00:00
tags: [linux, terminal, sre]
draft: false
---

**Cron** es el demonio (servicio en segundo plano) de programación de tareas en sistemas operativos tipo Unix. Un Cron Job es una tarea o comando que se ejecuta automáticamente en un momento o intervalo regular y predefinido.

## Archivo de tareas (Crontab)

Cada usuario tiene su propio archivo de configuración de tareas (crontab). Cada línea en el crontab sigue este formato para definir cuándo se ejecutará la tarea:

```
* * * * * [Comando a ejecutar]
| | | | |
| | | | └─ Día de la semana (0 - 7, donde 0 o 7 es Domingo)
| | | └─ Mes (1 - 12)
| | └─ Día del mes (1 - 31)
| └─ Hora (0 - 23)
└─ Minuto (0 - 59)
```

### Ejemplos de sintaxis de tiempo

| Expresión      | Descripción                                   |
| -------------- | --------------------------------------------- |
| `0 2 * * *`    | Todos los días a las 2:00 AM                  |
| `*/15 * * * *` | Cada 15 minutos (a los minutos 0, 15, 30, 45) |
| `0 0 1 * *`    | El primer día de cada mes a medianoche        |

## Gestión del servicio (demonio Cron)

El servicio principal que ejecuta las tareas se llama generalmente `cron` o `crond`.

| Tarea               | Comando (systemd)            | Comando (SysVinit)         |
| ------------------- | ---------------------------- | -------------------------- |
| Iniciar servicio    | `sudo systemctl start cron`  | `sudo service cron start`  |
| Habilitar al inicio | `sudo systemctl enable cron` | —                          |
| Ver estado          | `sudo systemctl status cron` | `sudo service cron status` |

## Gestión de los Cron Jobs

Para trabajar con tu archivo crontab personal:

| Tarea          | Comando      | Descripción                                                                                |
| -------------- | ------------ | ------------------------------------------------------------------------------------------ |
| Editar/Agregar | `crontab -e` | Abre el editor de texto para agregar, modificar o eliminar tareas                          |
| Listar         | `crontab -l` | Muestra una lista de todas las tareas programadas actualmente                              |
| Eliminar todos | `crontab -r` | **Peligroso:** elimina todas las tareas programadas por el usuario actual sin confirmación |

## Ver logs (registro de ejecución)

Los Cron Jobs a menudo registran su actividad en el sistema para permitirte verificar si se ejecutaron correctamente.

| Sistema de log              | Ruta típica del log  | Comando para ver                  |
| --------------------------- | -------------------- | --------------------------------- |
| Sistemas modernos (systemd) | Utiliza `journalctl` | `sudo journalctl -u cron.service` |
| Debian/Ubuntu               | syslog o daemon.log  | `sudo grep CRON /var/log/syslog`  |
| RHEL/CentOS                 | cron o maillog       | `sudo cat /var/log/cron`          |

## Buenas prácticas

- **Usa rutas absolutas en los comandos** — el entorno de ejecución de cron es mínimo y no carga el `PATH` completo del usuario.
- **Redirige la salida a un log** — agrega `>> /var/log/mi-tarea.log 2>&1` al final del comando para capturar tanto la salida estándar como los errores.
- **Prueba el comando manualmente antes de programarlo** — ejecuta el comando directamente en la terminal para verificar que funciona antes de agregarlo al crontab.
- **Documenta cada entrada con un comentario** — agrega una línea `# Descripción de la tarea` encima de cada job para facilitar el mantenimiento.
- **Evita `crontab -r` sin precaución** — un error al escribir `-r` en lugar de `-e` eliminará todas tus tareas sin confirmación.
- **Revisa los logs periódicamente** — verifica que las tareas se ejecutan en el horario esperado y sin errores.

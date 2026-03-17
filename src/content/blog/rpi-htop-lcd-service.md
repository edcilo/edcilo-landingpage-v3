---
title: 'Raspberry Pi 4: lanzar htop automáticamente en pantalla LCD con Systemd'
description: 'Guía paso a paso para crear un servicio de Systemd que lance htop automáticamente en la pantalla LCD de 3.5" conectada por GPIO en Raspberry Pi 4, convirtiendo tu RPi en un monitor de recursos dedicado.'
date: 2026-03-17T12:00:00
tags: [linux, raspberry-pi, sre, terminal]
draft: false
---

Tienes una Raspberry Pi 4 con una pantalla de 3.5" conectada por GPIO y funcionando. Ahora quieres que cada vez que enciendas la placa, **htop se lance automáticamente en esa pantalla** sin necesidad de conectarte por SSH ni tocar nada. El resultado: un monitor de recursos dedicado que arranca solo.

La solución es crear un **servicio de Systemd** que limpie la terminal física (`tty1`), desactive el login por defecto y lance htop directamente en la pantalla. Este artículo cubre el proceso completo: preparación del entorno, creación del servicio, activación y consideraciones para entornos de producción.

> **Requisito previo:** este artículo asume que ya tienes la pantalla GPIO configurada y funcionando. Si aún no la has configurado, sigue primero la guía [Raspberry Pi 4: configurar una pantalla genérica de 3.5" por GPIO sin romper tu sistema](/blog/rpi-gpio-display-35/).

## Requisitos previos

- **Raspberry Pi 4** con Raspberry Pi OS instalado (Bookworm o posterior).
- **Pantalla de 3.5" por GPIO/SPI** configurada y funcionando (mostrando la consola del sistema al arrancar).
- Acceso a la terminal (por SSH o directamente por HDMI).
- **htop** instalado (se cubre en la siguiente sección).

## Preparar el entorno

Antes de crear el servicio, necesitas dos cosas: asegurarte de que htop esté instalado y desactivar el proceso de login que ocupa la pantalla física.

### Instalar htop

Verifica si htop está disponible en tu sistema:

```bash
which htop
```

Si no devuelve una ruta, instálalo:

```bash
sudo apt update && sudo apt install htop -y
```

Confirma la instalación verificando la versión:

```bash
htop --version
```

### Desactivar el login en la pantalla física (tty1)

Por defecto, Systemd lanza un proceso `getty` en `tty1` que muestra el prompt de login (`raspberrypi login:`). Si no lo desactivas, este proceso competirá con htop por la pantalla y verás texto superpuesto.

Detén el servicio de login en `tty1`:

```bash
sudo systemctl stop getty@tty1.service
```

Enmascáralo para que no vuelva a iniciarse en futuros arranques:

```bash
sudo systemctl mask getty@tty1.service
```

> **Nota:** `mask` es más fuerte que `disable`. Un servicio enmascarado no puede iniciarse ni manual ni automáticamente hasta que lo desenmascares con `sudo systemctl unmask getty@tty1.service`. Si necesitas un repaso sobre las acciones de systemctl, consulta la [guía de systemctl](/blog/systemctl/).

## Crear el servicio de Systemd

Un archivo de unidad `.service` le indica a Systemd exactamente cómo debe ejecutar un programa: con qué usuario, en qué terminal, qué hacer si falla y cuándo arrancarlo. Vamos a crear uno que lance htop y lo envíe a la pantalla LCD.

### Crear el archivo de unidad

Crea el archivo del servicio en el directorio de configuración de Systemd:

```bash
sudo nano /etc/systemd/system/screen-htop.service
```

### Contenido del archivo

Pega el siguiente contenido:

```ini
[Unit]
Description=Lanzar htop en pantalla LCD
After=multi-user.target
Conflicts=getty@tty1.service

[Service]
Type=simple
User=root
Environment=TERM=xterm-256color
ExecStartPre=/usr/bin/stty -F /dev/tty1 cols 100 rows 30
ExecStart=/usr/bin/htop
StandardInput=tty
StandardOutput=tty
TTYPath=/dev/tty1
TTYReset=yes
TTYVHangup=yes
Restart=always

[Install]
WantedBy=multi-user.target
```

Guarda los cambios con `Ctrl + O`, confirma con `Enter` y sal del editor con `Ctrl + X`.

### Directivas del archivo .service

Cada directiva del archivo tiene un propósito específico. La siguiente tabla explica qué hace cada una:

| Sección     | Directiva        | Descripción                                                                                                                         |
| ----------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `[Unit]`    | `Description`    | Nombre descriptivo del servicio. Aparece en los logs y en la salida de `systemctl status`.                                          |
| `[Unit]`    | `After`          | Asegura que el servicio inicie después de que el sistema alcance el modo multiusuario (red activa, servicios básicos cargados).     |
| `[Unit]`    | `Conflicts`      | Declara conflicto con `getty@tty1.service`. Si ambos intentan ejecutarse, Systemd detendrá el conflictivo.                          |
| `[Service]` | `Type`           | `simple` indica que el proceso principal es el comando de `ExecStart` y se considera iniciado inmediatamente.                       |
| `[Service]` | `User`           | Usuario bajo el que se ejecuta el servicio. `root` es necesario para acceder a `/dev/tty1`.                                         |
| `[Service]` | `Environment`    | Define la variable de entorno `TERM=xterm-256color` para que htop renderice colores correctamente.                                  |
| `[Service]` | `ExecStartPre`   | Comando que se ejecuta **antes** de `ExecStart`. Aquí configura las dimensiones de la terminal (`cols 100 rows 30`) con `stty`.     |
| `[Service]` | `ExecStart`      | Comando principal del servicio. Usa la ruta absoluta al binario de htop (`/usr/bin/htop`).                                          |
| `[Service]` | `StandardInput`  | Redirige la entrada estándar al dispositivo TTY (necesario para que htop reciba input del teclado, si lo conectas).                 |
| `[Service]` | `StandardOutput` | Redirige la salida estándar al dispositivo TTY para que htop se muestre en la pantalla.                                             |
| `[Service]` | `TTYPath`        | Especifica el dispositivo de terminal donde se ejecuta el servicio. `/dev/tty1` corresponde a la pantalla física (la LCD por GPIO). |
| `[Service]` | `TTYReset`       | Resetea la configuración de la terminal cuando el servicio se detiene. Limpia la pantalla.                                          |
| `[Service]` | `TTYVHangup`     | Envía una señal de virtual hangup a la terminal al detenerse, cerrando cualquier proceso que la esté usando.                        |
| `[Service]` | `Restart`        | `always` reinicia el servicio automáticamente si se detiene por cualquier motivo (fallo, señal, etc.).                              |
| `[Install]` | `WantedBy`       | Indica que el servicio debe iniciarse en el target `multi-user.target` (arranque normal del sistema, sin entorno gráfico).          |

> **Importante:** las directivas `TTYPath`, `StandardInput` y `StandardOutput` son clave. Sin ellas, htop se ejecutaría en segundo plano sin salida visible y el servicio no tendría ningún efecto en la pantalla.

## Activar y probar el servicio

Una vez guardado el archivo, recarga Systemd para que reconozca la nueva unidad, habilítala para el arranque automático e iníciala:

```bash
sudo systemctl daemon-reload
sudo systemctl enable screen-htop.service
sudo systemctl start screen-htop.service
```

| Comando                                     | Descripción                                                                         |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| `sudo systemctl daemon-reload`              | Obliga a Systemd a leer los archivos de unidad nuevos o modificados.                |
| `sudo systemctl enable screen-htop.service` | Configura el servicio para que inicie automáticamente en cada arranque del sistema. |
| `sudo systemctl start screen-htop.service`  | Inicia el servicio inmediatamente, sin necesidad de reiniciar.                      |

Verifica que el servicio esté corriendo:

```bash
systemctl status screen-htop.service
```

Si todo está bien, deberías ver `Active: active (running)` en la salida y htop mostrándose en la pantalla LCD.

## Ajustar las dimensiones de la pantalla

La directiva `ExecStartPre` ejecuta `stty` para configurar las dimensiones de la terminal antes de lanzar htop. Los valores `cols 100 rows 30` son un buen punto de partida para una pantalla de 3.5", pero puede que necesites ajustarlos según tu modelo específico.

| Pantalla                  | Valor sugerido     | Notas                                                      |
| ------------------------- | ------------------ | ---------------------------------------------------------- |
| 3.5" genérica (480x320)   | `cols 100 rows 30` | Punto de partida recomendado. Texto legible pero compacto. |
| 3.5" con mayor resolución | `cols 120 rows 35` | Prueba si tu pantalla soporta más densidad de texto.       |
| 2.8" genérica (320x240)   | `cols 80 rows 24`  | Pantallas más pequeñas necesitan menos columnas y filas.   |

Para cambiar las dimensiones, edita el archivo del servicio:

```bash
sudo nano /etc/systemd/system/screen-htop.service
```

Modifica la línea `ExecStartPre`:

```ini
ExecStartPre=/usr/bin/stty -F /dev/tty1 cols 120 rows 35
```

Después de guardar, recarga y reinicia el servicio:

```bash
sudo systemctl daemon-reload
sudo systemctl restart screen-htop.service
```

> **Nota:** si el texto aparece cortado o desbordado, reduce los valores. Si ves demasiado espacio vacío, auméntalos. El ajuste es iterativo.

## Consideraciones para SRE y power users

### Alternar entre htop y btop

Si prefieres **btop** (una alternativa más visual a htop), instálalo y cambia la ruta en el servicio:

```bash
sudo apt install btop -y
```

Edita el archivo del servicio y reemplaza la línea `ExecStart`:

```ini
ExecStart=/usr/bin/btop
```

Recarga y reinicia:

```bash
sudo systemctl daemon-reload
sudo systemctl restart screen-htop.service
```

> **Nota:** btop requiere más recursos de CPU y memoria que htop. En una Raspberry Pi 4, funciona bien, pero si usas un modelo con menos RAM, htop es la opción más ligera.

### Depuración con journalctl

Si el servicio no arranca o htop no se muestra en la pantalla, el primer paso es revisar los logs:

```bash
sudo journalctl -u screen-htop.service
```

Para ver los logs en tiempo real mientras depuras:

```bash
sudo journalctl -u screen-htop.service -f
```

Errores comunes y sus causas:

| Error                                        | Causa probable                                                                          |
| -------------------------------------------- | --------------------------------------------------------------------------------------- |
| `Failed to start` con código 203             | El binario de htop no existe en la ruta especificada. Verifica con `which htop`.        |
| `Failed to set up TTY`                       | `getty@tty1.service` sigue activo y bloquea la terminal. Enmascáralo.                   |
| htop se muestra pero sin colores             | La variable `TERM` no está definida o es incorrecta. Verifica que sea `xterm-256color`. |
| Texto cortado o caracteres fuera de pantalla | Las dimensiones de `stty` no coinciden con la resolución de la pantalla.                |

### Desactivar el servicio temporalmente

Si necesitas liberar `tty1` para depurar o para otro propósito:

```bash
sudo systemctl stop screen-htop.service
```

Para desactivar el inicio automático sin eliminar el servicio:

```bash
sudo systemctl disable screen-htop.service
```

Para restaurar el login normal en la pantalla:

```bash
sudo systemctl unmask getty@tty1.service
sudo systemctl start getty@tty1.service
```

## Comandos útiles

| Comando                                      | Descripción                                                |
| -------------------------------------------- | ---------------------------------------------------------- |
| `systemctl status screen-htop.service`       | Ver el estado actual del servicio                          |
| `sudo journalctl -u screen-htop.service`     | Ver los logs completos del servicio                        |
| `sudo journalctl -u screen-htop.service -f`  | Ver los logs en tiempo real                                |
| `sudo systemctl restart screen-htop.service` | Reiniciar el servicio (útil tras cambios de configuración) |
| `sudo systemctl daemon-reload`               | Recargar Systemd tras modificar el archivo `.service`      |
| `which htop`                                 | Obtener la ruta absoluta del binario de htop               |
| `sudo stty -F /dev/tty1 cols 100 rows 30`    | Ajustar las dimensiones de la terminal manualmente         |
| `sudo systemctl unmask getty@tty1.service`   | Desenmascarar el login de tty1 si necesitas restaurarlo    |

## Buenas prácticas

- **Ejecuta `daemon-reload` después de cada cambio en el archivo `.service`** -- sin este paso, Systemd no reconocerá las modificaciones y seguirá usando la versión anterior del servicio.
- **Usa rutas absolutas en `ExecStart` y `ExecStartPre`** -- el entorno de ejecución de Systemd es mínimo y no carga el `PATH` del usuario. Obtén la ruta con `which htop` o `which stty`.
- **Enmascara `getty@tty1.service` en lugar de solo deshabilitarlo** -- `mask` previene que otro servicio o dependencia reactive el login en la pantalla. `disable` no es suficiente en este caso.
- **Configura `Restart=always` para mantener el monitor activo** -- si htop se cierra inesperadamente (por ejemplo, al presionar `q` accidentalmente desde un teclado conectado), Systemd lo reiniciará automáticamente.
- **Ajusta `cols` y `rows` de forma iterativa** -- empieza con los valores sugeridos y modifica en incrementos pequeños. Un ajuste incorrecto no daña nada, solo afecta la legibilidad.
- **Revisa los logs con `journalctl` antes de buscar soluciones complejas** -- la mayoría de problemas con servicios de Systemd se diagnostican leyendo los logs. Es siempre el primer paso.
- **Documenta los cambios en el archivo `.service`** -- agrega comentarios con `#` explicando qué hace cada directiva y por qué elegiste ciertos valores. Facilita el mantenimiento a futuro.
- **Prueba el servicio tras cada reinicio del sistema** -- un servicio que funciona con `start` no siempre arranca correctamente en el boot. Reinicia la Raspberry Pi al menos una vez para confirmar.

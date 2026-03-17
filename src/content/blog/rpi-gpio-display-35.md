---
title: 'Raspberry Pi 4: configurar una pantalla genérica de 3.5" por GPIO sin romper tu sistema'
description: 'Guía paso a paso para configurar pantallas genéricas de 3.5 pulgadas (SPI/GPIO) en Raspberry Pi 4 usando drivers nativos del kernel, sin scripts de terceros que sobrescriban tu configuración.'
date: 2026-03-17T00:00:00
tags: [linux, raspberry-pi, hardware, sre]
draft: false
---

Las pantallas genéricas de 3.5 pulgadas para Raspberry Pi son baratas y abundantes en tiendas como Temu o AliExpress, pero su documentación suele ser escasa o directamente inexistente. El proceso de configuración que recomiendan muchos vendedores consiste en ejecutar scripts de repositorios como `LCD-show`, que **sobrescriben archivos del sistema** (`~/.bashrc`, `/etc/rc.local`) y rompen personalizaciones que tengas en tu terminal (Starship, aliases, colores).

La buena noticia es que no necesitas esos scripts. El kernel de Raspberry Pi OS ya incluye drivers nativos para pantallas SPI, y la configuración se reduce a editar un solo archivo. Este artículo cubre el proceso completo: conexión de hardware, configuración del arranque, calibración y resolución de problemas comunes.

## Requisitos previos

- **Raspberry Pi 4** con Raspberry Pi OS instalado (Bookworm o posterior).
- **Pantalla genérica de 3.5" con interfaz GPIO/SPI** (compatible con el driver `piscreen`).
- Acceso a la terminal (directamente por HDMI o por SSH).

## Conexión del hardware

Antes de conectar la pantalla, **apaga completamente la Raspberry Pi**. No basta con cerrar el sistema operativo; desconecta la fuente de alimentación.

La pantalla se conecta directamente a los pines GPIO de la Raspberry Pi. Los conectores deben cubrir los **pines 1 al 26** del header de 40 pines. La mayoría de pantallas genéricas de 3.5" utilizan esta disposición:

- **Pines de alimentación** (3.3V y 5V) para encender la pantalla y la retroiluminación.
- **Bus SPI** (MOSI, MISO, SCLK, CE0) para la transmisión de datos de video.
- **Pines de control** (DC, RST) para comandos del controlador de la pantalla.
- **Pines del panel táctil** (si aplica) a través de un segundo canal SPI o I2C.

> **Importante:** si conectas la pantalla y al encender la Raspberry Pi solo ves una luz blanca, significa que la pantalla recibe corriente pero no datos. Esto es normal antes de configurar el driver; indica que el bus SPI no está activo o que el overlay no está cargado.

## Configuración del arranque

La configuración se realiza editando el archivo de arranque de la Raspberry Pi. Dependiendo de la versión de Raspberry Pi OS que uses, la ubicación del archivo puede variar:

| Versión del sistema                  | Ruta del archivo            |
| ------------------------------------ | --------------------------- |
| Raspberry Pi OS Legacy (Bullseye)    | `/boot/config.txt`          |
| Raspberry Pi OS 2024/2025 (Bookworm) | `/boot/firmware/config.txt` |

Abre el archivo con tu editor preferido:

```bash
sudo nano /boot/firmware/config.txt
```

### Desactivar el driver de video acelerado

El primer paso es **desactivar el driver KMS** (Kernel Mode Setting) que la Raspberry Pi 4 usa por defecto para la salida de video por HDMI. Este driver entra en conflicto con las pantallas SPI porque ambos intentan controlar el framebuffer.

Busca la siguiente línea en el archivo:

```ini
dtoverlay=vc4-kms-v3d
```

Coméntala agregando un `#` al inicio:

```ini
#dtoverlay=vc4-kms-v3d
```

> **Nota:** al desactivar `vc4-kms-v3d`, la salida HDMI dejará de usar aceleración por GPU. Si necesitas volver a usar un monitor HDMI, reactiva esta línea y elimina el overlay de la pantalla SPI.

### Activar SPI y cargar el overlay

Ve al final del archivo, localiza la sección `[all]` y agrega las siguientes líneas:

```ini
[all]
dtparam=i2c_arm=on
dtparam=spi=on
enable_uart=1
dtoverlay=piscreen,speed=16000000,rotate=90
```

Guarda los cambios con `Ctrl + O`, confirma con `Enter` y sal del editor con `Ctrl + X`.

### Parámetros de configuración

| Parámetro            | Descripción                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| `dtparam=i2c_arm=on` | Activa el bus I2C. Necesario si la pantalla tiene panel táctil por I2C.          |
| `dtparam=spi=on`     | Activa el bus SPI, que es el canal de comunicación para los datos de video.      |
| `enable_uart=1`      | Activa la interfaz UART. Útil para depuración por consola serial.                |
| `dtoverlay=piscreen` | Carga el driver genérico `piscreen`, compatible con la mayoría de clones SPI.    |
| `speed=16000000`     | Velocidad del bus SPI en Hz (16 MHz). Valor seguro para la mayoría de pantallas. |
| `rotate=90`          | Rotación de la imagen en grados.                                                 |

Una vez guardados los cambios, reinicia la Raspberry Pi:

```bash
sudo reboot
```

Si la configuración es correcta, la pantalla debería mostrar la consola del sistema (o el escritorio, si tienes un entorno gráfico instalado) después del arranque.

## Ajustar la velocidad del bus SPI

El parámetro `speed` define la velocidad de transferencia de datos entre la Raspberry Pi y la pantalla. Un valor más alto permite mayor tasa de refresco, pero no todas las pantallas lo soportan de forma estable.

| Velocidad    | Valor               | Notas                                                          |
| ------------ | ------------------- | -------------------------------------------------------------- |
| Conservadora | `16000000` (16 MHz) | Valor seguro. Funciona con la mayoría de pantallas.            |
| Intermedia   | `24000000` (24 MHz) | Mejor refresco. Prueba si tu pantalla lo soporta.              |
| Alta         | `32000000` (32 MHz) | Solo para pantallas de buena calidad. Puede causar artefactos. |

Si notas que la pantalla va lenta o el refresco es visible, prueba subir la velocidad a `24000000`:

```ini
dtoverlay=piscreen,speed=24000000,rotate=90
```

Si aparecen artefactos visuales (líneas, parpadeos, colores incorrectos), vuelve a `16000000`.

## Rotación de la pantalla

El parámetro `rotate` controla la orientación de la imagen. Cambia el valor según como tengas montada la pantalla:

| Valor | Orientación                     |
| ----- | ------------------------------- |
| `0`   | Vertical (conector GPIO arriba) |
| `90`  | Horizontal (apaisado)           |
| `180` | Vertical invertida              |
| `270` | Horizontal invertida            |

Para cambiar la rotación, edita el archivo de configuración y modifica el parámetro:

```bash
sudo nano /boot/firmware/config.txt
```

```ini
dtoverlay=piscreen,speed=16000000,rotate=270
```

Reinicia para aplicar los cambios.

## Calibración del panel táctil

Si tu pantalla incluye panel táctil, es probable que necesites calibrarlo para que las coordenadas del toque coincidan con la posición real en la pantalla. Instala la herramienta de calibración:

```bash
sudo apt install xinput-calibrator
```

Ejecuta el calibrador:

```bash
xinput_calibrator
```

La herramienta mostrará una secuencia de puntos en la pantalla que debes tocar. Al finalizar, imprimirá una configuración que puedes guardar para que persista entre reinicios.

> **Nota:** `xinput_calibrator` requiere un entorno gráfico (X11). Si usas la Raspberry Pi solo en modo consola, la calibración del touch no aplica.

## Restaurar la salida HDMI

Si necesitas volver a usar un monitor HDMI, revierte los cambios en el archivo de configuración:

1. Elimina o comenta la línea `dtoverlay=piscreen,...`.
2. Reactiva el driver de video acelerado quitando el `#`:

```ini
dtoverlay=vc4-kms-v3d
```

Reinicia la Raspberry Pi y la imagen volverá a la salida HDMI.

## Recuperar tu perfil de terminal

Si en algún momento ejecutaste scripts de terceros (como `LCD-show`) que sobrescribieron tus archivos de configuración, puedes recuperar tu perfil de terminal con estos pasos:

Verifica que tu shell sea el correcto:

```bash
echo $SHELL
```

Si no muestra `/bin/bash` (o el shell que uses), cámbialo:

```bash
chsh -s /bin/bash
```

Recarga tu perfil:

```bash
source ~/.bashrc
```

Si el archivo `~/.bashrc` fue sobrescrito por el script, restáuralo desde la copia de seguridad del sistema:

```bash
cp /etc/skel/.bashrc ~/.bashrc
source ~/.bashrc
```

Después de esto, vuelve a instalar tus personalizaciones (Starship, aliases, etc.).

## Comandos útiles

| Comando                                         | Descripción                                           |
| ----------------------------------------------- | ----------------------------------------------------- |
| `sudo nano /boot/firmware/config.txt`           | Editar la configuración de arranque                   |
| `dmesg`                                         | Ver el log del kernel (útil para errores de SPI/GPIO) |
| `dmesg \| grep spi`                             | Filtrar mensajes del bus SPI en el log del kernel     |
| `ls /dev/fb*`                                   | Listar los framebuffers disponibles                   |
| `cat /proc/device-tree/soc/spi@7e204000/status` | Verificar si SPI está activo                          |
| `xinput_calibrator`                             | Calibrar el panel táctil                              |
| `sudo reboot`                                   | Reiniciar la Raspberry Pi                             |

## Buenas prácticas

- **Nunca uses scripts `LCD-show` de repositorios de terceros** -- estos scripts sobrescriben archivos del sistema como `~/.bashrc` y `/etc/rc.local`, eliminando tus personalizaciones y potencialmente rompiendo tu configuración.
- **Usa los drivers nativos del kernel (`dtoverlay`)** -- son más estables, no requieren dependencias externas y se actualizan junto con el sistema operativo.
- **Haz una copia de seguridad de `config.txt` antes de editarlo** -- un error en este archivo puede impedir que la Raspberry Pi arranque correctamente. Usa `sudo cp /boot/firmware/config.txt /boot/firmware/config.txt.bak`.
- **Apaga la Raspberry Pi antes de conectar o desconectar la pantalla** -- manipular los pines GPIO con el sistema encendido puede dañar la placa o la pantalla.
- **Empieza con la velocidad SPI más baja (16 MHz)** -- sube gradualmente solo si necesitas mejor refresco y verificas que no aparecen artefactos.
- **Documenta tus cambios en `config.txt`** -- agrega comentarios con `#` explicando por qué cada línea está activa o desactivada. Tu yo del futuro te lo agradecerá.
- **Verifica el log del kernel con `dmesg` si algo falla** -- los errores de SPI y GPIO se registran ahí y son la primera pista para diagnosticar problemas.

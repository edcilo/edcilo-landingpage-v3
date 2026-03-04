---
title: 'duf: una alternativa moderna a df para consultar el uso de disco'
description: 'Guía de referencia de duf: instalación en Debian, opciones de filtrado, ordenamiento, configuración y ejemplos prácticos para monitorear el uso de disco desde la terminal.'
date: 2026-03-04T12:00:00
tags: [linux, terminal, sre]
draft: false
---

**duf** (Disk Usage/Free) es una herramienta de línea de comandos que muestra el uso de disco y espacio disponible en los sistemas de archivos montados. Es una alternativa moderna a `df` con salida colorida en formato de tabla, soporte para filtrado, ordenamiento, salida JSON y compatibilidad multiplataforma (Linux, macOS, Windows, FreeBSD).

## Instalación

En Debian 12+ y Ubuntu 22.04+, **duf** está disponible en los repositorios oficiales:

```bash
sudo apt update && sudo apt install duf
```

Para versiones anteriores de Debian/Ubuntu, descarga el paquete `.deb` desde las releases de GitHub:

```bash
curl -LO https://github.com/muesli/duf/releases/download/v0.8.1/duf_0.8.1_linux_arm64.deb
sudo dpkg -i duf_0.8.1_linux_arm64.deb
```

> **Nota:** ajusta la URL según la arquitectura de tu sistema (`amd64`, `arm64`, etc.) y la versión más reciente disponible.

Verifica la instalación:

```bash
duf --version
```

## Uso básico

Ejecuta **duf** sin argumentos para ver todos los dispositivos montados:

```bash
duf
```

Para consultar un punto de montaje o ruta específica:

```bash
duf /home
```

Para incluir pseudo-filesystems, filesystems duplicados y filesystems inaccesibles:

```bash
duf --all
```

## Opciones de filtrado

**duf** permite filtrar los dispositivos mostrados según su tipo, filesystem o punto de montaje.

### Filtrado por tipo de dispositivo

| Opción   | Descripción                                          |
| -------- | ---------------------------------------------------- |
| `--only` | Muestra solo los tipos indicados (separados por `,`) |
| `--hide` | Oculta los tipos indicados (separados por `,`)       |

Los tipos disponibles son: `local`, `network`, `fuse`, `special`, `loops`, `binds`.

```bash
# Mostrar solo dispositivos locales
duf --only local

# Ocultar dispositivos especiales y loops
duf --hide special,loops
```

### Filtrado por filesystem

| Opción      | Descripción                            |
| ----------- | -------------------------------------- |
| `--only-fs` | Muestra solo los filesystems indicados |
| `--hide-fs` | Oculta los filesystems indicados       |

```bash
# Mostrar solo ext4 y btrfs
duf --only-fs ext4,btrfs

# Ocultar tmpfs
duf --hide-fs tmpfs
```

### Filtrado por punto de montaje

| Opción      | Descripción                                  |
| ----------- | -------------------------------------------- |
| `--only-mp` | Muestra solo los puntos de montaje indicados |
| `--hide-mp` | Oculta los puntos de montaje indicados       |

```bash
# Mostrar solo /home y /var
duf --only-mp /home,/var
```

## Opciones de visualización

### Ordenamiento

Ordena la salida por una columna específica:

```bash
duf --sort size
```

Columnas disponibles para ordenar: `mountpoint`, `size`, `used`, `avail`, `usage`, `inodes`, `inodes_used`, `inodes_avail`, `inodes_usage`, `type`, `filesystem`.

### Seleccionar columnas

Muestra solo las columnas especificadas:

```bash
duf --output mountpoint,size,used,avail,usage
```

### Inodos

Muestra la información de inodos en lugar del espacio en disco:

```bash
duf --inodes
```

### Tema de colores

Cambia el tema de la salida:

```bash
# Tema oscuro (por defecto)
duf --theme dark

# Tema claro
duf --theme light
```

### Salida JSON

Genera la salida en formato JSON, útil para scripts y automatización:

```bash
duf --json
```

Combínalo con `jq` para extraer datos específicos:

```bash
duf --json | jq '.[] | select(.mount_point == "/") | .usage'
```

### Ancho de salida

Controla el ancho máximo de la salida:

```bash
duf --width 120
```

## Umbrales de color

**duf** colorea los porcentajes de uso según umbrales configurables. Los valores representan los límites entre los colores verde, amarillo y rojo:

```bash
# Umbrales basados en espacio disponible (por defecto: "10G,1G")
duf --avail-threshold "10G,1G"

# Umbrales basados en porcentaje de uso (por defecto: "0.5,0.9")
duf --usage-threshold "0.5,0.9"
```

| Opción              | Descripción                                                     |
| ------------------- | --------------------------------------------------------------- |
| `--avail-threshold` | Umbrales de espacio disponible para cambio de color (2 valores) |
| `--usage-threshold` | Umbrales de porcentaje de uso para cambio de color (2 valores)  |

## Configuración

**duf** permite guardar opciones predeterminadas en un archivo de configuración YAML:

```bash
mkdir -p ~/.config/duf
nano ~/.config/duf/duf.yaml
```

Ejemplo de configuración:

```yaml
hide:
  - special
  - loops
only-fs:
  - ext4
  - btrfs
sort: usage
output:
  - mountpoint
  - size
  - used
  - avail
  - usage
theme: dark
```

Las opciones del archivo de configuración se aplican como valores por defecto y pueden ser sobreescritas con los argumentos de línea de comandos.

## Buenas prácticas

- **Crea un alias para uso cotidiano** — agrega `alias df='duf --hide special,loops'` a tu `.bashrc` o `.zshrc` para reemplazar `df` con una versión filtrada.
- **Usa `--json` para scripts** — la salida JSON es estable y fácil de parsear con `jq`, evitando problemas con el formato de la salida en texto.
- **Combínalo con `watch`** — ejecuta `watch -n 5 duf` para monitorear el uso de disco en tiempo real con actualizaciones cada 5 segundos.
- **Aprovecha el archivo de configuración** — define tus opciones predeterminadas en `~/.config/duf/duf.yaml` para evitar repetir los mismos argumentos.
- **Filtra el ruido** — usa `--hide special,loops` o el archivo de configuración para ocultar los pseudo-filesystems que no aportan información útil en el día a día.

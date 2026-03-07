---
title: 'Gzip y Tar: compresión y empaquetado de archivos en Linux'
description: 'Guía técnica de los comandos gzip y tar en Linux: compresión, empaquetado, banderas esenciales, ejemplos prácticos y flujos de trabajo para desarrolladores y administradores de sistemas.'
date: 2026-03-07T12:00:00
tags: [linux, terminal, sre]
draft: false
---

**gzip** y **tar** son dos comandos fundamentales en el ecosistema Unix/Linux que suelen usarse en conjunto. **tar** agrupa múltiples archivos y directorios en un único archivo (tarball), mientras que **gzip** comprime ese archivo para reducir su tamaño. Dominar ambos comandos es esencial para tareas cotidianas como la creación de backups, la distribución de paquetes de código y la transferencia eficiente de datos entre servidores.

## Verificación e instalación

Ambas herramientas vienen preinstaladas en la mayoría de distribuciones Linux. Para verificar su disponibilidad:

```bash
gzip --version
tar --version
```

En caso de no estar instaladas (poco común), se pueden obtener desde el gestor de paquetes:

```bash
# Debian/Ubuntu
sudo apt install gzip tar

# RHEL/Fedora
sudo dnf install gzip tar
```

## Comando gzip

**gzip** (GNU Zip) es una herramienta diseñada para comprimir un único archivo. Genera un archivo con extensión `.gz` y, por defecto, elimina el archivo original después de comprimir.

### Sintaxis

```bash
gzip [OPCIONES] [ARCHIVO]
```

### Banderas principales

| Bandera | Descripción                                                                |
| ------- | -------------------------------------------------------------------------- |
| `-d`    | Descomprime el archivo (equivale a `gunzip`)                               |
| `-k`    | Conserva el archivo original después de comprimir o descomprimir           |
| `-r`    | Comprime de forma recursiva los archivos en subdirectorios                 |
| `-v`    | Muestra información detallada con el porcentaje de compresión              |
| `-l`    | Muestra estadísticas del archivo comprimido (tamaño original, ratio, etc.) |
| `-1`    | Compresión más rápida (menor ratio)                                        |
| `-9`    | Compresión máxima (más lenta)                                              |
| `-t`    | Verifica la integridad del archivo comprimido                              |

### Ejemplos de uso

```bash
# Comprimir un archivo (elimina el original)
gzip notas.txt
# Resultado: notas.txt.gz

# Comprimir conservando el archivo original
gzip -k data.log
# Resultado: data.log y data.log.gz

# Comprimir con máxima compresión y salida detallada
gzip -9 -v backup.sql
# Resultado: backup.sql.gz  72.3% -- replaced with backup.sql.gz

# Descomprimir un archivo
gzip -d notas.txt.gz
# Resultado: notas.txt

# Descomprimir conservando el archivo comprimido
gzip -d -k notas.txt.gz
# Resultado: notas.txt y notas.txt.gz

# Comprimir recursivamente todos los archivos de un directorio
gzip -r ./logs/

# Ver estadísticas de un archivo comprimido
gzip -l backup.sql.gz

# Verificar integridad sin descomprimir
gzip -t backup.sql.gz
```

### Lectura de archivos comprimidos

Para leer el contenido de un archivo `.gz` sin descomprimirlo, se puede usar `zcat`, `zless` o `zgrep`:

```bash
# Mostrar contenido en stdout
zcat access.log.gz

# Paginar contenido comprimido
zless access.log.gz

# Buscar patrones dentro de archivos comprimidos
zgrep "ERROR" application.log.gz
```

## Comando tar

**tar** (Tape ARchiver) agrupa múltiples archivos o directorios en un solo archivo llamado tarball. Por defecto, el archivo resultante no está comprimido — la compresión se aplica combinándolo con herramientas como **gzip** o **bzip2**. Los archivos creados con tar tienen extensión `.tar`, y al comprimirse con gzip, `.tar.gz` o `.tgz`.

### Sintaxis

```bash
tar [OPCIONES] [NOMBRE_ARCHIVO_SALIDA] [ARCHIVOS_O_CARPETAS_ENTRADA]
```

### Banderas principales

La bandera `-f` siempre debe ir al final del bloque de opciones, seguida inmediatamente por el nombre del archivo de salida.

| Bandera     | Descripción                                                          |
| ----------- | -------------------------------------------------------------------- |
| `-c`        | Crea un nuevo archivo `.tar`                                         |
| `-x`        | Extrae los archivos del archivo `.tar`                               |
| `-t`        | Lista el contenido del archivo sin extraerlo                         |
| `-v`        | Muestra el progreso y los nombres de los archivos procesados         |
| `-f`        | Especifica el nombre del archivo `.tar` que se va a crear o utilizar |
| `-z`        | Comprime o descomprime usando gzip (`.tar.gz` / `.tgz`)              |
| `-j`        | Comprime o descomprime usando bzip2 (`.tar.bz2`)                     |
| `-J`        | Comprime o descomprime usando xz (`.tar.xz`)                         |
| `-C`        | Cambia al directorio especificado antes de extraer                   |
| `-p`        | Preserva los permisos originales de los archivos                     |
| `--exclude` | Excluye archivos o directorios que coincidan con el patrón indicado  |

### Ejemplos de uso

```bash
# Crear un tarball comprimido con gzip
tar -cvzf copia.tar.gz /ruta/a/carpeta/

# Extraer un tarball comprimido con gzip
tar -xvzf copia.tar.gz

# Extraer en un directorio específico
tar -xvzf copia.tar.gz -C /tmp/destino/

# Crear un archivo .tar sin compresión
tar -cvf backup.tar /home/datos/

# Listar el contenido de un tarball sin extraer
tar -tvf copia.tar.gz

# Crear un tarball excluyendo directorios
tar -cvzf proyecto.tar.gz ./proyecto --exclude='node_modules' --exclude='.git'

# Crear un tarball comprimido con bzip2
tar -cvjf backup.tar.bz2 /home/datos/

# Crear un tarball comprimido con xz (mayor compresión)
tar -cvJf backup.tar.xz /home/datos/

# Extraer preservando permisos originales
tar -xvzpf backup.tar.gz
```

## Casos de uso reales

### Backup de un directorio de proyecto

```bash
# Crear backup excluyendo dependencias y archivos temporales
tar -cvzf proyecto-$(date +%Y%m%d).tar.gz \
  ./proyecto \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist'
```

### Transferencia entre servidores

```bash
# Comprimir, transferir por SSH y extraer en destino
tar -czf - /var/www/app | ssh usuario@servidor 'tar -xzf - -C /var/www/'
```

### Backup incremental de logs

```bash
# Comprimir logs individuales del día anterior
find /var/log/app/ -name "*.log" -mtime 1 -exec gzip -9 {} \;
```

### Restaurar un backup específico

```bash
# Extraer solo un archivo particular del tarball
tar -xvzf backup.tar.gz ruta/al/archivo.conf
```

### Comparar algoritmos de compresión

```bash
# gzip: balance entre velocidad y compresión
tar -cvzf backup.tar.gz ./datos/

# bzip2: mejor compresión, más lento
tar -cvjf backup.tar.bz2 ./datos/

# xz: máxima compresión, el más lento
tar -cvJf backup.tar.xz ./datos/
```

## Resumen de combinaciones frecuentes

| Tarea                      | Comando                                   |
| -------------------------- | ----------------------------------------- |
| Comprimir carpeta          | `tar -cvzf archivo.tar.gz /ruta/carpeta/` |
| Extraer tarball            | `tar -xvzf archivo.tar.gz`                |
| Extraer en ruta específica | `tar -xvzf archivo.tar.gz -C /destino/`   |
| Listar contenido           | `tar -tvf archivo.tar.gz`                 |
| Comprimir archivo único    | `gzip -k archivo.log`                     |
| Descomprimir archivo único | `gzip -dk archivo.log.gz`                 |
| Verificar integridad       | `gzip -t archivo.gz`                      |

## Buenas prácticas

- **Usa `-k` con gzip para conservar originales** — evita perder el archivo fuente accidentalmente durante la compresión.
- **Excluye directorios innecesarios** — en proyectos de desarrollo, omite `node_modules`, `.git`, `dist` y otros directorios generados.
- **Incluye la fecha en el nombre del backup** — facilita la identificación y rotación de archivos, por ejemplo `backup-$(date +%Y%m%d).tar.gz`.
- **Verifica tarballs después de crearlos** — usa `tar -tvf` para listar el contenido y confirmar que incluye los archivos esperados.
- **Usa `gzip -t` para verificar integridad** — especialmente útil después de transferir archivos comprimidos entre servidores.
- **Preserva permisos con `-p`** — al restaurar backups de servidores, asegura que los permisos de archivos se mantengan intactos.
- **Prefiere xz para almacenamiento a largo plazo** — ofrece la mejor compresión cuando el tiempo de compresión no es crítico.

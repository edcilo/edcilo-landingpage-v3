---
title: 'scp: copia segura de archivos entre servidores en Linux'
description: 'Guía práctica de scp (secure copy) con los comandos esenciales para copiar archivos y directorios de forma segura entre máquinas locales y servidores remotos usando SSH.'
date: 2026-03-06T23:00:00
tags: [linux, terminal, sre]
draft: false
---

**scp** (secure copy) es una utilidad de línea de comandos que permite copiar archivos y directorios de forma segura entre dos ubicaciones: tu máquina local y un servidor remoto, o entre dos servidores remotos. Utiliza el protocolo **SSH** para la transferencia de datos y la autenticación, asegurando que la información viaje encriptada en todo momento.

## Sintaxis

La sintaxis de `scp` es similar a la del comando `cp` (copy) de Linux, pero incluye la especificación de hosts remotos mediante el formato `usuario@servidor:ruta`.

```bash
scp [OPCIONES] [ORIGEN] [DESTINO]
```

El origen y el destino pueden ser:

- **Local:** una ruta de archivo en tu máquina actual (ej: `~/documento.txt`).
- **Remoto:** una ruta que incluye usuario y host (ej: `juan@servidor:/var/www/`).

## Banderas comunes

| Bandera        | Descripción                                                                               |
| -------------- | ----------------------------------------------------------------------------------------- |
| `-r`           | Recursivo: copia directorios completos (carpetas y su contenido)                          |
| `-P [puerto]`  | Especifica un puerto diferente al predeterminado (22) para la conexión SSH                |
| `-i [archivo]` | Especifica la llave privada para la autenticación (si usas llaves en lugar de contraseña) |
| `-C`           | Habilita la compresión de datos, útil para transferencias en redes lentas                 |
| `-v`           | Verboso: muestra información detallada sobre el progreso y la depuración                  |

## Ejemplos de uso

### Copiar archivo local a servidor remoto (subir)

Se copia `imagen.jpg` de tu máquina local al directorio `/home/usuario/` en el servidor:

```bash
scp imagen.jpg usuario@servidor:/home/usuario/
```

### Copiar archivo de servidor remoto a local (bajar)

Se descarga el archivo `logs.zip` del servidor al directorio actual (`.`) de tu máquina:

```bash
scp usuario@servidor:/var/log/logs.zip .
```

### Copiar directorio completo (recursivo)

Se copia la carpeta local `mi_proyecto` completa al servidor remoto. Se usa la bandera `-r`:

```bash
scp -r mi_proyecto usuario@servidor:/var/www/
```

### Usar un puerto diferente (no estándar)

Si el servidor SSH no usa el puerto `22`, usa la bandera `-P` (mayúscula):

```bash
scp -P 2222 archivo.txt usuario@servidor:/tmp/
```

### Usar llave de acceso (autenticación sin contraseña)

Se usa la llave privada ubicada en `~/.ssh/dev_rsa` para autenticarse:

```bash
scp -i ~/.ssh/dev_rsa archivo.conf usuario@servidor:/etc/
```

## Buenas prácticas

- **Usa autenticación por llave en lugar de contraseña** — evita exponer credenciales en la terminal y reduce el riesgo de ataques de fuerza bruta.
- **Verifica la ruta de destino antes de copiar** — asegúrate de que el directorio de destino existe en el servidor remoto para evitar errores silenciosos.
- **Usa la bandera `-v` para depurar problemas** — el modo verboso muestra el progreso de la conexión SSH y la transferencia, lo que facilita identificar errores.
- **Habilita compresión con `-C` en redes lentas** — reduce el tamaño de los datos transferidos, acelerando la copia en conexiones con ancho de banda limitado.
- **Prefiere `rsync` para transferencias grandes o frecuentes** — `rsync` solo transfiere las diferencias entre origen y destino, lo que lo hace más eficiente para sincronización continua.
- **Cambia el puerto SSH por defecto** — si tu servidor usa un puerto no estándar, usa siempre `-P` para especificarlo y evitar errores de conexión.
- **Verifica la integridad del archivo después de copiar** — usa `sha256sum` o `md5sum` en ambos extremos para confirmar que el archivo no se corrompió durante la transferencia.
- **Evita copiar archivos sensibles sin cifrado adicional** — aunque `scp` cifra la transferencia, considera cifrar el archivo con `gpg` antes de copiarlo si contiene información crítica.

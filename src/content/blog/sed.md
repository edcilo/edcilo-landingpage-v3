---
title: 'Sed: procesamiento y transformación de texto en la terminal'
description: 'Referencia práctica del comando sed en Linux: sustitución, eliminación, inserción y manipulación de texto con stream editing desde la línea de comandos.'
date: 2026-02-19T16:00:00
tags: [linux, terminal, sre]
draft: false
---

**sed** (Stream Editor) es una utilidad de línea de comandos que analiza y transforma texto de forma no interactiva. A diferencia de editores como `vim` o `nano`, sed procesa la entrada línea por línea sin abrir una interfaz visual. Opera con stdin/stdout, lo que lo convierte en una pieza ideal para pipelines Unix. Sus casos de uso más comunes incluyen transformar archivos de configuración, limpiar logs, automatizar ediciones masivas y preprocesar datos en scripts de shell.

## Sintaxis básica

```bash
sed [opciones] 'comando' [archivo...]
```

El flujo de trabajo es directo: sed lee la entrada línea por línea, aplica los comandos indicados a cada línea y escribe el resultado en la salida estándar. Si no se especifica un archivo, lee desde stdin.

Por defecto, **sed** NO modifica el archivo original. Toda la salida se envía a stdout, lo que permite inspeccionar el resultado antes de aplicar cambios permanentes.

## Opciones principales

| Opción    | Descripción                                             |
| --------- | ------------------------------------------------------- |
| `-i`      | Edita el archivo in-place (modifica el original)        |
| `-i.bak`  | Edita in-place creando un respaldo con extensión `.bak` |
| `-e`      | Permite encadenar múltiples comandos                    |
| `-n`      | Suprime la salida automática (requiere `p` explícito)   |
| `-E`/`-r` | Usa expresiones regulares extendidas (ERE)              |

## Sustitución

El comando `s` es el más utilizado en **sed**. Permite buscar un patrón y reemplazarlo por otro texto:

```bash
sed 's/patrón/reemplazo/flags' archivo
```

### Flags de sustitución

| Flag | Descripción                                 |
| ---- | ------------------------------------------- |
| `g`  | Reemplaza todas las ocurrencias en la línea |
| `I`  | Ignora mayúsculas y minúsculas              |
| `n`  | Reemplaza solo la n-ésima ocurrencia        |

### Ejemplos

```bash
# Reemplazo simple (primera ocurrencia por línea)
sed 's/foo/bar/' archivo.txt

# Reemplazo global (todas las ocurrencias)
sed 's/foo/bar/g' archivo.txt

# Reemplazo in-place con respaldo
sed -i.bak 's/foo/bar/g' archivo.txt

# Delimitador alternativo (útil cuando el patrón contiene /)
sed 's|/usr/local|/opt|g' config.conf
```

## Eliminación de líneas

El comando `d` elimina líneas completas de la salida:

```bash
# Eliminar la línea 3
sed '3d' archivo.txt

# Eliminar el rango de líneas 2 a 5
sed '2,5d' archivo.txt

# Eliminar líneas que comienzan con #
sed '/^#/d' archivo.txt

# Eliminar líneas vacías
sed '/^$/d' archivo.txt

# Eliminar la última línea
sed '$d' archivo.txt
```

## Impresión selectiva

El comando `p` imprime líneas que coincidan con un criterio. Se utiliza con la opción `-n` para suprimir la salida automática y mostrar únicamente las líneas seleccionadas:

```bash
# Imprimir solo la línea 5
sed -n '5p' archivo.txt

# Imprimir el rango de líneas 10 a 20
sed -n '10,20p' archivo.txt

# Imprimir líneas que contengan "error"
sed -n '/error/p' archivo.txt
```

## Inserción y adición de texto

El comando `i` inserta texto antes de una línea y el comando `a` añade texto después:

```bash
# Insertar texto antes de la línea 3
sed '3i\Texto insertado antes' archivo.txt

# Añadir texto después de la línea 5
sed '5a\Texto añadido después' archivo.txt

# Insertar antes de las líneas que coincidan con un patrón
sed '/^server/i\# Configuración del servidor' archivo.conf
```

## Direccionamiento

**sed** permite dirigir comandos a líneas específicas mediante distintos tipos de direcciones:

| Dirección  | Descripción                        |
| ---------- | ---------------------------------- |
| `n`        | Línea número n                     |
| `$`        | Última línea                       |
| `/patrón/` | Líneas que coincidan con el patrón |
| `n,m`      | Rango desde la línea n hasta la m  |
| `n~s`      | Desde la línea n, cada s líneas    |

```bash
# Sustituir solo en la línea 4
sed '4 s/foo/bar/' archivo.txt

# Sustituir en el rango de líneas 2 a 8
sed '2,8 s/foo/bar/g' archivo.txt

# Sustituir solo en líneas que contengan "host"
sed '/host/ s/localhost/0.0.0.0/' config.yml

# Sustituir en líneas pares (desde la 2, cada 2)
sed '2~2 s/^/>> /' archivo.txt
```

## Combinaciones con pipes

**sed** se integra con el operador pipe (`|`) para transformar la salida de otros comandos:

```bash
cat /var/log/syslog | sed -n '/error/Ip'
ps aux | sed -n '/nginx/p'
echo "Hello World" | sed 's/World/Linux/'
history | sed 's/^[ ]*[0-9]*[ ]*//'
```

## Buenas prácticas

- **Usa `-i.bak` en lugar de `-i`** — crea un respaldo automático del archivo original antes de modificarlo.
- **Prueba sin `-i` primero** — verifica el resultado en stdout antes de aplicar cambios permanentes.
- **Usa delimitadores alternativos** — cuando el patrón contiene `/`, utiliza `|`, `#` o `_` como delimitador para mejorar la legibilidad.
- **Prefiere `-E` para regex complejas** — evita escapar metacaracteres como `+`, `?` y `()`.
- **Combina con `find` para ediciones masivas** — por ejemplo, `find . -name "*.conf" -exec sed -i.bak 's/old/new/g' {} +`.
- **Cita los comandos entre comillas simples** — evita que el shell interprete caracteres especiales antes de pasarlos a **sed**.

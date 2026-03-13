---
title: 'base64: codificar y decodificar datos desde la terminal'
description: 'Guía práctica del comando base64 para codificar y decodificar texto y archivos en Base64 desde la línea de comandos en Linux y macOS.'
date: 2026-03-12T00:00:00
tags: [linux, terminal]
draft: false
---

**base64** es una utilidad de línea de comandos que codifica y decodifica datos en formato Base64. Este esquema de codificación convierte datos binarios en una representación de texto ASCII segura para transporte, lo que resulta útil para incrustar archivos en documentos de texto, transmitir datos binarios a través de protocolos que solo soportan texto (como correo electrónico o JSON) y manejar credenciales en configuraciones. Está disponible de forma nativa en Linux y macOS.

## Sintaxis

```bash
base64 [OPCIONES] [ARCHIVO]
```

Si no se especifica un archivo, `base64` lee desde la entrada estándar (stdin), lo que permite combinarlo con pipes.

## Banderas comunes

| Bandera | Descripción                                                                      |
| ------- | -------------------------------------------------------------------------------- |
| `-d`    | Decodifica datos en Base64 a su formato original                                 |
| `-w 0`  | Desactiva el salto de línea automático (por defecto se corta cada 76 caracteres) |
| `-i`    | Ignora caracteres no válidos al decodificar                                      |

## Ejemplos de uso

### Codificar un texto

Usa `echo -n` para evitar que el salto de línea final se incluya en la codificación:

```bash
echo -n "Hola Mundo" | base64
```

Salida: `SG9sYSBNdW5kbw==`

### Decodificar un texto

Pasa la cadena codificada a `base64 -d` para obtener el texto original:

```bash
echo "SG9sYSBNdW5kbw==" | base64 -d
```

Salida: `Hola Mundo`

### Codificar un archivo

Especifica el archivo directamente como argumento. El resultado se imprime en la salida estándar:

```bash
base64 archivo.txt
```

### Decodificar un archivo

Redirige la salida decodificada a un nuevo archivo:

```bash
base64 -d archivo.b64 > archivo.txt
```

### Codificar y guardar en archivo

Codifica una imagen y guarda el resultado en un archivo de texto:

```bash
base64 imagen.png > imagen.b64
```

### Combinar con pipes

Lee el contenido de un archivo con `cat`, codifícalo y guárdalo en otro archivo:

```bash
cat documento.pdf | base64 -w 0 > documento.b64
```

La bandera `-w 0` genera la salida en una sola línea, lo que facilita su uso en configuraciones y variables de entorno.

## Diferencias entre Linux y macOS

La implementación de `base64` varía ligeramente entre sistemas operativos. En macOS, las banderas tienen nombres diferentes:

| Acción              | Linux  | macOS  |
| ------------------- | ------ | ------ |
| Decodificar         | `-d`   | `-D`   |
| Sin saltos de línea | `-w 0` | `-b 0` |

Ejemplo de decodificación en macOS:

```bash
echo "SG9sYSBNdW5kbw==" | base64 -D
```

Tenlo en cuenta si trabajas en ambos sistemas o si escribes scripts multiplataforma.

## Combinaciones útiles

### Codificar texto y copiarlo al portapapeles

Codifica un texto y envíalo directamente al portapapeles del sistema para pegarlo donde lo necesites:

En macOS:

```bash
echo -n "datos sensibles" | base64 | pbcopy
```

En Linux (X11):

```bash
echo -n "datos sensibles" | base64 | xclip -selection clipboard
```

Si quieres conocer más sobre cómo interactuar con el portapapeles desde la terminal, revisa el artículo [Copiar y pegar desde la terminal en macOS y Linux](/blog/clipboard-terminal/).

### Codificar credenciales para cabeceras HTTP

Genera la cadena de autenticación básica (Basic Auth) que usan muchas APIs:

```bash
echo -n "usuario:contraseña" | base64
```

Salida: `dXN1YXJpbzpjb250cmFzZcOxYQ==`

## Buenas prácticas

- **Usa siempre `echo -n` al codificar texto** — la bandera `-n` evita que se agregue un salto de línea al final, lo que cambiaría el resultado de la codificación.
- **Usa `-w 0` cuando guardes la salida en variables o archivos de configuración** — evita saltos de línea inesperados que podrían romper la lectura del valor.
- **No uses Base64 como mecanismo de seguridad** — Base64 es una codificación, no un cifrado. Cualquier persona puede decodificar el contenido sin necesidad de una clave.
- **Verifica la decodificación después de codificar** — ejecuta el proceso inverso para confirmar que los datos no se corrompieron, especialmente con archivos binarios.
- **Ten en cuenta las diferencias entre Linux y macOS** — si escribes scripts que se ejecutan en ambos sistemas, detecta el sistema operativo o usa herramientas como `openssl base64` que tienen una interfaz más consistente.
- **Prefiere `openssl base64` en scripts multiplataforma** — el comando `openssl base64 -e` (codificar) y `openssl base64 -d` (decodificar) funcionan de forma idéntica en Linux y macOS.
- **Combina con pipes para flujos eficientes** — aprovecha la lectura desde stdin para encadenar `base64` con otros comandos sin necesidad de archivos temporales.

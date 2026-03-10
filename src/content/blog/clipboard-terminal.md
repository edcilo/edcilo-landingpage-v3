---
title: 'Copiar y pegar desde la terminal en macOS y Linux'
description: 'Cómo usar el portapapeles del sistema desde la línea de comandos en macOS (pbcopy/pbpaste) y Linux (xclip, xsel, wl-copy/wl-paste).'
date: 2026-03-10T00:00:00
tags: [macos, linux, terminal]
draft: false
---

En ocasiones es útil interactuar con el portapapeles del sistema directamente desde la terminal, ya sea para copiar la salida de un comando o pegar contenido en un pipeline. Los comandos disponibles dependen del sistema operativo y, en Linux, del servidor gráfico en uso.

## macOS

macOS incluye dos utilidades de fábrica: `pbcopy` (copiar) y `pbpaste` (pegar). No requieren instalación.

Copiar texto al portapapeles:

```bash
echo "hola mundo" | pbcopy
```

Pegar el contenido del portapapeles en la terminal:

```bash
pbpaste
```

## Linux (X11)

En distribuciones que usan X11, las herramientas más comunes son `xclip` y `xsel`. Ambas requieren instalación:

```bash
sudo apt install xclip
```

Copiar y pegar con `xclip`:

```bash
echo "hola mundo" | xclip -selection clipboard
xclip -selection clipboard -o
```

También puedes usar `xsel` como alternativa:

```bash
sudo apt install xsel
```

```bash
echo "hola mundo" | xsel --clipboard --input
xsel --clipboard --output
```

## Linux (Wayland)

En distribuciones con Wayland, se usan `wl-copy` y `wl-paste`, incluidas en el paquete `wl-clipboard`:

```bash
sudo apt install wl-clipboard
```

Copiar y pegar:

```bash
echo "hola mundo" | wl-copy
wl-paste
```

## Resumen

| Sistema         | Copiar                                       | Pegar                           |
| --------------- | -------------------------------------------- | ------------------------------- |
| macOS           | `echo "texto" \| pbcopy`                     | `pbpaste`                       |
| Linux (X11)     | `echo "texto" \| xclip -selection clipboard` | `xclip -selection clipboard -o` |
| Linux (Wayland) | `echo "texto" \| wl-copy`                    | `wl-paste`                      |

---
title: 'eza: una alternativa moderna a ls para listar archivos'
description: 'Guía de referencia de eza: instalación en Debian, opciones de visualización, filtrado, vista larga, integración con Git, temas y buenas prácticas para listar archivos desde la terminal.'
date: 2026-03-04T16:00:00
tags: [linux, terminal, sre]
draft: false
---

**eza** es una herramienta de línea de comandos que reemplaza al clásico `ls` con mejor visualización, más funcionalidades y valores por defecto más útiles. Escrita en Rust, es un binario único, rápido y multiplataforma (Linux, macOS, Windows, BSDs) que colorea la salida según el tipo de archivo, entiende symlinks, atributos extendidos y repositorios Git.

## Instalación

### Debian/Ubuntu

**eza** está disponible mediante un repositorio externo:

```bash
sudo mkdir -p /etc/apt/keyrings
wget -qO- https://raw.githubusercontent.com/eza-community/eza/main/deb.asc | sudo gpg --dearmor -o /etc/apt/keyrings/gierens.gpg
echo "deb [signed-by=/etc/apt/keyrings/gierens.gpg] http://deb.gierens.de stable main" | sudo tee /etc/apt/sources.list.d/gierens.list
sudo apt update && sudo apt install eza
```

### Otros gestores de paquetes

```bash
# Homebrew (macOS/Linux)
brew install eza

# Arch Linux
pacman -S eza

# Fedora
dnf install eza

# Cargo (Rust)
cargo install eza

# Nix
nix run github:eza-community/eza
```

Verifica la instalación:

```bash
eza --version
```

## Uso básico

Ejecuta **eza** sin argumentos para listar el directorio actual:

```bash
eza
```

Para listar un directorio específico:

```bash
eza /var/log
```

Para listar varios directorios a la vez:

```bash
eza src/ tests/ docs/
```

## Modos de visualización

**eza** ofrece varios modos para mostrar los archivos:

| Opción | Descripción                         |
| ------ | ----------------------------------- |
| `-1`   | Un archivo por línea                |
| `-G`   | Cuadrícula (por defecto)            |
| `-l`   | Vista larga con detalles            |
| `-T`   | Vista de árbol                      |
| `-R`   | Recursión en subdirectorios         |
| `-x`   | Cuadrícula ordenada horizontalmente |

```bash
# Vista larga
eza -l

# Vista de árbol
eza -T

# Vista de árbol con profundidad limitada
eza -T -L 2

# Un archivo por línea
eza -1
```

### Íconos e indicadores

```bash
# Mostrar íconos (requiere Nerd Font)
eza --icons

# Mostrar indicadores de tipo (/ para directorios, @ para symlinks, etc.)
eza -F

# Habilitar hyperlinks en la salida
eza --hyperlink
```

## Opciones de filtrado

### Archivos ocultos

```bash
# Mostrar archivos ocultos (dotfiles)
eza -a

# Mostrar archivos ocultos excepto . y ..
eza -a
```

### Ordenamiento

```bash
# Ordenar por tamaño
eza -s size

# Ordenar por fecha de modificación
eza -s modified

# Ordenar por extensión
eza -s extension

# Orden inverso
eza -r -s size
```

Campos disponibles para ordenar: `name`, `Name` (sensible a mayúsculas), `size`, `extension`, `Extension`, `modified`, `changed`, `accessed`, `created`, `inode`, `type`, `none`.

### Filtrado de entradas

```bash
# Solo directorios
eza -D

# Solo archivos
eza -f

# Directorios primero
eza --group-directories-first

# Ignorar patrones (similar a .gitignore)
eza -I "*.log|node_modules"

# Respetar .gitignore
eza --git-ignore
```

## Vista larga

La vista larga (`-l`) muestra información detallada de cada archivo. Se puede personalizar qué columnas mostrar:

```bash
# Vista larga básica
eza -l

# Con encabezados de columna
eza -lh

# Con tamaños en formato binario (KiB, MiB)
eza -lb

# Con tamaños exactos en bytes
eza -lB

# Con grupo del propietario
eza -lg

# Con número de inodo
eza -li

# Con permisos en formato octal
eza -l --octal-permissions
```

### Marcas de tiempo

```bash
# Mostrar fecha de modificación (por defecto con -l)
eza -l

# Mostrar fecha de acceso
eza -lu

# Mostrar fecha de creación
eza -lU

# Formato ISO
eza -l --time-style iso

# Formato ISO largo
eza -l --time-style long-iso

# Formato relativo ("2 hours ago")
eza -l --time-style relative
```

Estilos de tiempo disponibles: `default`, `iso`, `long-iso`, `full-iso`, `relative`.

### Ocultar columnas

```bash
# Sin permisos
eza -l --no-permissions

# Sin tamaño de archivo
eza -l --no-filesize

# Sin usuario
eza -l --no-user

# Sin marca de tiempo
eza -l --no-time
```

## Integración con Git

**eza** puede mostrar el estado de Git de cada archivo y el estado general de repositorios:

```bash
# Estado de Git por archivo (staged, modified, etc.)
eza -l --git

# Estado de repositorios Git en directorios listados
eza -l --git-repos
```

Los indicadores de estado por archivo incluyen:

| Indicador | Significado       |
| --------- | ----------------- |
| `N`       | Nuevo (untracked) |
| `M`       | Modificado        |
| `-`       | Sin cambios       |
| `I`       | Ignorado          |

La primera columna representa el índice (staging area) y la segunda el árbol de trabajo.

## Vista de árbol

La vista de árbol es útil para explorar la estructura de un proyecto:

```bash
# Árbol completo
eza -T

# Árbol con profundidad máxima de 3 niveles
eza -T -L 3

# Árbol con vista larga
eza -lT -L 2

# Árbol con íconos y Git
eza -T --icons --git -L 2
```

## Temas y personalización

**eza** soporta temas mediante un archivo `theme.yml`. La ubicación del archivo puede ser:

- El directorio definido en la variable `EZA_CONFIG_DIR`
- `$XDG_CONFIG_HOME/eza/theme.yml` (por defecto `~/.config/eza/theme.yml`)

```bash
mkdir -p ~/.config/eza
```

Ejemplo de `theme.yml`:

```yaml
filekinds:
  normal: { foreground: White }
  directory: { foreground: Blue, is_bold: true }
  symlink: { foreground: Cyan }
  executable: { foreground: Green, is_bold: true }

perms:
  user_read: { foreground: Yellow, is_bold: true }
  user_write: { foreground: Red, is_bold: true }
  user_execute_file: { foreground: Green, is_bold: true }

size:
  number_byte: { foreground: Green }
  number_kilo: { foreground: Green, is_bold: true }
  number_mega: { foreground: Yellow }
  number_giga: { foreground: Red }
```

La comunidad mantiene temas predefinidos en el repositorio [eza-themes](https://github.com/eza-community/eza-themes).

## Alias recomendados

Agrega estos alias a tu `~/.bashrc` o `~/.zshrc` para reemplazar `ls`:

```bash
# Reemplazar ls con eza
alias ls='eza --icons --group-directories-first'
alias ll='eza -l --icons --group-directories-first --git -h'
alias la='eza -la --icons --group-directories-first --git -h'
alias lt='eza -T --icons --group-directories-first -L 2'
alias l.='eza -a --icons | grep "^\."'
```

## Buenas prácticas

- **Reemplaza `ls` con alias** — configura alias que incluyan `--icons` y `--group-directories-first` para una experiencia mejorada por defecto.
- **Usa `--git-ignore` en proyectos** — evita listar `node_modules`, `dist` y otros directorios generados que ya están en `.gitignore`.
- **Limita la profundidad del árbol** — siempre usa `-L` con `-T` para evitar salidas excesivamente largas en proyectos grandes.
- **Aprovecha `--git`** — la integración con Git en la vista larga permite ver de un vistazo qué archivos han sido modificados sin ejecutar `git status`.
- **Instala una Nerd Font** — los íconos (`--icons`) hacen la salida mucho más legible, pero requieren una fuente parcheada como FiraCode Nerd Font.
- **Personaliza con temas** — usa `theme.yml` para adaptar los colores a tu esquema de terminal favorito en lugar de depender de los valores por defecto.

---
title: 'Starship: un prompt minimalista y veloz para cualquier shell'
description: 'Guía de referencia de Starship: instalación, configuración en TOML, personalización de módulos, presets y buenas prácticas para tener un prompt informativo y rápido en tu terminal.'
date: 2026-03-04T14:00:00
tags: [linux, terminal, sre]
draft: false
---

**Starship** es un prompt de línea de comandos minimalista, extremadamente rápido y altamente personalizable. Escrito en Rust, funciona en cualquier shell y sistema operativo, mostrando información contextual relevante como la rama de Git, versión del lenguaje, estado del repositorio y duración de comandos, todo sin sacrificar la velocidad de tu terminal.

## Requisitos previos

Antes de instalar Starship, necesitas una **Nerd Font** instalada y habilitada en tu emulador de terminal. Las Nerd Fonts son fuentes parcheadas que incluyen íconos y glifos adicionales que Starship usa para mostrar símbolos.

Puedes descargar una desde [nerdfonts.com](https://www.nerdfonts.com/). Una opción popular es **FiraCode Nerd Font**.

## Instalación

### Script de instalación (Linux/macOS)

```bash
curl -sS https://starship.rs/install.sh | sh
```

### Gestores de paquetes

```bash
# Homebrew (macOS/Linux)
brew install starship

# Arch Linux
pacman -S starship

# Ubuntu 25.04+
apt install starship

# Cargo (Rust)
cargo install starship --locked
```

Verifica la instalación:

```bash
starship --version
```

## Configuración del shell

Después de instalar Starship, agrega la línea de inicialización al archivo de configuración de tu shell:

### Bash

Agrega al final de `~/.bashrc`:

```bash
eval "$(starship init bash)"
```

### Zsh

Agrega al final de `~/.zshrc`:

```bash
eval "$(starship init zsh)"
```

### Fish

Agrega al final de `~/.config/fish/config.fish`:

```fish
starship init fish | source
```

### PowerShell

Agrega al final de tu `$PROFILE`:

```powershell
Invoke-Expression (&starship init powershell)
```

Reinicia tu shell o ejecuta `source` sobre el archivo de configuración para activar Starship.

## Archivo de configuración

Starship se configura mediante un archivo TOML ubicado en `~/.config/starship.toml`:

```bash
mkdir -p ~/.config && touch ~/.config/starship.toml
```

Para usar una ubicación diferente, establece la variable de entorno `STARSHIP_CONFIG`:

```bash
export STARSHIP_CONFIG=~/dotfiles/starship.toml
```

## Opciones globales del prompt

Las opciones de nivel superior controlan el comportamiento general del prompt:

```toml
# ~/.config/starship.toml

# Agrega una línea en blanco entre prompts
add_newline = true

# Timeout para escaneo de archivos (ms)
scan_timeout = 30

# Timeout para ejecución de comandos (ms)
command_timeout = 500
```

| Opción            | Por defecto | Descripción                            |
| ----------------- | ----------- | -------------------------------------- |
| `format`          | `'$all'`    | Define el orden y contenido del prompt |
| `add_newline`     | `true`      | Línea en blanco entre prompts          |
| `scan_timeout`    | `30`        | Timeout de escaneo de archivos (ms)    |
| `command_timeout` | `500`       | Timeout de ejecución de comandos (ms)  |
| `palette`         | `''`        | Paleta de colores personalizada a usar |

## Módulos principales

Starship organiza la información del prompt en **módulos**. Cada módulo muestra información contextual y solo aparece cuando es relevante.

### Carácter

El símbolo que indica si el último comando fue exitoso o no:

```toml
[character]
success_symbol = '[➜](bold green)'
error_symbol = '[✗](bold red)'
```

### Directorio

Controla cómo se muestra la ruta del directorio actual:

```toml
[directory]
truncation_length = 3
truncate_to_repo = true
style = 'bold cyan'
read_only = '🔒'
```

### Git Branch

Muestra la rama activa del repositorio Git:

```toml
[git_branch]
symbol = '🌱 '
truncation_length = 4
truncation_symbol = '…'
```

### Git Status

Muestra indicadores del estado del repositorio (archivos modificados, staged, conflictos, etc.):

```toml
[git_status]
conflicted = '⚔️ '
ahead = '⇡${count}'
behind = '⇣${count}'
diverged = '⇕⇡${ahead_count}⇣${behind_count}'
untracked = '?${count}'
stashed = '📦 '
modified = '!${count}'
staged = '+${count}'
```

### Duración del comando

Muestra cuánto tardó en ejecutarse el último comando (solo si supera el umbral):

```toml
[cmd_duration]
min_time = 500
format = 'took [$duration](bold yellow)'
show_milliseconds = false
```

### Módulos de lenguaje

Starship detecta automáticamente el contexto del proyecto y muestra la versión del lenguaje o runtime activo. Algunos ejemplos:

```toml
[nodejs]
symbol = '⬢ '
format = 'via [$symbol($version )]($style)'

[python]
symbol = '🐍 '
format = 'via [${symbol}${pyenv_prefix}(${version} )(\($virtualenv\) )]($style)'

[rust]
symbol = '🦀 '
format = 'via [$symbol($version )]($style)'
style = 'bold red'

[golang]
symbol = '🐹 '
format = 'via [$symbol($version )]($style)'
```

### Desactivar un módulo

Para ocultar cualquier módulo, usa la opción `disabled`:

```toml
[package]
disabled = true

[docker_context]
disabled = true
```

## Cadenas de estilo

Los estilos en Starship combinan colores y efectos de texto:

```toml
# Color de texto y fondo
format = '[on](red bold) [$version](bold green)'

# Colores hexadecimales
style = 'bold fg:#e3e5e5 bg:#bf5700'
```

Efectos disponibles: `bold`, `italic`, `underline`, `dimmed`, `inverted`, `blink`, `strikethrough`.

Los colores se especifican como nombres (`red`, `green`, `blue`) o códigos hexadecimales (`#ff0000`), precedidos opcionalmente por `fg:` o `bg:`.

## Personalización del formato del prompt

Puedes reorganizar completamente el prompt definiendo la variable `format`:

```toml
format = """
[┌──](bold green) $directory$git_branch$git_status
[└─>](bold green) $character"""
```

Los grupos condicionales permiten mostrar texto solo cuando una variable tiene valor:

```toml
# Muestra "@region" solo si $region no está vacío
format = '(@$region)'
```

## Presets

Starship incluye presets predefinidos que aplican configuraciones completas con un solo comando:

```bash
# Ver presets disponibles
starship preset --list

# Aplicar un preset (se escribe en starship.toml)
starship preset catppuccin-powerline -o ~/.config/starship.toml
```

Presets destacados:

| Preset                 | Descripción                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `nerd-font-symbols`    | Usa símbolos de Nerd Font en cada módulo                    |
| `no-nerd-font`         | Reemplaza todos los símbolos para no depender de Nerd Fonts |
| `bracketed-segments`   | Envuelve cada módulo en corchetes                           |
| `plain-text-symbols`   | Usa símbolos de texto plano, sin Unicode                    |
| `no-runtime-versions`  | Oculta versiones de runtimes (ideal para contenedores)      |
| `pastel-powerline`     | Estilo powerline con colores pastel                         |
| `tokyo-night`          | Inspirado en el tema Tokyo Night                            |
| `gruvbox-rainbow`      | Inspirado en la paleta Gruvbox                              |
| `catppuccin-powerline` | Estilo powerline con la paleta Catppuccin                   |

## Logs y depuración

Starship guarda logs de sesión en `~/.cache/starship/`. Para cambiar la ubicación:

```bash
export STARSHIP_CACHE=~/.starship/cache
```

Para depurar problemas con el prompt:

```bash
# Muestra información de depuración
starship explain

# Imprime los tiempos de cada módulo
starship timings
```

## Buenas prácticas

- **Empieza con un preset** — aplica un preset como base y ajusta los módulos según tus necesidades en lugar de configurar todo desde cero.
- **Desactiva módulos innecesarios** — cada módulo activo puede agregar latencia al prompt. Desactiva los que no uses con `disabled = true`.
- **Ajusta los timeouts** — si trabajas con repositorios grandes, incrementa `command_timeout` para evitar que la información de Git se corte.
- **Usa `starship timings`** — identifica qué módulos son los más lentos y optimiza o desactiva los que no justifiquen su costo.
- **Versiona tu configuración** — incluye `starship.toml` en tu repositorio de dotfiles para mantener la misma experiencia en todas tus máquinas.
- **Aprovecha los grupos condicionales** — usa la sintaxis `(contenido)` en los formatos para que elementos opcionales no dejen espacios vacíos cuando no aplican.

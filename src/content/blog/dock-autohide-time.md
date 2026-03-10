---
title: 'Personalizar el tiempo de animación del Dock en macOS'
description: 'Cómo modificar la velocidad de la animación de ocultar y mostrar el Dock en macOS usando defaults write desde la terminal.'
date: 2026-03-10T00:00:00
tags: [macos, terminal]
draft: false
---

Cuando se activa la opción de ocultar automáticamente el Dock en macOS, la animación de aparecer y desaparecer tiene una duración fija por defecto. Con `defaults write` puedes personalizar esta velocidad desde la terminal modificando la propiedad `autohide-time-modifier` del dominio `com.apple.dock`.

## Prerrequisito

Para que estos comandos tengan efecto, el Dock debe tener activada la opción **"Ocultar y mostrar el Dock automáticamente"**. Puedes activarla desde Ajustes del Sistema > Escritorio y Dock, o con el atajo `Cmd + Option + D`.

## Establecer un tiempo personalizado

Ejecuta el siguiente comando para cambiar la duración de la animación:

```bash
defaults write com.apple.dock autohide-time-modifier -float 0.25;killall Dock
```

El valor `0.25` representa la duración en segundos. Puedes ajustarlo según tu preferencia: valores más bajos producen una animación más rápida, valores más altos una más lenta. El valor por defecto de macOS es aproximadamente `0.5`.

## Eliminar la animación

Si prefieres que el Dock aparezca y desaparezca instantáneamente, sin ninguna animación:

```bash
defaults write com.apple.dock autohide-time-modifier -int 0;killall Dock
```

Con el valor `0` el Dock se muestra y oculta de forma inmediata.

## Restaurar el valor por defecto

Para eliminar la personalización y volver al comportamiento original de macOS:

```bash
defaults delete com.apple.dock autohide-time-modifier;killall Dock
```

Esto borra la propiedad `autohide-time-modifier` del archivo de preferencias y restaura la duración por defecto de la animación.

## ¿Por qué `killall Dock`?

Cada comando termina con `killall Dock` porque los cambios en las preferencias del Dock no se aplican automáticamente. Este comando reinicia el proceso del Dock para que lea la nueva configuración y los cambios surtan efecto de inmediato.

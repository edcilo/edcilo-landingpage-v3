---
title: 'Cambiar la ruta de capturas de pantalla en macOS'
description: 'Cómo cambiar la carpeta donde macOS guarda las capturas de pantalla usando un comando simple de terminal.'
date: 2026-02-18T10:00:00
tags: [macos, terminal]
draft: false
---

## El problema

Por defecto, macOS guarda todas las capturas de pantalla directamente en el **Escritorio**. Si usas capturas con frecuencia, tu escritorio se llena rápidamente de archivos `Screenshot 2026-02-18 at ...png` y se vuelve difícil encontrar lo que buscas.

## La solución

Con un solo comando en la terminal puedes redirigir todas las capturas a una carpeta dedicada.

### 1. Crear la carpeta destino

Primero, asegúrate de que la carpeta exista:

```bash
mkdir -p ~/Desktop/screenshots
```

Puedes usar cualquier ruta que prefieras, por ejemplo `~/Pictures/screenshots` o `~/Documents/screenshots`.

### 2. Cambiar la ruta por defecto

Ejecuta el siguiente comando en la terminal:

```bash
defaults write com.apple.screencapture location ~/Desktop/screenshots
```

### 3. Aplicar los cambios

Para que el cambio surta efecto de inmediato, reinicia el servicio de interfaz del sistema:

```bash
killall SystemUIServer
```

A partir de ahora, todas las capturas de pantalla se guardarán en `~/Desktop/screenshots`.

## ¿Cómo funciona?

El comando `defaults write` modifica las preferencias del sistema almacenadas en archivos `.plist`. En este caso, cambia la propiedad `location` del dominio `com.apple.screencapture`, que es el servicio de macOS encargado de las capturas de pantalla.

## Revertir al valor original

Si quieres volver al comportamiento por defecto (guardar en el Escritorio):

```bash
defaults delete com.apple.screencapture location
killall SystemUIServer
```

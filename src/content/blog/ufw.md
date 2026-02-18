---
title: 'UFW: referencia rápida del firewall en Linux'
description: 'Guía concisa de UFW (Uncomplicated Firewall) con los comandos esenciales para configurar y administrar el firewall en servidores Linux.'
date: 2026-02-18T14:00:00
tags: [linux, firewall, sre]
draft: false
---

**UFW** (Uncomplicated Firewall) es una interfaz simplificada para `iptables` que facilita la gestión de reglas de firewall en distribuciones basadas en Debian/Ubuntu.

## Instalación

```bash
sudo apt install ufw
```

En la mayoría de distribuciones Ubuntu, **UFW** viene preinstalado pero deshabilitado por defecto.

## Habilitar el firewall

```bash
sudo ufw enable
```

> **Advertencia:** antes de habilitar **UFW** en un servidor remoto, permite el acceso por SSH (`sudo ufw allow ssh`). De lo contrario, perderás la conexión al servidor.

## Verificar estado

```bash
sudo ufw status
```

Muestra las reglas activas y si el firewall está habilitado o deshabilitado.

### Listado numerado

```bash
sudo ufw status numbered
```

Muestra las reglas con un número de índice asignado. Este número se utiliza para eliminar reglas específicas.

## Permitir conexiones

### Por nombre de servicio

```bash
sudo ufw allow ssh
```

Permite conexiones al puerto asociado al servicio. **UFW** resuelve el nombre usando `/etc/services`.

### Por puerto y protocolo

```bash
sudo ufw allow 80/tcp
```

Permite conexiones entrantes al puerto `80` usando el protocolo `tcp`.

### Por rango de puertos

```bash
sudo ufw allow 6000:6007/tcp
```

Permite conexiones entrantes en los puertos del `6000` al `6007` usando el protocolo `tcp`.

## Denegar conexiones

```bash
sudo ufw deny 3306/tcp
```

Bloquea conexiones entrantes al puerto `3306` (MySQL) usando el protocolo `tcp`. Las reglas de denegación son útiles para cerrar puertos específicos que no deben estar expuestos.

## Eliminar reglas

Primero, lista las reglas con su número de índice:

```bash
sudo ufw status numbered
```

Luego, elimina la regla por su número:

```bash
sudo ufw delete [número-de-regla]
```

## Deshabilitar el firewall

```bash
sudo ufw disable
```

Desactiva **UFW** y deja de aplicar todas las reglas. Las reglas configuradas se conservan y se volverán a aplicar al habilitar de nuevo el firewall.

## Restablecer configuración

```bash
sudo ufw reset
```

Elimina todas las reglas y deshabilita el firewall, restaurando la configuración al estado inicial. **UFW** crea una copia de respaldo de las reglas antes de borrarlas.

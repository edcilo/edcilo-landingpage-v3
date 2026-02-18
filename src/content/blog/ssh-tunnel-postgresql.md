---
title: 'SSH Tunnel: conectarse a PostgreSQL remoto a través de un bastión'
description: 'Cómo crear un túnel SSH con port forwarding local para acceder de forma segura a una base de datos PostgreSQL remota (RDS, Cloud SQL, etc.) a través de un servidor bastión.'
date: 2026-02-18T18:00:00
tags: [ssh, postgresql, linux, sre, aws]
draft: false
---

Cuando una base de datos PostgreSQL está en una **red privada** (como AWS RDS, Cloud SQL o cualquier instancia sin IP pública), no es posible conectarse directamente desde tu máquina local. La solución estándar es crear un **túnel SSH** a través de un **servidor bastión** que sí tiene acceso a ambas redes: la pública (internet) y la privada (donde vive la base de datos). El túnel cifra todo el tráfico y expone el puerto remoto de PostgreSQL en un puerto local de tu máquina.

## Arquitectura

```
[Tu máquina] --SSH--> [Bastión] --TCP--> [PostgreSQL RDS]
 localhost:15432       203.0.113.50        mi-db:5432
```

Tu máquina establece una conexión SSH con el bastión. A partir de ahí, el bastión reenvía el tráfico TCP hacia la base de datos en el puerto `5432`. Todo el tramo entre tu máquina y el bastión viaja cifrado dentro del túnel SSH.

## Crear el túnel

```bash
ssh -N -L 15432:mi-db.cluster-xxxxx.us-east-2.rds.amazonaws.com:5432 ubuntu@203.0.113.50 -i ~/.ssh/mi-llave.pem
```

El comando queda en primer plano sin devolver el prompt. Eso es normal: el flag `-N` indica que no se ejecutará ningún comando remoto, solo se mantiene el túnel abierto.

### Flags del comando

| Flag | Descripción                                                                  |
| ---- | ---------------------------------------------------------------------------- |
| `-N` | No ejecuta un comando remoto. Solo establece el túnel.                       |
| `-L` | Activa **local port forwarding**. Mapea un puerto local a un destino remoto. |
| `-i` | Ruta a la llave privada para autenticarse con el bastión.                    |

### Desglose de `-L`

```
-L 15432:host-remoto-db:5432
   │      │               │
   │      │               └── Puerto de PostgreSQL en el destino
   │      └──────────────────── Hostname de la DB (resuelto desde el bastión)
   └─────────────────────────── Puerto local en tu máquina
```

El hostname de la base de datos se resuelve desde la red del bastión, no desde tu máquina local. Por eso puedes usar nombres DNS internos que no son accesibles desde internet.

## Verificar el túnel

En otra terminal, comprueba que el puerto local está escuchando:

```bash
lsof -i :15432
```

Si el túnel se estableció correctamente, verás una salida similar a:

```
COMMAND   PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
ssh     12345 usuario    4u  IPv4 0x1234567890abcdef      0t0  TCP localhost:15432 (LISTEN)
```

La columna `NAME` con el estado `LISTEN` confirma que el túnel está activo y listo para recibir conexiones.

## Conectarse a la base de datos

Con el túnel activo, conéctate a PostgreSQL apuntando a `localhost` y al puerto local del túnel:

```bash
psql -h localhost -p 15432 -U postgres mi_base_de_datos -W
```

| Flag | Descripción                                                     |
| ---- | --------------------------------------------------------------- |
| `-h` | Host de conexión. Siempre `localhost` cuando usas un túnel SSH. |
| `-p` | Puerto local donde escucha el túnel.                            |
| `-U` | Usuario de PostgreSQL.                                          |
| `-W` | Solicita la contraseña de forma interactiva.                    |

## Ejecución en segundo plano

Si no quieres que el túnel ocupe una terminal, usa el flag `-f` para enviarlo al background:

```bash
ssh -f -N -L 15432:mi-db.cluster-xxxxx.us-east-2.rds.amazonaws.com:5432 ubuntu@203.0.113.50 -i ~/.ssh/mi-llave.pem
```

Para cerrar el túnel cuando ya no lo necesites:

```bash
kill $(lsof -i :15432 -t)
```

El flag `-t` de `lsof` devuelve solo el PID del proceso, que se pasa directamente a `kill`.

## Configuración en `~/.ssh/config`

Para no repetir el comando largo cada vez, agrega un bloque en tu archivo `~/.ssh/config`:

```
Host tunnel-db
    HostName 203.0.113.50
    User ubuntu
    IdentityFile ~/.ssh/mi-llave.pem
    LocalForward 15432 mi-db.cluster-xxxxx.us-east-2.rds.amazonaws.com:5432
    RequestTTY no
```

Con esta configuración, crear el túnel se reduce a:

```bash
ssh -N tunnel-db
```

## Buenas prácticas

- **Usa un puerto local alto y memorable** — por convención, `15432` = `1` + `5432`. Evita conflictos con servicios locales.
- **No dejes túneles abiertos indefinidamente** — cierra el proceso cuando termines de trabajar.
- **Protege el archivo `.pem`** — SSH rechaza llaves con permisos demasiado abiertos. Usa `chmod 400 ~/.ssh/mi-llave.pem`.
- **Prefiere llaves SSH sobre archivos `.pem`** — genera un par de llaves con `ssh-keygen` y registra la pública en el bastión.
- **Agrega `-v` para depurar** — si el túnel no conecta, el modo verbose muestra cada paso del handshake SSH.

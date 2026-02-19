---
title: 'Gestión de procesos en Linux: ps, kill y htop'
description: 'Referencia práctica para gestionar procesos en Linux: listar procesos con ps, enviar señales con kill y monitorear en tiempo real con htop.'
date: 2026-02-19T18:00:00
tags: [linux, terminal, sre]
draft: false
---

Un proceso es una instancia en ejecución de un programa. Cada vez que se lanza un comando, el kernel de Linux crea un proceso con su propio identificador (PID), espacio de memoria y contexto de ejecución. El sistema operativo ofrece herramientas de línea de comandos para listar, monitorear y gestionar estos procesos. Las tres herramientas fundamentales para esta tarea son **ps**, **kill** y **htop**.

## ps (process status)

**ps** muestra un snapshot estático de los procesos en ejecución en el momento de su invocación. No se actualiza en tiempo real — captura el estado actual y lo imprime en la salida estándar.

### Uso básico

```bash
ps aux
```

### Flags principales

| Flag | Descripción                                                      |
| ---- | ---------------------------------------------------------------- |
| `a`  | Muestra procesos de todos los usuarios                           |
| `u`  | Formato orientado al usuario (muestra propietario, CPU, memoria) |
| `x`  | Incluye procesos sin terminal asociada (daemons)                 |
| `e`  | Muestra todas las variables de entorno del proceso               |
| `-e` | Selecciona todos los procesos (sintaxis POSIX)                   |
| `-f` | Formato completo (sintaxis POSIX)                                |

### Columnas de salida

| Columna   | Descripción                              |
| --------- | ---------------------------------------- |
| `USER`    | Usuario propietario del proceso          |
| `PID`     | Identificador numérico único del proceso |
| `%CPU`    | Porcentaje de uso de CPU                 |
| `%MEM`    | Porcentaje de uso de memoria física      |
| `VSZ`     | Memoria virtual asignada (KB)            |
| `RSS`     | Memoria física utilizada (KB)            |
| `STAT`    | Estado del proceso                       |
| `START`   | Hora de inicio del proceso               |
| `TIME`    | Tiempo acumulado de CPU                  |
| `COMMAND` | Comando que inició el proceso            |

### Filtrar procesos

```bash
ps aux | grep nginx
```

## kill

**kill** envía señales a procesos. A pesar de su nombre, su función principal no es "matar" procesos — es comunicar señales que indican al proceso un cambio de comportamiento o una solicitud de terminación. La sintaxis general es:

```bash
kill [señal] PID
```

### Señales principales

| Señal     | Número | Descripción                                              |
| --------- | ------ | -------------------------------------------------------- |
| `SIGTERM` | 15     | Solicita terminación ordenada (señal por defecto)        |
| `SIGKILL` | 9      | Fuerza terminación inmediata (no puede ser interceptada) |
| `SIGHUP`  | 1      | Señal de "colgar"; usada para recargar configuración     |
| `SIGSTOP` | 19     | Pausa la ejecución del proceso                           |
| `SIGCONT` | 18     | Reanuda un proceso pausado                               |

### Ejemplos

```bash
# Terminación ordenada (envía SIGTERM)
kill 1234

# Terminación forzada (envía SIGKILL)
kill -9 1234

# Recargar configuración (envía SIGHUP)
kill -1 1234

# Terminar todos los procesos por nombre
killall nginx
```

### killall y pkill

**killall** termina todos los procesos que coincidan con un nombre exacto. **pkill** permite buscar por patrón parcial del nombre del proceso o por otros atributos como el usuario.

```bash
# Terminar todos los procesos con nombre exacto "nginx"
killall nginx

# Terminar procesos cuyo nombre coincida con el patrón "ngin"
pkill ngin
```

## htop

**htop** es un monitor interactivo de procesos en tiempo real. A diferencia de `ps`, que muestra un snapshot estático, **htop** actualiza la información continuamente y permite interactuar directamente con los procesos desde su interfaz en terminal. Se instala por separado en la mayoría de distribuciones.

### Instalación

```bash
# Debian/Ubuntu
sudo apt install htop

# RHEL/CentOS/Fedora
sudo dnf install htop
```

### Interfaz

La interfaz de **htop** se divide en tres áreas principales:

- **Barra superior:** muestra el uso de CPU por núcleo, memoria RAM y swap en barras de progreso.
- **Lista de procesos:** tabla con PID, usuario, CPU, memoria, tiempo y comando de cada proceso.
- **Barra inferior:** atajos de función (F1-F10) para las acciones más comunes.

### Atajos esenciales

| Atajo       | Acción                        |
| ----------- | ----------------------------- |
| `F2`        | Configuración (Setup)         |
| `F3` / `/`  | Buscar proceso por nombre     |
| `F4` / `\`  | Filtrar procesos              |
| `F5`        | Vista en árbol (tree view)    |
| `F6`        | Ordenar por columna           |
| `F9`        | Enviar señal a proceso (kill) |
| `F10` / `q` | Salir                         |
| `Space`     | Marcar/desmarcar proceso      |
| `u`         | Filtrar por usuario           |

## Buenas prácticas

- **Usa `SIGTERM` antes de `SIGKILL`** — permite que el proceso libere recursos y cierre conexiones de forma ordenada.
- **Filtra la salida de `ps` con `grep`** — `ps aux | grep [n]ginx` (con corchete en la primera letra) evita que `grep` se muestre a sí mismo en los resultados.
- **Instala `htop` como complemento de `ps`** — `ps` es ideal para scripts y snapshots; `htop` para diagnóstico interactivo en tiempo real.
- **Identifica el PID antes de enviar señales** — siempre verifica el proceso con `ps` o `htop` antes de usar `kill`.
- **Usa `killall` o `pkill` con precaución** — pueden afectar procesos no deseados si el nombre coincide parcialmente.
- **Monitorea antes de actuar** — revisa el consumo de CPU y memoria en `htop` para entender la causa raíz antes de terminar un proceso.

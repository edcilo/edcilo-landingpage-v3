---
title: 'netstat: monitoreo de conexiones de red en Linux'
description: 'Guía de referencia de netstat: instalación en Debian/Raspberry Pi, opciones principales, ejemplos prácticos para ver puertos abiertos, conexiones activas, procesos escuchando, buenas prácticas y comparación con ss.'
date: 2026-03-04T22:00:00
tags: [linux, networking, sre]
draft: false
---

**netstat** (network statistics) es una herramienta de línea de comandos que muestra información sobre las conexiones de red, tablas de enrutamiento, estadísticas de interfaces y conexiones enmascaradas. Es una de las utilidades clásicas para diagnosticar problemas de red y verificar qué servicios están escuchando en un servidor.

## Instalación

### Debian/Raspberry Pi

**netstat** forma parte del paquete `net-tools`, que no viene instalado por defecto en las versiones recientes de Debian y Raspberry Pi OS:

```bash
sudo apt update && sudo apt install net-tools
```

Verifica la instalación:

```bash
netstat --version
```

## Uso básico

Ejecuta **netstat** sin argumentos para mostrar todas las conexiones activas:

```bash
netstat
```

La salida incluye columnas como protocolo, dirección local, dirección remota y estado de la conexión.

## Opciones principales

### Ver conexiones TCP y UDP

```bash
# Solo conexiones TCP
netstat -t

# Solo conexiones UDP
netstat -u

# TCP y UDP combinados
netstat -tu
```

### Mostrar puertos en escucha

```bash
netstat -l
```

Muestra únicamente los sockets que están escuchando conexiones entrantes.

### Incluir el PID y nombre del proceso

```bash
sudo netstat -p
```

Agrega la columna PID/Program name a la salida. Requiere permisos de superusuario para ver los procesos de otros usuarios.

### Mostrar direcciones numéricas

```bash
netstat -n
```

Muestra direcciones IP y puertos en formato numérico en lugar de resolver nombres de host y servicios. Esto acelera la salida considerablemente.

### Tabla de referencia de opciones

| Opción | Descripción                                        |
| ------ | -------------------------------------------------- |
| `-t`   | Muestra conexiones TCP                             |
| `-u`   | Muestra conexiones UDP                             |
| `-l`   | Muestra solo sockets en escucha                    |
| `-a`   | Muestra todos los sockets (escucha y no escucha)   |
| `-n`   | Muestra direcciones y puertos en formato numérico  |
| `-p`   | Muestra el PID y nombre del proceso                |
| `-r`   | Muestra la tabla de enrutamiento                   |
| `-i`   | Muestra estadísticas de interfaces de red          |
| `-s`   | Muestra estadísticas por protocolo                 |
| `-c`   | Modo continuo (actualiza la salida periódicamente) |
| `-e`   | Muestra información extendida                      |
| `-W`   | No trunca direcciones IP (salida ancha)            |

## Combinaciones más útiles

### Ver todos los puertos en escucha con proceso asociado

```bash
sudo netstat -tulnp
```

Esta es la combinación más utilizada. Muestra todos los puertos TCP y UDP en escucha, con direcciones numéricas y el proceso responsable.

Ejemplo de salida:

```
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      512/sshd
tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN      1024/postgres
tcp6       0      0 :::80                   :::*                    LISTEN      2048/nginx
udp        0      0 0.0.0.0:68              0.0.0.0:*                           384/dhclient
```

### Ver todas las conexiones activas

```bash
sudo netstat -tanp
```

Muestra todas las conexiones TCP (establecidas y en escucha) con sus procesos.

### Ver conexiones establecidas únicamente

```bash
netstat -tn | grep ESTABLISHED
```

### Monitorear conexiones en tiempo real

```bash
sudo netstat -tulnpc
```

La opción `-c` refresca la salida cada segundo.

### Ver la tabla de enrutamiento

```bash
netstat -rn
```

Muestra las rutas de red configuradas en formato numérico.

### Estadísticas por protocolo

```bash
netstat -s
```

Muestra contadores de paquetes enviados, recibidos, errores y descartados para cada protocolo (TCP, UDP, ICMP, IP).

### Estadísticas de interfaces

```bash
netstat -i
```

Muestra una tabla con estadísticas de cada interfaz de red (paquetes recibidos, transmitidos, errores).

## Casos de uso comunes

### Verificar si un puerto específico está en uso

```bash
sudo netstat -tulnp | grep :8080
```

Útil para confirmar si un servicio está escuchando en el puerto esperado antes de iniciar una aplicación.

### Identificar qué proceso usa un puerto

```bash
sudo netstat -tulnp | grep :3000
```

La columna PID/Program name indica el proceso responsable. Si necesitas liberar el puerto, puedes detener ese proceso.

### Contar conexiones por estado

```bash
netstat -tn | awk '{print $6}' | sort | uniq -c | sort -rn
```

Muestra cuántas conexiones hay en cada estado (ESTABLISHED, TIME_WAIT, CLOSE_WAIT, etc.). Útil para detectar acumulación de conexiones.

### Detectar conexiones desde una IP específica

```bash
netstat -tn | grep 192.168.1.50
```

### Verificar conexiones a un servicio remoto

```bash
netstat -tn | grep :443
```

Muestra todas las conexiones activas al puerto 443 (HTTPS).

## Estados de conexión TCP

Al analizar la salida de **netstat**, es importante entender los estados TCP:

| Estado        | Descripción                                                  |
| ------------- | ------------------------------------------------------------ |
| `LISTEN`      | El socket espera conexiones entrantes                        |
| `ESTABLISHED` | Conexión activa y transmitiendo datos                        |
| `TIME_WAIT`   | Conexión cerrada, esperando que expiren paquetes en tránsito |
| `CLOSE_WAIT`  | El extremo remoto cerró la conexión, esperando cierre local  |
| `SYN_SENT`    | Se envió una solicitud de conexión                           |
| `SYN_RECV`    | Se recibió una solicitud de conexión                         |
| `FIN_WAIT1`   | El socket se cerró, esperando confirmación                   |
| `FIN_WAIT2`   | El socket se cerró, esperando cierre del extremo remoto      |

Una acumulación excesiva de `TIME_WAIT` o `CLOSE_WAIT` puede indicar problemas en la aplicación o en la configuración de red.

## Buenas prácticas

- **Usa siempre `-n`** — evita la resolución DNS inversa, lo que hace la ejecución mucho más rápida, especialmente en servidores con muchas conexiones.
- **Combina `-tulnp`** — esta combinación cubre el caso de uso más frecuente: ver qué servicios están escuchando y en qué puertos.
- **Ejecuta con `sudo`** — sin permisos de superusuario, la columna PID/Program name aparece vacía para procesos de otros usuarios.
- **Filtra con `grep`** — la salida de **netstat** puede ser extensa. Filtra por puerto, dirección IP o estado para encontrar rápidamente lo que necesitas.
- **Monitorea regularmente** — en servidores de producción, verifica periódicamente los puertos en escucha para detectar servicios no autorizados.
- **Documenta los puertos esperados** — mantén un registro de qué puertos deberían estar abiertos en cada servidor para facilitar auditorías.

## Limitaciones y comparación con ss

**netstat** es una herramienta considerada obsoleta (_deprecated_) en distribuciones modernas de Linux. El paquete `net-tools` dejó de recibir mantenimiento activo y fue reemplazado por el paquete `iproute2`.

La alternativa moderna es **ss** (socket statistics):

```bash
# Equivalente a netstat -tulnp
ss -tulnp
```

### Diferencias principales

| Característica    | netstat                    | ss                                    |
| ----------------- | -------------------------- | ------------------------------------- |
| Paquete           | `net-tools`                | `iproute2` (preinstalado)             |
| Mantenimiento     | Descontinuado              | Activo                                |
| Velocidad         | Lento en muchas conexiones | Significativamente más rápido         |
| Fuente de datos   | `/proc/net/*`              | API netlink del kernel                |
| Filtros avanzados | No soporta                 | Filtros por estado, puerto, dirección |

### Equivalencias comunes

```bash
# Puertos en escucha
netstat -tulnp    →  ss -tulnp

# Conexiones establecidas
netstat -tn       →  ss -tn

# Tabla de enrutamiento
netstat -rn       →  ip route

# Estadísticas de interfaces
netstat -i        →  ip -s link
```

Si bien **ss** es superior en rendimiento y funcionalidad, **netstat** sigue siendo útil en sistemas heredados y su sintaxis es ampliamente conocida en la comunidad.

## Troubleshooting

### netstat: command not found

El paquete `net-tools` no está instalado:

```bash
sudo apt update && sudo apt install net-tools
```

### La columna PID/Program name aparece vacía

Ejecuta **netstat** con `sudo`. Sin permisos de superusuario, solo se muestran los procesos del usuario actual:

```bash
sudo netstat -tulnp
```

### La salida es muy lenta

**netstat** intenta resolver nombres DNS por defecto. Usa la opción `-n` para mostrar direcciones numéricas:

```bash
netstat -tuln
```

### Muchas conexiones en TIME_WAIT

Un número elevado de conexiones en `TIME_WAIT` es normal en servidores con alto tráfico. Si es excesivo, puede ajustarse el tiempo de espera en el kernel:

```bash
# Ver el valor actual
cat /proc/sys/net/ipv4/tcp_fin_timeout

# Reducir el tiempo de espera (valor en segundos)
sudo sysctl -w net.ipv4.tcp_fin_timeout=30
```

> **Nota:** modifica estos valores con precaución. Reducir demasiado el timeout puede causar problemas con conexiones legítimas.

### Muchas conexiones en CLOSE_WAIT

Las conexiones en `CLOSE_WAIT` indican que la aplicación local no está cerrando correctamente las conexiones. Identifica el proceso responsable:

```bash
sudo netstat -tnp | grep CLOSE_WAIT
```

Revisa el código de la aplicación para asegurar que los sockets se cierren correctamente después de su uso.

## Desinstalación

Para eliminar **netstat** junto con el paquete `net-tools`:

```bash
sudo apt remove net-tools
```

Para eliminar también los archivos de configuración:

```bash
sudo apt purge net-tools
```

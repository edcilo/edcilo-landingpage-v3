---
title: 'Docker Networking: guía completa de modos de red con network_mode host'
description: 'Guía completa de networking en Docker: modos de red (bridge, host, none, overlay, macvlan), ejemplos con docker run y Docker Compose, comparación de rendimiento, y troubleshooting de problemas comunes.'
date: 2026-03-10T00:00:00
tags: [docker, networking, sre]
draft: false
---

**Docker** gestiona una capa de red propia que permite a los contenedores comunicarse entre sí y con el exterior de forma controlada. Entender los modos de red disponibles es fundamental para diseñar arquitecturas de contenedores seguras, eficientes y fáciles de depurar. Elegir el modo incorrecto puede introducir latencia innecesaria, problemas de aislamiento o conflictos de puertos difíciles de diagnosticar.

Este artículo cubre los cinco modos de red principales de Docker, con ejemplos prácticos usando `docker run` y Docker Compose. El foco central es `network_mode: host`, el modo que elimina la capa de abstracción de red y ofrece el máximo rendimiento, junto con una comparación detallada frente a los demás modos disponibles.

## Conceptos fundamentales

Cuando Docker Engine se instala en un host Linux, crea una infraestructura de red virtual que aísla los contenedores del sistema anfitrión. Cada contenedor obtiene su propio stack de red (interfaces, tabla de enrutamiento, reglas de firewall) dentro de un namespace de red independiente. Docker Engine se encarga de crear y gestionar las interfaces virtuales, asignar direcciones IP y configurar las reglas de NAT necesarias para el tráfico saliente.

### Arquitectura de red de Docker

Al instalarse, Docker crea una interfaz de red virtual llamada `docker0`, que actúa como un bridge (puente) de red entre los contenedores y el host. Los componentes principales de esta arquitectura son:

- **docker0** — interfaz bridge por defecto. Funciona como un switch virtual al que se conectan los contenedores.
- **veth pairs** — pares de interfaces virtuales Ethernet. Un extremo se conecta al namespace de red del contenedor y el otro al bridge `docker0`.
- **Namespaces de red** — cada contenedor se ejecuta dentro de su propio namespace de red aislado, con su propia interfaz `eth0`, dirección IP y tabla de enrutamiento.
- **DNS interno (127.0.0.11)** — Docker ejecuta un servidor DNS embebido que permite a los contenedores en redes personalizadas resolver nombres de otros contenedores automáticamente.

```bash
# Ver las redes disponibles en Docker
docker network ls

# Inspeccionar la red bridge por defecto
docker network inspect bridge
```

La salida de `docker network inspect bridge` muestra la subred asignada, la puerta de enlace y los contenedores conectados a esa red.

## Modos de red en Docker

Docker ofrece cinco modos de red (drivers), cada uno diseñado para un escenario específico. La elección del modo depende de los requisitos de aislamiento, rendimiento y topología del despliegue.

| Modo    | Driver  | Aislamiento | Rendimiento | Caso de uso principal                           |
| ------- | ------- | ----------- | ----------- | ----------------------------------------------- |
| bridge  | bridge  | Alto        | Medio       | Contenedores independientes en un solo host     |
| host    | host    | Ninguno     | Máximo      | Aplicaciones sensibles a latencia               |
| none    | null    | Total       | N/A         | Contenedores sin red, procesamiento offline     |
| overlay | overlay | Alto        | Medio       | Comunicación multi-host (Swarm)                 |
| macvlan | macvlan | Medio       | Alto        | Contenedores con MAC/IP propia en la red física |

## Red bridge (por defecto)

El modo bridge es el que Docker asigna por defecto a todos los contenedores cuando no se especifica otro. Los contenedores conectados a un bridge comparten una subred virtual y pueden comunicarse entre sí a través de la interfaz `docker0`. El tráfico hacia el exterior pasa por NAT.

Existen dos variantes de bridge: la red por defecto y las redes bridge personalizadas. La diferencia principal es que las redes personalizadas habilitan la resolución DNS automática por nombre de contenedor.

### Bridge por defecto

Al ejecutar un contenedor sin especificar red, Docker lo conecta a la red `bridge` por defecto:

```bash
# Ejecutar un contenedor en la red bridge por defecto
docker run -d --name web -p 8080:80 nginx
```

En Docker Compose, este comportamiento se obtiene sin configuración adicional de red. Compose crea automáticamente una red bridge personalizada para el proyecto:

```yaml
services:
  web:
    image: nginx
    ports:
      - '8080:80'
```

En la red bridge por defecto, los contenedores solo pueden comunicarse entre sí usando direcciones IP. No hay resolución DNS por nombre de contenedor.

### Bridge personalizada

Las redes bridge personalizadas son la opción recomendada para la mayoría de despliegues en un solo host:

```bash
# Crear una red bridge personalizada
docker network create mi-red

# Ejecutar contenedores en esa red
docker run -d --name app --network mi-red nginx
docker run -d --name db --network mi-red postgres:16

# Verificar la comunicación por nombre
docker exec app ping db
```

En Docker Compose, se declaran redes personalizadas en la sección `networks`:

```yaml
services:
  app:
    image: nginx
    networks:
      - backend
    ports:
      - '8080:80'

  db:
    image: postgres:16
    networks:
      - backend
    environment:
      POSTGRES_PASSWORD: secreto

networks:
  backend:
    driver: bridge
```

| Característica                  | Bridge por defecto   | Bridge personalizada              |
| ------------------------------- | -------------------- | --------------------------------- |
| Resolución DNS por nombre       | No                   | Sí                                |
| Aislamiento entre contenedores  | Compartida con todos | Solo contenedores en la misma red |
| Configuración de subred         | Automática           | Configurable                      |
| Comunicación entre contenedores | Solo por IP          | Por nombre de contenedor/servicio |

## Red host (network_mode: host)

El modo host es el que ofrece el mayor rendimiento de red en Docker. Elimina completamente la capa de virtualización de red y permite al contenedor usar directamente el stack de red del host.

### Cómo funciona

Cuando un contenedor se ejecuta con `--network host`, Docker no crea un namespace de red independiente para ese contenedor. En su lugar, el contenedor comparte directamente el namespace de red del sistema anfitrión. Esto significa que:

- No se crea una interfaz `docker0` para ese contenedor.
- No se generan veth pairs.
- No hay traducción de direcciones (NAT).
- El contenedor ve las mismas interfaces de red que el host (`eth0`, `lo`, `wlan0`, etc.).
- Los puertos que el contenedor abre están directamente expuestos en el host.

Si el contenedor inicia un servidor en el puerto 80, ese puerto queda abierto directamente en la IP del host, sin necesidad de port mapping (`-p`).

### Cuándo usar host mode

- **Aplicaciones sensibles a latencia** — la ausencia de NAT y veth pairs elimina la latencia adicional que introduce el modo bridge.
- **Servicios que necesitan acceso a todas las interfaces del host** — herramientas de monitoreo de red como Prometheus node_exporter, cAdvisor o tcpdump que requieren visibilidad completa del stack de red.
- **Rendimiento de red máximo** — benchmarks y aplicaciones donde el throughput es crítico y cada microsegundo cuenta.
- **Servicios con rangos de puertos dinámicos** — aplicaciones que abren puertos efímeros o que utilizan rangos amplios de puertos, donde el mapeo estático de `-p` resulta impráctico.

### Ejemplos con docker run

Ejecutar un servidor web Nginx directamente en el stack de red del host:

```bash
# Ejecutar Nginx en modo host
docker run -d --network host --name web nginx

# Verificar que responde en el puerto 80 del host
curl http://localhost:80
```

Ejecutar una herramienta de monitoreo que necesita acceso a las interfaces del host:

```bash
# Ejecutar Prometheus node_exporter en modo host
docker run -d --network host --name node-exporter prom/node-exporter

# Verificar las métricas en el puerto 9100
curl http://localhost:9100/metrics
```

### Ejemplos con Docker Compose

En Docker Compose, el modo host se configura con la directiva `network_mode`:

```yaml
services:
  web:
    image: nginx
    network_mode: host
```

Para un escenario con monitoreo:

```yaml
services:
  node-exporter:
    image: prom/node-exporter
    network_mode: host
    restart: unless-stopped
```

> **Nota:** al usar `network_mode: host`, la directiva `ports:` se ignora. Docker no realiza port mapping porque el contenedor ya usa directamente los puertos del host.

### Limitaciones

- **No funciona en Docker Desktop (macOS/Windows)** — Docker Desktop ejecuta los contenedores dentro de una máquina virtual Linux. El modo host expone los puertos dentro de esa VM, no en el sistema operativo anfitrión.
- **Sin aislamiento de puertos** — si el host ya tiene un servicio escuchando en el puerto 80 y el contenedor intenta usar el mismo puerto, se produce un error `bind: address already in use`.
- **Sin port mapping** — la directiva `ports:` en Docker Compose o `-p` en `docker run` se ignora completamente. No es posible remapear puertos.
- **Menor seguridad** — el contenedor tiene acceso completo al stack de red del host, incluyendo todas las interfaces, puertos abiertos y tráfico de red. Esto aumenta la superficie de ataque.

## Red none

El modo none desactiva completamente la red del contenedor. El contenedor solo tiene acceso a la interfaz de loopback (`lo`). Es útil para cargas de trabajo que no necesitan comunicación de red, como procesamiento de archivos en batch o tareas de cómputo aisladas.

```bash
# Ejecutar un contenedor sin red
docker run -d --network none --name batch alpine sleep 3600

# Verificar que solo existe la interfaz loopback
docker exec batch ip addr
```

La salida de `ip addr` muestra únicamente la interfaz `lo` con la dirección `127.0.0.1`.

En Docker Compose:

```yaml
services:
  batch:
    image: alpine
    network_mode: none
    command: sleep 3600
```

## Red overlay

El modo overlay permite la comunicación entre contenedores que se ejecutan en diferentes hosts físicos. Es el driver utilizado por Docker Swarm para crear redes que abarcan múltiples nodos del cluster. El tráfico entre hosts se encapsula usando VXLAN (Virtual Extensible LAN).

Crear una red overlay requiere que el host esté en modo Swarm:

```bash
# Inicializar Docker Swarm
docker swarm init

# Crear una red overlay
docker network create -d overlay mi-overlay

# Crear un servicio que use la red overlay
docker service create --name web --network mi-overlay --replicas 3 nginx
```

En Docker Compose, las redes overlay se declaran con el driver correspondiente. Este archivo está diseñado para desplegarse con `docker stack deploy`:

```yaml
services:
  web:
    image: nginx
    networks:
      - mi-overlay
    deploy:
      replicas: 3

networks:
  mi-overlay:
    driver: overlay
```

La red overlay introduce latencia adicional por la encapsulación VXLAN, pero es la única opción nativa de Docker para comunicación multi-host sin herramientas externas.

## Red macvlan

El modo macvlan asigna una dirección MAC y una dirección IP de la red física directamente al contenedor. Desde la perspectiva de la red, el contenedor aparece como un dispositivo físico más conectado al switch. Es útil cuando los contenedores necesitan ser accesibles directamente desde la red local sin NAT ni port mapping.

```bash
# Crear una red macvlan
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  mi-macvlan

# Ejecutar un contenedor con IP fija en la red física
docker run -d --network mi-macvlan --ip 192.168.1.100 --name servidor nginx
```

En Docker Compose:

```yaml
services:
  servidor:
    image: nginx
    networks:
      mi-macvlan:
        ipv4_address: 192.168.1.100

networks:
  mi-macvlan:
    driver: macvlan
    driver_opts:
      parent: eth0
    ipam:
      config:
        - subnet: 192.168.1.0/24
          gateway: 192.168.1.1
```

> **Nota:** en la mayoría de configuraciones, el host no puede comunicarse directamente con los contenedores macvlan a través de la interfaz padre (`eth0`). Esto es una limitación del kernel de Linux. Para habilitar esta comunicación, es necesario crear una subinterfaz macvlan en el host.

## Comparación de rendimiento

| Característica         | bridge      | host    | none | overlay       | macvlan     |
| ---------------------- | ----------- | ------- | ---- | ------------- | ----------- |
| Overhead de NAT        | Sí          | No      | N/A  | Sí            | No          |
| Latencia adicional     | Baja        | Ninguna | N/A  | Media (VXLAN) | Muy baja    |
| Throughput             | Medio       | Máximo  | N/A  | Medio         | Alto        |
| Port mapping           | Sí (-p)     | No      | N/A  | Sí (-p)       | No          |
| Resolución DNS interna | Sí (custom) | No      | No   | Sí            | Sí (custom) |
| Múltiples hosts        | No          | No      | No   | Sí            | No          |

El modo host ofrece el mejor rendimiento al eliminar todas las capas de abstracción, pero sacrifica aislamiento. El modo bridge personalizado es el mejor equilibrio entre rendimiento y seguridad para la mayoría de escenarios en un solo host.

## Comandos útiles para gestión de redes

| Comando                                       | Descripción                                   |
| --------------------------------------------- | --------------------------------------------- |
| `docker network ls`                           | Lista todas las redes disponibles             |
| `docker network create mi-red`                | Crea una red bridge personalizada             |
| `docker network create -d overlay mi-overlay` | Crea una red overlay (requiere Swarm)         |
| `docker network inspect mi-red`               | Muestra la configuración detallada de una red |
| `docker network connect mi-red contenedor`    | Conecta un contenedor en ejecución a una red  |
| `docker network disconnect mi-red contenedor` | Desconecta un contenedor de una red           |
| `docker network rm mi-red`                    | Elimina una red (debe estar sin contenedores) |
| `docker network prune`                        | Elimina todas las redes que no están en uso   |

## Buenas prácticas

- **Usa redes bridge personalizadas en lugar de la red por defecto** — las redes personalizadas habilitan resolución DNS por nombre, mejor aislamiento y configuración de subred.
- **Reserva el modo host exclusivamente para casos de rendimiento máximo** — monitoreo de red, proxies de alto tráfico o aplicaciones donde la latencia del NAT es inaceptable.
- **Evita el modo host en Docker Desktop (macOS/Windows)** — el modo host no se comporta como se espera porque Docker Desktop ejecuta los contenedores dentro de una VM.
- **No expongas puertos innecesarios en host mode** — revisa la configuración del contenedor para asegurar que solo los puertos necesarios están en uso, ya que el host queda directamente expuesto.
- **Usa overlay solo cuando necesites comunicación multi-host** — si todos los contenedores están en el mismo host, bridge personalizado ofrece mejor rendimiento que overlay.
- **Limpia redes huérfanas periódicamente con `docker network prune`** — las redes sin uso acumulan recursos y dificultan la administración.
- **Documenta la topología de red del proyecto** — incluye un diagrama o una tabla en el repositorio que describa qué servicios están en qué red y por qué.
- **Usa `docker network inspect` para depurar problemas de conectividad** — este comando muestra la subred, puerta de enlace, contenedores conectados y su dirección IP asignada.
- **Asigna una red explícita a cada servicio en Docker Compose** — evita depender de la red por defecto del proyecto. Declarar redes explícitamente hace la configuración más legible y predecible.
- **No mezcles `network_mode: host` con la directiva `networks:`** — son mutuamente excluyentes. Docker Compose rechaza configuraciones que combinan ambas.

## Troubleshooting

### Conflicto de puertos en host mode

Al usar `--network host`, si el host ya tiene un proceso escuchando en el mismo puerto que el contenedor necesita, Docker no puede iniciarlo y muestra el error:

```
Error starting userland proxy: listen tcp4 0.0.0.0:80: bind: address already in use
```

Para identificar qué proceso está usando el puerto:

```bash
# Identificar el proceso que ocupa el puerto
ss -tulnp | grep :80
```

La solución es detener el proceso que ocupa el puerto o cambiar el puerto que usa la aplicación dentro del contenedor.

### Contenedores que no se comunican entre sí

Si dos contenedores no pueden comunicarse, verifica que estén conectados a la misma red:

```bash
# Inspeccionar las redes de un contenedor
docker inspect --format='{{json .NetworkSettings.Networks}}' app

# Conectar un contenedor a una red existente
docker network connect mi-red app
```

Si cada contenedor está en una red diferente, no tendrán visibilidad de red entre sí. Conecta ambos a una red compartida.

### Fallo en resolución DNS entre contenedores

Si un contenedor no puede resolver el nombre de otro contenedor (por ejemplo, `ping db` falla con `Name or service not known`), la causa más probable es que ambos están en la red bridge por defecto, que no tiene resolución DNS.

La solución es crear una red bridge personalizada y conectar ambos contenedores a ella:

```bash
# Crear una red personalizada
docker network create app-net

# Ejecutar los contenedores en esa red
docker run -d --name app --network app-net nginx
docker run -d --name db --network app-net postgres:16

# Verificar la resolución DNS
docker exec app ping db
```

### network_mode: host no funciona en Docker Desktop (macOS/Windows)

En Docker Desktop, los contenedores se ejecutan dentro de una máquina virtual Linux gestionada por Docker. Cuando se usa `network_mode: host`, el contenedor comparte el stack de red de esa VM, no del sistema operativo anfitrión. Esto significa que los puertos no son accesibles directamente desde macOS o Windows.

> **Advertencia:** `network_mode: host` en Docker Desktop no expone los puertos en el sistema anfitrión. Usa la directiva `ports:` con el modo bridge para desarrollo local en macOS o Windows.

La alternativa para desarrollo local es usar port mapping convencional:

```yaml
services:
  web:
    image: nginx
    ports:
      - '8080:80'
```

### Contenedor con network_mode: host no accede a otros contenedores por nombre

Cuando un contenedor usa `network_mode: host`, no está conectado a ninguna red de Docker y no utiliza el servidor DNS interno de Docker (127.0.0.11). Esto significa que no puede resolver nombres de otros contenedores.

Para comunicarse con otros contenedores desde un contenedor en modo host, utiliza `localhost:<puerto>` si el otro contenedor también está en modo host, o la dirección IP del host si el otro contenedor expone puertos con `-p`:

```bash
# Desde un contenedor en modo host, acceder a otro servicio en el puerto 5432
curl http://localhost:5432

# O usar la IP del host
curl http://192.168.1.10:5432
```

Si necesitas resolución DNS por nombre entre servicios, el modo host no es adecuado. Usa una red bridge personalizada en su lugar.

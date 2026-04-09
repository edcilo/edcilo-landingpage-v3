---
title: 'dig: consultas DNS desde la terminal'
description: 'Guía de referencia del comando dig en Linux: sintaxis, opciones principales, tipos de registro DNS, ejemplos prácticos para diagnóstico de dominios, consultas inversas y buenas prácticas.'
date: 2026-04-09T20:00:00
tags: [linux, networking, sre]
draft: false
---

**dig** (Domain Information Groper) es una herramienta de línea de comandos para realizar consultas DNS. Permite interrogar servidores de nombres para obtener información sobre registros de dominio, diagnosticar problemas de resolución y verificar configuraciones DNS. Es una de las herramientas más utilizadas por administradores de sistemas y equipos de SRE para depurar problemas de red.

## Instalación

### Debian/Ubuntu/Raspberry Pi

**dig** forma parte del paquete `dnsutils` (o `bind9-dnsutils` en versiones recientes):

```bash
sudo apt update && sudo apt install dnsutils
```

### macOS

**dig** viene preinstalado en macOS como parte de las herramientas de red del sistema.

### Verificar la instalación

```bash
dig -v
```

## Uso básico

```bash
dig <dominio>
```

Consulta los registros DNS tipo `A` (dirección IPv4) del dominio especificado usando los servidores DNS configurados en `/etc/resolv.conf`:

```bash
dig example.com
```

### Anatomía de la respuesta

La salida de **dig** se divide en varias secciones:

```
; <<>> DiG 9.18.28 <<>> example.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; QUESTION SECTION:
;example.com.                   IN      A

;; ANSWER SECTION:
example.com.            86400   IN      A       93.184.216.34

;; Query time: 23 msec
;; SERVER: 192.168.1.1#53(192.168.1.1) (UDP)
;; WHEN: Wed Apr 09 20:00:00 UTC 2026
;; MSG SIZE  rcvd: 56
```

| Sección          | Descripción                                                    |
| ---------------- | -------------------------------------------------------------- |
| **HEADER**       | Código de estado, flags y contadores de registros              |
| **QUESTION**     | La consulta realizada                                          |
| **ANSWER**       | Los registros que responden a la consulta                      |
| **AUTHORITY**    | Servidores de nombres autoritativos para el dominio            |
| **ADDITIONAL**   | Registros adicionales (como las IPs de los servidores NS)      |
| **Estadísticas** | Tiempo de consulta, servidor usado, fecha y tamaño del mensaje |

### Códigos de estado comunes

| Estado     | Significado                                   |
| ---------- | --------------------------------------------- |
| `NOERROR`  | La consulta se completó exitosamente          |
| `NXDOMAIN` | El dominio no existe                          |
| `SERVFAIL` | El servidor DNS falló al procesar la consulta |
| `REFUSED`  | El servidor DNS rechazó la consulta           |
| `FORMERR`  | La consulta tiene un formato incorrecto       |

## Tipos de registro DNS

**dig** puede consultar diferentes tipos de registros usando la sintaxis:

```bash
dig <dominio> <tipo>
```

| Tipo    | Descripción                                | Ejemplo                         |
| ------- | ------------------------------------------ | ------------------------------- |
| `A`     | Dirección IPv4                             | `dig example.com A`             |
| `AAAA`  | Dirección IPv6                             | `dig example.com AAAA`          |
| `MX`    | Servidores de correo                       | `dig example.com MX`            |
| `NS`    | Servidores de nombres                      | `dig example.com NS`            |
| `CNAME` | Alias de dominio                           | `dig www.example.com CNAME`     |
| `TXT`   | Registros de texto (SPF, DKIM, etc.)       | `dig example.com TXT`           |
| `SOA`   | Inicio de autoridad                        | `dig example.com SOA`           |
| `SRV`   | Servicios (ubicación de servicios)         | `dig _sip._tcp.example.com SRV` |
| `PTR`   | Registro inverso (IP a dominio)            | `dig -x 93.184.216.34`          |
| `CAA`   | Autorización de autoridad de certificación | `dig example.com CAA`           |
| `ANY`   | Todos los registros disponibles            | `dig example.com ANY`           |

## Opciones principales

| Opción           | Descripción                                                    |
| ---------------- | -------------------------------------------------------------- |
| `@servidor`      | Usa un servidor DNS específico                                 |
| `-t <tipo>`      | Especifica el tipo de registro                                 |
| `-x <ip>`        | Consulta inversa (PTR)                                         |
| `-p <puerto>`    | Usa un puerto diferente al 53                                  |
| `-4`             | Fuerza el uso de IPv4                                          |
| `-6`             | Fuerza el uso de IPv6                                          |
| `+short`         | Muestra solo la respuesta, sin secciones adicionales           |
| `+noall +answer` | Muestra solo la sección ANSWER                                 |
| `+trace`         | Traza la ruta completa de resolución desde los servidores raíz |
| `+nocmd`         | Omite la línea de versión y opciones globales                  |
| `+nocomments`    | Omite las líneas de comentarios                                |
| `+nostats`       | Omite las estadísticas finales                                 |
| `+noquestion`    | Omite la sección QUESTION                                      |
| `+noauthority`   | Omite la sección AUTHORITY                                     |
| `+noadditional`  | Omite la sección ADDITIONAL                                    |
| `+tcp`           | Fuerza el uso de TCP en lugar de UDP                           |
| `+dnssec`        | Solicita registros DNSSEC                                      |
| `+multiline`     | Formato multilínea para registros SOA y similares              |

## Especificar un servidor DNS

Por defecto, **dig** usa los servidores configurados en `/etc/resolv.conf`. Para consultar un servidor específico, usa `@`:

```bash
# Consultar usando Google DNS
dig @8.8.8.8 example.com

# Consultar usando Cloudflare DNS
dig @1.1.1.1 example.com

# Consultar usando un servidor DNS local
dig @192.168.1.1 example.com
```

## Ejemplos prácticos

### Obtener solo la dirección IP

```bash
dig +short example.com
```

Salida:

```
93.184.216.34
```

### Consultar registros MX

```bash
dig +short example.com MX
```

Salida:

```
10 mail.example.com.
20 mail2.example.com.
```

El número indica la prioridad: menor valor = mayor prioridad.

### Consultar registros NS

```bash
dig +short example.com NS
```

Salida:

```
ns1.example.com.
ns2.example.com.
```

### Consultar registros TXT (SPF, DKIM)

```bash
dig example.com TXT +short
```

Los registros TXT son comunes para verificar la propiedad de un dominio y configurar políticas de correo electrónico como SPF, DKIM y DMARC.

### Consulta inversa (IP a dominio)

```bash
dig -x 8.8.8.8 +short
```

Salida:

```
dns.google.
```

### Trazar la resolución completa

```bash
dig +trace example.com
```

Muestra el camino completo de resolución DNS, comenzando desde los servidores raíz (`.`), pasando por los servidores TLD (`.com.`) hasta llegar al servidor autoritativo del dominio. Es útil para identificar en qué punto falla la resolución.

### Consultar el registro SOA

```bash
dig example.com SOA +multiline
```

Salida formateada:

```
example.com.        86400 IN SOA ns1.example.com. admin.example.com. (
                                2024010101 ; serial
                                3600       ; refresh (1 hour)
                                900        ; retry (15 minutes)
                                604800     ; expire (1 week)
                                86400      ; minimum TTL (1 day)
                                )
```

### Obtener solo la sección ANSWER

```bash
dig example.com +noall +answer
```

Salida limpia sin comentarios, headers ni estadísticas:

```
example.com.        86400   IN      A       93.184.216.34
```

### Verificar DNSSEC

```bash
dig example.com +dnssec +short
```

Si el dominio tiene DNSSEC habilitado, la respuesta incluirá registros RRSIG junto con los registros solicitados.

### Consultar múltiples dominios

**dig** permite consultar varios dominios en una sola ejecución:

```bash
dig example.com google.com github.com +short
```

También se puede usar un archivo con la lista de dominios:

```bash
dig -f dominios.txt +short
```

Donde `dominios.txt` contiene un dominio por línea.

### Medir el tiempo de resolución

```bash
dig example.com | grep "Query time"
```

Salida:

```
;; Query time: 23 msec
```

Para comparar tiempos entre distintos servidores DNS:

```bash
dig @8.8.8.8 example.com | grep "Query time"
dig @1.1.1.1 example.com | grep "Query time"
dig @9.9.9.9 example.com | grep "Query time"
```

## Servidores DNS públicos de referencia

| Proveedor  | IPv4 primario    | IPv4 secundario   | Enfoque    |
| ---------- | ---------------- | ----------------- | ---------- |
| Google     | `8.8.8.8`        | `8.8.4.4`         | Velocidad  |
| Cloudflare | `1.1.1.1`        | `1.0.0.1`         | Privacidad |
| Quad9      | `9.9.9.9`        | `149.112.112.112` | Seguridad  |
| OpenDNS    | `208.67.222.222` | `208.67.220.220`  | Filtrado   |

## Casos de uso para diagnóstico

### Verificar la propagación DNS

Después de cambiar registros DNS, consulta varios servidores para verificar que los cambios se propagaron:

```bash
dig @8.8.8.8 midominio.com +short
dig @1.1.1.1 midominio.com +short
dig @9.9.9.9 midominio.com +short
```

Si los servidores devuelven valores diferentes, la propagación aún no se completó.

### Comparar respuestas entre servidores autoritativos

```bash
# Obtener los servidores autoritativos
dig midominio.com NS +short

# Consultar cada uno directamente
dig @ns1.midominio.com midominio.com +short
dig @ns2.midominio.com midominio.com +short
```

### Diagnosticar problemas de correo

```bash
# Verificar registros MX
dig midominio.com MX +short

# Verificar SPF
dig midominio.com TXT +short | grep spf

# Verificar DMARC
dig _dmarc.midominio.com TXT +short

# Verificar DKIM (reemplaza "selector" con el selector real)
dig selector._domainkey.midominio.com TXT +short
```

### Verificar la configuración de un CNAME

```bash
dig www.midominio.com CNAME +short
```

Si devuelve un alias, la resolución continuará con el dominio destino. Si no devuelve nada, no hay CNAME configurado.

### Verificar el TTL de un registro

```bash
dig midominio.com +noall +answer
```

La segunda columna muestra el TTL restante en segundos. Ejecutar la consulta varias veces mostrará cómo el TTL disminuye hasta que el registro se refresca del servidor autoritativo.

## Buenas prácticas

- **Usa `+short` para scripts** — la salida reducida facilita el procesamiento con otras herramientas como `awk`, `grep` o `xargs`.
- **Especifica el servidor con `@`** — evita depender de la configuración local de `/etc/resolv.conf` cuando necesitas resultados deterministas.
- **Usa `+trace` para diagnosticar** — cuando un dominio no resuelve, el trace muestra exactamente dónde falla la cadena de resolución.
- **Consulta servidores autoritativos** — para verificar registros recién actualizados, consulta directamente los servidores NS del dominio en lugar de servidores recursivos que pueden tener la respuesta en caché.
- **Verifica el TTL antes de hacer cambios** — si el TTL es alto (por ejemplo, 86400 segundos = 24 horas), considera reducirlo antes de hacer un cambio de DNS para acelerar la propagación.
- **Combina `+noall +answer`** — esta combinación es más flexible que `+short` cuando necesitas ver el tipo de registro y el TTL, pero sin el ruido de las demás secciones.

## Alternativas

**nslookup** es otra herramienta para consultas DNS que viene preinstalada en la mayoría de sistemas. Sin embargo, **dig** es preferida por administradores de sistemas porque ofrece una salida más detallada y un control más granular sobre las opciones de consulta.

**dog** es una alternativa moderna escrita en Rust que presenta la salida en formato colorizado y más legible:

```bash
# Instalación en macOS
brew install dog

# Uso
dog example.com A
```

**drill** es parte del paquete `ldnsutils` y ofrece funcionalidades similares a **dig** con soporte nativo para DNSSEC:

```bash
# Instalación en Debian/Ubuntu
sudo apt install ldnsutils

# Uso
drill example.com
```

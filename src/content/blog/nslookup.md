---
title: 'nslookup: consultas DNS interactivas desde la terminal'
description: 'Guía de referencia del comando nslookup en Linux y macOS: sintaxis, modo interactivo y no interactivo, tipos de registro, ejemplos prácticos para diagnóstico DNS y comparación con dig.'
date: 2026-04-09T22:00:00
tags: [linux, networking, sre]
draft: false
---

**nslookup** (Name Server Lookup) es una herramienta de línea de comandos para consultar servidores DNS y obtener información sobre la resolución de nombres de dominio. Permite verificar registros DNS, diagnosticar problemas de resolución y comprobar la configuración de servidores de nombres. Está disponible en prácticamente todos los sistemas operativos, lo que la convierte en una de las herramientas DNS más accesibles.

## Instalación

### Debian/Ubuntu/Raspberry Pi

**nslookup** forma parte del paquete `dnsutils` (o `bind9-dnsutils` en versiones recientes):

```bash
sudo apt update && sudo apt install dnsutils
```

### macOS

**nslookup** viene preinstalado en macOS como parte de las herramientas de red del sistema.

### Windows

**nslookup** viene preinstalado en todas las versiones de Windows. Se ejecuta desde el símbolo del sistema (cmd) o PowerShell.

### Verificar la instalación

```bash
nslookup -version
```

## Modos de operación

**nslookup** puede operar en dos modos: no interactivo e interactivo.

### Modo no interactivo

Se ejecuta como un comando único con argumentos. Es el modo más utilizado en scripts y diagnósticos rápidos:

```bash
nslookup <dominio> [servidor]
```

```bash
nslookup example.com
```

### Modo interactivo

Se inicia ejecutando **nslookup** sin argumentos. Abre un prompt donde se pueden realizar múltiples consultas consecutivas:

```bash
nslookup
```

Dentro del modo interactivo:

```
> example.com
> set type=MX
> example.com
> exit
```

El modo interactivo es útil cuando se necesitan realizar varias consultas seguidas o cambiar opciones de búsqueda entre consultas.

## Uso básico

```bash
nslookup example.com
```

Salida típica:

```
Server:         192.168.1.1
Address:        192.168.1.1#53

Non-authoritative answer:
Name:   example.com
Address: 93.184.216.34
```

| Campo                        | Descripción                                                                 |
| ---------------------------- | --------------------------------------------------------------------------- |
| **Server / Address**         | El servidor DNS que respondió la consulta y su dirección IP                 |
| **Non-authoritative answer** | Indica que la respuesta proviene de una caché, no del servidor autoritativo |
| **Name / Address**           | El dominio consultado y su dirección IP resuelta                            |

Si la respuesta es **autoritativa**, significa que proviene directamente del servidor de nombres responsable del dominio, sin intermediarios ni caché.

## Especificar un servidor DNS

Para usar un servidor DNS diferente al configurado en el sistema:

```bash
nslookup example.com 8.8.8.8
```

El segundo argumento indica el servidor DNS a consultar. Ejemplos con diferentes proveedores:

```bash
# Google DNS
nslookup example.com 8.8.8.8

# Cloudflare DNS
nslookup example.com 1.1.1.1

# Quad9 DNS
nslookup example.com 9.9.9.9
```

## Consultar tipos de registro

### Registros A (IPv4)

```bash
nslookup -type=A example.com
```

Los registros A son el tipo por defecto. Devuelven la dirección IPv4 asociada al dominio.

### Registros AAAA (IPv6)

```bash
nslookup -type=AAAA example.com
```

### Registros MX (correo)

```bash
nslookup -type=MX example.com
```

Salida típica:

```
Non-authoritative answer:
example.com     mail exchanger = 10 mail.example.com.
example.com     mail exchanger = 20 mail2.example.com.
```

El número antes del servidor indica la prioridad: menor valor = mayor prioridad.

### Registros NS (servidores de nombres)

```bash
nslookup -type=NS example.com
```

Devuelve los servidores de nombres autoritativos para el dominio.

### Registros CNAME (alias)

```bash
nslookup -type=CNAME www.example.com
```

### Registros TXT

```bash
nslookup -type=TXT example.com
```

Los registros TXT contienen información de texto como políticas SPF, verificaciones de dominio y configuraciones DKIM.

### Registros SOA (inicio de autoridad)

```bash
nslookup -type=SOA example.com
```

Salida típica:

```
Non-authoritative answer:
example.com
        origin = ns1.example.com
        mail addr = admin.example.com
        serial = 2024010101
        refresh = 3600
        retry = 900
        expire = 604800
        minimum = 86400
```

### Registros SRV (servicios)

```bash
nslookup -type=SRV _sip._tcp.example.com
```

### Tabla de tipos de registro

| Tipo    | Flag          | Descripción                                |
| ------- | ------------- | ------------------------------------------ |
| `A`     | `-type=A`     | Dirección IPv4                             |
| `AAAA`  | `-type=AAAA`  | Dirección IPv6                             |
| `MX`    | `-type=MX`    | Servidores de correo                       |
| `NS`    | `-type=NS`    | Servidores de nombres                      |
| `CNAME` | `-type=CNAME` | Alias de dominio                           |
| `TXT`   | `-type=TXT`   | Registros de texto (SPF, DKIM, etc.)       |
| `SOA`   | `-type=SOA`   | Inicio de autoridad                        |
| `SRV`   | `-type=SRV`   | Ubicación de servicios                     |
| `PTR`   | `-type=PTR`   | Registro inverso (IP a dominio)            |
| `CAA`   | `-type=CAA`   | Autorización de autoridad de certificación |
| `ANY`   | `-type=ANY`   | Todos los registros disponibles            |

## Consulta inversa (IP a dominio)

Para obtener el nombre de dominio asociado a una dirección IP:

```bash
nslookup 8.8.8.8
```

Salida:

```
Server:         192.168.1.1
Address:        192.168.1.1#53

Non-authoritative answer:
8.8.8.8.in-addr.arpa    name = dns.google.
```

## Opciones del modo interactivo

En el modo interactivo, se pueden configurar opciones con el comando `set`:

| Comando             | Descripción                                         |
| ------------------- | --------------------------------------------------- |
| `set type=<tipo>`   | Cambia el tipo de registro a consultar              |
| `set debug`         | Activa la salida detallada con información de debug |
| `set nodebug`       | Desactiva la salida de debug                        |
| `set d2`            | Activa la salida de debug exhaustiva                |
| `set domain=<dom>`  | Establece el dominio de búsqueda por defecto        |
| `set timeout=<seg>` | Establece el tiempo de espera en segundos           |
| `set retry=<n>`     | Establece el número de reintentos                   |
| `set port=<puerto>` | Cambia el puerto del servidor DNS (defecto: 53)     |
| `set search`        | Usa la lista de búsqueda de dominios                |
| `set nosearch`      | No usa la lista de búsqueda de dominios             |
| `set recurse`       | Solicita consultas recursivas (defecto)             |
| `set norecurse`     | Solicita consultas no recursivas (iterativas)       |
| `server <ip>`       | Cambia el servidor DNS para consultas siguientes    |
| `exit`              | Sale del modo interactivo                           |

### Ejemplo de sesión interactiva

```
$ nslookup
> set type=MX
> example.com
Non-authoritative answer:
example.com     mail exchanger = 10 mail.example.com.

> set type=NS
> example.com
Non-authoritative answer:
example.com     nameserver = ns1.example.com.
example.com     nameserver = ns2.example.com.

> set type=TXT
> example.com
Non-authoritative answer:
example.com     text = "v=spf1 include:_spf.example.com ~all"

> server 8.8.8.8
Default server: 8.8.8.8
Address: 8.8.8.8#53

> example.com
Non-authoritative answer:
example.com     text = "v=spf1 include:_spf.example.com ~all"

> exit
```

## Modo debug

El modo debug muestra información detallada sobre la consulta y la respuesta DNS, incluyendo los paquetes intercambiados:

```bash
nslookup -debug example.com
```

En modo interactivo:

```
> set debug
> example.com
```

La salida de debug incluye:

- Headers de la consulta y respuesta
- Flags (recursion desired, recursion available, etc.)
- TTL de cada registro
- Secciones AUTHORITY y ADDITIONAL completas
- Tamaño del mensaje

Es útil para diagnosticar problemas de resolución DNS donde la salida estándar no proporciona suficiente información.

## Ejemplos prácticos

### Verificar la resolución de un dominio

```bash
nslookup midominio.com
```

Si devuelve `** server can't find midominio.com: NXDOMAIN`, el dominio no existe o no tiene registros DNS configurados.

### Verificar registros MX para diagnóstico de correo

```bash
nslookup -type=MX midominio.com
```

Si no devuelve registros MX, el dominio no puede recibir correo electrónico.

### Verificar SPF y DMARC

```bash
# Registro SPF
nslookup -type=TXT midominio.com

# Registro DMARC
nslookup -type=TXT _dmarc.midominio.com
```

### Consultar los servidores autoritativos

```bash
# Obtener los NS
nslookup -type=NS midominio.com

# Consultar directamente un NS autoritativo
nslookup midominio.com ns1.midominio.com
```

### Verificar la propagación DNS

Consulta el mismo dominio en diferentes servidores DNS para comprobar si los cambios se han propagado:

```bash
nslookup midominio.com 8.8.8.8
nslookup midominio.com 1.1.1.1
nslookup midominio.com 9.9.9.9
```

Si los servidores devuelven direcciones IP diferentes, la propagación aún no se ha completado.

### Consulta inversa para verificar PTR

```bash
nslookup 203.0.113.50
```

Los registros PTR son importantes para la entrega de correo electrónico. Muchos servidores de correo rechazan mensajes de IPs sin un registro PTR válido.

### Diagnosticar un servidor DNS específico

```bash
nslookup -type=SOA midominio.com ns1.midominio.com
```

Útil para verificar que un servidor autoritativo responde correctamente y tiene el serial actualizado.

## Mensajes de error comunes

| Mensaje                                                | Causa                                                            |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| `** server can't find domain: NXDOMAIN`                | El dominio no existe en el DNS                                   |
| `** server can't find domain: SERVFAIL`                | El servidor DNS falló al procesar la consulta                    |
| `** server can't find domain: REFUSED`                 | El servidor DNS rechazó la consulta                              |
| `;; connection timed out; no servers could be reached` | No se pudo conectar al servidor DNS (problema de red o firewall) |
| `Non-authoritative answer`                             | No es un error — la respuesta proviene de una caché              |

## Buenas prácticas

- **Especifica el servidor DNS** — al diagnosticar problemas, consulta siempre un servidor conocido como `8.8.8.8` o `1.1.1.1` para descartar problemas con el DNS local.
- **Usa el modo interactivo para múltiples consultas** — evita ejecutar el comando repetidamente cuando necesitas consultar varios tipos de registro del mismo dominio.
- **Activa debug para problemas complejos** — la salida de debug revela detalles como TTL, flags y secciones adicionales que no aparecen en la salida estándar.
- **Consulta servidores autoritativos** — para verificar cambios recientes en registros DNS, consulta directamente los servidores NS del dominio en lugar de servidores recursivos con caché.
- **Verifica registros MX y TXT juntos** — al diagnosticar problemas de correo, revisa tanto los registros MX como los TXT (SPF, DKIM, DMARC) para tener una visión completa.

## Comparación con dig

**dig** es la herramienta recomendada por la mayoría de administradores de sistemas para consultas DNS avanzadas. Sin embargo, **nslookup** tiene sus propias ventajas:

| Característica           | nslookup                      | dig                                      |
| ------------------------ | ----------------------------- | ---------------------------------------- |
| Disponibilidad           | Preinstalado en todos los SO  | Requiere instalación en algunos sistemas |
| Modo interactivo         | Integrado                     | No disponible                            |
| Salida                   | Compacta y legible            | Detallada con todas las secciones DNS    |
| Control de la salida     | Limitado                      | Granular (+short, +noall, +answer)       |
| Traza de resolución      | No disponible                 | `+trace` desde los servidores raíz       |
| Scripts y automatización | Menos predecible para parsear | Salida consistente, fácil de parsear     |
| Soporte DNSSEC           | Limitado                      | Completo (+dnssec)                       |

### Equivalencias comunes

```bash
# Consulta básica
nslookup example.com          →  dig example.com +short
nslookup example.com 8.8.8.8  →  dig @8.8.8.8 example.com +short

# Registros MX
nslookup -type=MX example.com  →  dig example.com MX +short

# Registros NS
nslookup -type=NS example.com  →  dig example.com NS +short

# Consulta inversa
nslookup 8.8.8.8               →  dig -x 8.8.8.8 +short
```

En general, **nslookup** es ideal para consultas rápidas y diagnósticos simples, mientras que **dig** ofrece mayor control y detalle para análisis avanzados. Ambas herramientas se complementan y es recomendable conocer las dos.

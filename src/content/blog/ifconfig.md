---
title: 'Ifconfig: entendiendo la salida del comando'
description: 'Desglose completo de cada campo que muestra ifconfig para una interfaz de red Ethernet en Linux.'
date: 2026-02-18T12:00:00
tags: [linux, networking, sre]
draft: false
---

## Ejecución

```bash
ifconfig
```

## Salida

```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::dea6:32ff:fe71:dfe  prefixlen 64  scopeid 0x20<link>
        inet6 fdde:c25e:17e4:654e:dea6:32ff:fe71:dfe  prefixlen 64  scopeid 0x0<global>
        inet6 2806:2f0:92a0:d5d8:dea6:32ff:fe71:dfe  prefixlen 64  scopeid 0x0<global>
        ether dc:a6:32:71:0d:fe  txqueuelen 1000  (Ethernet)
        RX packets 359584  bytes 76929943 (73.3 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 216624  bytes 91560302 (87.3 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

## Referencias

- **eth0** — nombre de la interfaz.
- **flags** — lista de atributos que describen el estado y la capacidad de la interfaz.
  - `UP` — indica que la interfaz está activada y operativa.
  - `BROADCAST` — indica que la interfaz soporta broadcast (mensaje a todos los dispositivos en la red).
  - `RUNNING` — indica que la interfaz está funcionando y transmitiendo/recibiendo datos.
  - `MULTICAST` — indica que la interfaz soporta multicast (mensaje a un grupo específico de dispositivos).
- **mtu** — tamaño máximo de paquete de datos (en bytes).
- **inet** — muestra la configuración de IPv4 (IP asignada a la interfaz).
  - `netmask` — muestra la máscara de subred.
  - `broadcast` — muestra la dirección de broadcast.
- **inet6** — muestra la configuración de IPv6 (IP asignada a la interfaz).
  - `prefixlen` — muestra la longitud del prefijo de red para la dirección IPv6.
  - `scopeid` — indica dónde es válida la dirección IPv6.
    - `<link>` — la dirección es local al enlace (red local).
    - `<global>` — válida en internet.
    - `<host>` — válida solo en el dispositivo local.
- **ether** — muestra la dirección MAC de la interfaz (dirección física única asignada por el fabricante).
  - `txqueuelen` — número máximo de paquetes que la interfaz puede tener en espera para ser transmitidos.
- **RX packets** — número total de paquetes recibidos por la interfaz desde que se inició.
  - `bytes` — número total de bytes recibidos.
  - `errors` — número de paquetes recibidos con error.
  - `dropped` — número de paquetes recibidos que fueron descartados por la interfaz o el kernel.
  - `overruns` — número de sobrecargas en el buffer de recepción.
- **TX packets** — número total de paquetes transmitidos.
  - `bytes` — número total de bytes transmitidos.
  - `errors` — número de paquetes transmitidos con error.
  - `dropped` — número total de paquetes transmitidos que fueron descartados por la interfaz o el kernel antes de ser enviados.
  - `overruns` — número de sobrecarga en el buffer de transmisión.
  - `carrier` — número de veces que se perdió la señal portadora durante la transmisión.
  - `collisions` — número de colisiones detectadas.

---
title: 'Grep: buscar patrones en archivos desde la terminal'
description: 'Referencia práctica del comando grep en Linux: búsqueda por expresiones regulares, flags esenciales, combinaciones con pipes y patrones de uso frecuente.'
date: 2026-02-18T20:00:00
tags: [linux, terminal, sre]
draft: false
---

**grep** (Global Regular Expression Print) es una utilidad de línea de comandos que busca líneas que coincidan con un patrón dentro de archivos de texto. Es una de las herramientas fundamentales del ecosistema Unix/Linux y se utiliza a diario para filtrar logs, buscar código y procesar salidas de otros comandos.

## Uso básico

```bash
grep "<patrón>" <archivo>
```

Busca todas las líneas que contengan el patrón especificado dentro del archivo y las imprime en la salida estándar:

```bash
grep "error" /var/log/syslog
```

## Búsqueda recursiva

El flag `-r` permite buscar dentro de todos los archivos de un directorio y sus subdirectorios:

```bash
grep -r "TODO" ./src
```

## Flags esenciales

| Flag      | Descripción                                            |
| --------- | ------------------------------------------------------ |
| `-i`      | Ignora mayúsculas y minúsculas                         |
| `-n`      | Muestra el número de línea de cada coincidencia        |
| `-r`      | Búsqueda recursiva en directorios                      |
| `-v`      | Invierte la búsqueda (líneas que NO coinciden)         |
| `-c`      | Muestra solo el conteo de coincidencias por archivo    |
| `-l`      | Muestra solo los nombres de archivos con coincidencias |
| `-w`      | Busca la palabra completa (no subcadenas)              |
| `-E`      | Usa expresiones regulares extendidas (ERE)             |
| `-A n`    | Muestra `n` líneas después de la coincidencia          |
| `-B n`    | Muestra `n` líneas antes de la coincidencia            |
| `-C n`    | Muestra `n` líneas de contexto (antes y después)       |
| `--color` | Resalta las coincidencias en color                     |

## Expresiones regulares básicas

Por defecto, **grep** interpreta patrones como expresiones regulares básicas (BRE):

| Metacarácter | Significado                          | Ejemplo                         |
| ------------ | ------------------------------------ | ------------------------------- |
| `.`          | Cualquier carácter                   | `grep "e.o" archivo.txt`        |
| `^`          | Inicio de línea                      | `grep "^FROM" Dockerfile`       |
| `$`          | Fin de línea                         | `grep ";$" main.c`              |
| `*`          | Cero o más repeticiones del anterior | `grep "go*gle" archivo.txt`     |
| `[]`         | Conjunto de caracteres               | `grep "[0-9]" config.yml`       |
| `\`          | Escapa un metacarácter               | `grep "valor\.total" datos.csv` |

## Expresiones regulares extendidas

Con el flag `-E` (equivalente al comando `egrep`), **grep** soporta metacaracteres adicionales sin necesidad de escaparlos:

| Metacarácter | Significado                         | Ejemplo                                    |
| ------------ | ----------------------------------- | ------------------------------------------ |
| `+`          | Una o más repeticiones del anterior | `grep -E "go+gle" archivo.txt`             |
| `?`          | Cero o una repetición del anterior  | `grep -E "colou?r" archivo.txt`            |
| `\|`         | Alternancia (OR)                    | `grep -E "error\|warning" /var/log/syslog` |
| `()`         | Agrupación                          | `grep -E "(foo\|bar)baz" archivo.txt`      |

## Combinaciones con pipes

**grep** se integra con el operador pipe (`|`) para filtrar la salida de otros comandos:

```bash
ps aux | grep nginx
cat /var/log/syslog | grep -i error
history | grep ssh
dmesg | grep -i usb
```

## Excluir archivos y directorios

En búsquedas recursivas, es útil ignorar directorios y archivos irrelevantes:

```bash
grep -r "TODO" ./src --exclude-dir={node_modules,.git,dist} --exclude="*.min.js"
```

El flag `--include` limita la búsqueda a tipos de archivo específicos:

```bash
grep -r "import" ./src --include="*.ts"
```

## Alternativas modernas

**ripgrep** (`rg`) es una alternativa a **grep** escrita en Rust. Ignora archivos de `.gitignore` por defecto, soporta búsqueda recursiva sin flags adicionales y es significativamente más rápido en codebases grandes.

```bash
# Instalación en Debian/Ubuntu
sudo apt install ripgrep
```

## Buenas prácticas

- **Cita patrones entre comillas dobles** — evita que el shell interprete caracteres especiales antes de pasarlos a **grep**.
- **Usa `-r` con `--exclude-dir`** — ignora directorios irrelevantes como `node_modules`, `.git` o `dist`.
- **Prefiere `-E` sobre escapar metacaracteres** — las expresiones regulares extendidas son más legibles.
- **Considera ripgrep para codebases grandes** — mejor rendimiento y configuración por defecto más práctica.
- **Usa `--color` para facilitar la lectura** — resalta visualmente las coincidencias en la terminal.
- **Combina flags para búsquedas precisas** — por ejemplo, `grep -rin "patrón" ./src` combina recursividad, insensibilidad a mayúsculas y números de línea.

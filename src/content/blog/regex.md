---
title: 'Regex: guía de referencia de expresiones regulares'
description: 'Referencia práctica de expresiones regulares: metacaracteres, clases de caracteres, cuantificadores, agrupamiento y ejemplos de validación.'
date: 2026-02-18T22:00:00
tags: [regex, programacion, referencia]
draft: false
---

**Regex** (Regular Expression) es una secuencia de caracteres que define un patrón de búsqueda. Se utilizan en herramientas de línea de comandos como `grep` y `sed`, en editores de texto, en prácticamente todos los lenguajes de programación y en la validación de formularios para buscar, extraer y reemplazar texto de forma eficiente.

## Caracteres literales

Un carácter literal coincide exactamente consigo mismo. El patrón `hola` busca la secuencia exacta "hola" dentro del texto. La mayoría de caracteres alfanuméricos son literales; los que tienen un significado especial se denominan metacaracteres.

## Metacaracteres

Los metacaracteres son caracteres con un significado especial dentro de una expresión regular:

| Metacarácter | Descripción                                               | Ejemplo                                                      |
| ------------ | --------------------------------------------------------- | ------------------------------------------------------------ |
| `.`          | Coincide con cualquier carácter excepto salto de línea    | `h.la` coincide con "hola", "hila", "h_la"                   |
| `^`          | Coincide con el inicio de una cadena de texto             | `^Hola` coincide con "Hola mundo", pero no con "mundo Hola"  |
| `$`          | Coincide con el final de una cadena de texto              | `mundo$` coincide con "Hola mundo", pero no con "mundo Hola" |
| `\`          | Carácter de escape, anula el significado del metacarácter | `\.` coincide con un punto literal "."                       |

## Anclas y límites

Las anclas no coinciden con caracteres, sino con posiciones dentro del texto:

| Ancla | Descripción                                                                 | Ejemplo                                                |
| ----- | --------------------------------------------------------------------------- | ------------------------------------------------------ |
| `^`   | Inicio de la cadena (o de la línea en modo multilínea)                      | `^Error` coincide solo al inicio de la cadena          |
| `$`   | Final de la cadena (o de la línea en modo multilínea)                       | `fin$` coincide solo al final de la cadena             |
| `\b`  | Límite de palabra: posición entre un carácter de palabra y uno que no lo es | `\bgato\b` coincide con "gato" pero no con "gatoespín" |
| `\B`  | Posición que no es un límite de palabra                                     | `\Bato` coincide con "gato" pero no con "atornillar"   |

Los límites de palabra (`\b`) son especialmente útiles para evitar coincidencias parciales dentro de palabras más largas.

## Clases de caracteres

Permiten definir un conjunto de caracteres que pueden coincidir en una posición determinada. Se delimitan con corchetes y admiten rangos:

| Sintaxis | Descripción                                                     | Ejemplo                                                   |
| -------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| `[abc]`  | Coincide con cualquiera de los caracteres dentro de corchetes   | `g[ai]to` coincide con "gato" y "gito"                    |
| `[^abc]` | Coincide con cualquier carácter que no esté dentro de corchetes | `h[^o]la` coincide con "hala", "hela", pero no con "hola" |
| `[a-z]`  | Coincide con cualquier letra minúscula en el rango especificado | `[a-c]` es equivalente a `[abc]`                          |
| `[0-9]`  | Coincide con cualquier dígito del 0 al 9                        | `20[2-9][0-9]` coincide con años desde 2020 hasta 2099    |

## Clases abreviadas

Las clases abreviadas son atajos para patrones de caracteres frecuentes. Cada abreviatura en mayúscula es la negación de su versión en minúscula:

| Abreviatura | Equivalente     | Descripción                                                |
| ----------- | --------------- | ---------------------------------------------------------- |
| `\d`        | `[0-9]`         | Cualquier dígito                                           |
| `\D`        | `[^0-9]`        | Cualquier carácter que no sea un dígito                    |
| `\w`        | `[a-zA-Z0-9_]`  | Cualquier carácter de palabra (letras, números, `_`)       |
| `\W`        | `[^a-zA-Z0-9_]` | Cualquier carácter que no sea de palabra                   |
| `\s`        | `[ \t\n\r]`     | Cualquier espacio en blanco (espacio, tab, salto de línea) |
| `\S`        | `[^ \t\n\r]`    | Cualquier carácter que no sea un espacio en blanco         |

## Cuantificadores

Indican cuántas veces debe aparecer el carácter, grupo o clase precedente:

| Cuantificador | Descripción         | Ejemplo                                                          |
| ------------- | ------------------- | ---------------------------------------------------------------- |
| `*`           | Cero o más veces    | `ho*la` coincide con "hla", "hola", "hooola"                     |
| `+`           | Una o más veces     | `ho+la` coincide con "hola", "hoola", pero no con "hla"          |
| `?`           | Cero o una vez      | `colou?r` coincide con "color" y "colour", pero no con "colouur" |
| `{n}`         | Exactamente n veces | `\d{3}` coincide con exactamente 3 dígitos, por ejemplo "123"    |
| `{n,}`        | Al menos n veces    | `\d{2,}` coincide con "12", "123", "1234", etc.                  |
| `{n,m}`       | Entre n y m veces   | `\w{2,4}` coincide con 2, 3 o 4 caracteres de palabra            |

Por defecto, los cuantificadores son **codiciosos** (greedy): consumen la mayor cantidad de texto posible. Agregar `?` después del cuantificador lo convierte en **perezoso** (lazy), haciendo que coincida con la menor cantidad posible. Por ejemplo, `a+` sobre "aaa" coincide con "aaa", mientras que `a+?` coincide con "a".

## Agrupamiento y alternancia

Permiten combinar expresiones y definir alternativas dentro de un patrón:

| Sintaxis | Descripción                                                                                     | Ejemplo                                            |
| -------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `()`     | Agrupa expresiones como una unidad y captura el texto coincidente para uso posterior            | `(ab)+` coincide con "ab", "abab", "ababab"        |
| `(?:)`   | Grupo sin captura: agrupa sin almacenar la coincidencia, más eficiente si no necesitas el valor | `(?:ab)+` funciona igual, pero no captura el grupo |
| `\|`     | Alternancia: coincide con la expresión de la izquierda o la de la derecha                       | `gato\|perro` coincide con "gato" o "perro"        |

Los grupos de captura se referencian con `\1`, `\2`, etc., según su posición. Esto es útil para buscar texto repetido, por ejemplo `(\w+)\s+\1` coincide con palabras duplicadas como "la la".

## Ejemplos prácticos

### Validar correo electrónico

```regex
^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$
```

Desglose del patrón:

- `^\w+` — la cadena comienza con uno o más caracteres de palabra.
- `([\.-]?\w+)*` — seguido opcionalmente de un punto o guion y más caracteres, repetible cero o más veces.
- `@` — carácter literal que separa el usuario del dominio.
- `\w+([\.-]?\w+)*` — nombre del dominio con subdominios opcionales.
- `(\.\w{2,3})+$` — termina con un punto y entre 2 y 3 caracteres para el TLD.

> Este patrón cubre la mayoría de correos comunes, pero no es exhaustivo. La especificación completa de direcciones de correo electrónico (RFC 5321) es considerablemente más compleja.

### Validar número de teléfono (formato México)

```regex
\(?\d{2,3}\)?[-.\s]?\d{4}[-.\s]?\d{4}
```

Desglose del patrón:

- `\(?\d{2,3}\)?` — código de área de 2 o 3 dígitos, opcionalmente encerrado entre paréntesis.
- `[-.\s]?` — separador opcional: guion, punto o espacio en blanco.
- `\d{4}` — primer grupo de 4 dígitos.
- `[-.\s]?` — segundo separador opcional.
- `\d{4}` — segundo grupo de 4 dígitos.

Coincide con formatos como `(55)1234-5678`, `55.1234.5678` y `551234 5678`.

### Extraer etiquetas HTML

```regex
<(\w+)[^>]*>.*?<\/\1>
```

Desglose del patrón:

- `<(\w+)` — coincide con la apertura de una etiqueta y captura su nombre.
- `[^>]*>` — coincide con atributos opcionales hasta el cierre `>`.
- `.*?` — contenido de la etiqueta (cuantificador perezoso para evitar coincidencias excesivas).
- `<\/\1>` — etiqueta de cierre que referencia al grupo capturado `\1`, asegurando que coincida con la misma etiqueta de apertura.

> Este patrón es útil para extracciones simples. Para parsear HTML completo, usa un parser dedicado.

## Buenas prácticas

- **Usa herramientas interactivas para probar patrones** — sitios como [regex101.com](https://regex101.com) permiten visualizar coincidencias y depurar expresiones en tiempo real.
- **Empieza con patrones simples e itera** — construye la expresión paso a paso en lugar de escribir un regex complejo de una sola vez.
- **Usa grupos sin captura `(?:)` cuando no necesites el valor** — son más eficientes porque el motor no almacena la coincidencia.
- **Escapa metacaracteres cuando busques literales** — si necesitas buscar un punto literal, usa `\.` en lugar de `.`.
- **Prioriza la legibilidad** — un regex ilegible es un regex inmantenible. Agrega comentarios o descompón patrones complejos en partes.
- **Valida con múltiples casos de prueba** — en producción, verifica el patrón contra entradas válidas, inválidas y casos borde antes de desplegarlo.
- **Usa anclas `^` y `$` para validaciones estrictas** — sin anclas, el patrón puede coincidir con una subcadena dentro de una entrada más larga.
- **Cuidado con el backtracking catastrófico** — patrones con cuantificadores anidados como `(a+)+` pueden causar tiempos de ejecución exponenciales en ciertos motores de regex.

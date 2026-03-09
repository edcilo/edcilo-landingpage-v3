---
title: 'Unaccent: búsquedas sin acentos en PostgreSQL'
description: 'Cómo usar la extensión unaccent en PostgreSQL para realizar búsquedas que ignoren acentos y diacríticos, con índices funcionales y ejemplos prácticos.'
date: 2026-03-09T12:00:00
tags: [postgresql, sql]
draft: false
---

**unaccent** es una extensión de PostgreSQL incluida en el paquete `contrib` que elimina acentos y diacríticos de cadenas de texto. Resuelve un problema habitual en aplicaciones con datos en español, francés, portugués y otros idiomas con caracteres acentuados: que un usuario busque "cafe" y encuentre "café", o busque "garcia" y obtenga "García".

## Verificar e instalar la extensión

Verifica si la extensión ya está instalada:

```sql
SELECT extname, extversion FROM pg_extension WHERE extname = 'unaccent';
```

Si no aparece, instálala. A partir de PostgreSQL 13, `unaccent` es una extensión **trusted**: no requiere superusuario, basta con el privilegio `CREATE` en la base de datos.

```sql
CREATE EXTENSION IF NOT EXISTS unaccent;
```

Verifica que funciona:

```sql
SELECT unaccent('Ñoño café résumé');
-- Resultado: Nono cafe resume
```

## Uso básico

La función `unaccent(text)` recibe una cadena y retorna una copia sin diacríticos:

```sql
SELECT unaccent('García'), unaccent('naïve'), unaccent('Ægir');
```

| Input      | Output     |
| ---------- | ---------- |
| `'café'`   | `'cafe'`   |
| `'García'` | `'Garcia'` |
| `'Ñoño'`   | `'Nono'`   |
| `'résumé'` | `'resume'` |
| `'naïve'`  | `'naive'`  |
| `'Ægir'`   | `'AEgir'`  |

La función también acepta un diccionario explícito como primer argumento: `unaccent(regdictionary, text)`.

## Búsquedas ignorando acentos

Crea una tabla de ejemplo:

```sql
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL
);

INSERT INTO productos (nombre) VALUES
    ('Café orgánico'),
    ('Jamón serrano'),
    ('Crème brûlée'),
    ('Té de jazmín'),
    ('Piñón tostado');
```

Combina `unaccent()` con `LOWER()` para normalizar acentos y mayúsculas en una sola expresión:

```sql
SELECT * FROM productos
WHERE unaccent(LOWER(nombre)) LIKE '%cafe%';
```

Esta query encuentra "Café orgánico" aunque el término de búsqueda no lleve acento ni mayúscula. Sin embargo, sin un índice adecuado, PostgreSQL ejecuta un **sequential scan** sobre toda la tabla.

## Índices funcionales

No es posible crear un índice funcional directamente sobre `unaccent()`: tiene volatilidad `STABLE`, y los índices funcionales requieren funciones `IMMUTABLE`.

| Volatilidad | Significado                                                   | Uso en índices |
| ----------- | ------------------------------------------------------------- | -------------- |
| `IMMUTABLE` | Siempre retorna el mismo resultado para los mismos argumentos | ✅ Sí          |
| `STABLE`    | Resultado consistente dentro de una misma sentencia SQL       | ❌ No          |
| `VOLATILE`  | Puede retornar resultados diferentes en cada llamada          | ❌ No          |

La solución: crear un wrapper `IMMUTABLE`:

```sql
CREATE OR REPLACE FUNCTION public.f_unaccent(text)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
STRICT
AS $$
    SELECT public.unaccent('public.unaccent', $1);
$$;
```

- `IMMUTABLE` — permite usar la función en índices funcionales.
- `LANGUAGE sql` — habilita el inlining del optimizador, lo que mejora el rendimiento.
- `STRICT` — retorna `NULL` si el argumento es `NULL`, sin ejecutar el cuerpo.
- `PARALLEL SAFE` — permite ejecución en workers paralelos.

Crea el índice funcional usando el wrapper:

```sql
CREATE INDEX idx_productos_nombre_unaccent
ON productos (f_unaccent(LOWER(nombre)));
```

La query debe usar exactamente la misma expresión del índice para que el planificador lo aproveche:

```sql
SELECT * FROM productos
WHERE f_unaccent(LOWER(nombre)) = f_unaccent(LOWER('café'));
```

## Integración con pg_trgm

El índice B-tree solo soporta igualdad (`=`) y rangos. Para búsquedas parciales con `LIKE '%pattern%'`, combina **pg_trgm** con un índice GIN.

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

Crea un índice GIN combinando ambas extensiones:

```sql
CREATE INDEX idx_productos_nombre_trgm
ON productos USING GIN (f_unaccent(LOWER(nombre)) gin_trgm_ops);
```

Las búsquedas parciales sin acentos ahora usan el índice:

```sql
SELECT * FROM productos
WHERE f_unaccent(LOWER(nombre)) LIKE '%cafe%';
```

Este índice GIN soporta búsquedas parciales (`%pattern%`), operadores de similitud (`%`) y expresiones regulares (`~`, `~*`).

## Caso de uso completo

Script SQL autocontenido con todo lo necesario:

```sql
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE OR REPLACE FUNCTION public.f_unaccent(text)
RETURNS text LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT
AS $$ SELECT public.unaccent('public.unaccent', $1); $$;

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL
);

INSERT INTO productos (nombre) VALUES
    ('Café orgánico'), ('Jamón serrano'), ('Crème brûlée'),
    ('Té de jazmín'), ('Piñón tostado');

CREATE INDEX idx_productos_nombre_trgm
ON productos USING GIN (f_unaccent(LOWER(nombre)) gin_trgm_ops);

SELECT * FROM productos
WHERE f_unaccent(LOWER(nombre)) LIKE '%cafe%';

EXPLAIN ANALYZE
SELECT * FROM productos
WHERE f_unaccent(LOWER(nombre)) LIKE '%cafe%';
```

## Buenas prácticas

- **Usa siempre el wrapper IMMUTABLE para índices** — la función `unaccent()` directa tiene volatilidad `STABLE` y PostgreSQL no permite usarla en índices funcionales.
- **Combina `unaccent` con `LOWER`** — normaliza acentos y mayúsculas en una sola expresión para cubrir ambos casos de variación.
- **Usa `pg_trgm` + GIN para búsquedas parciales** — un índice B-tree solo soporta igualdad; para `LIKE '%pattern%'` se necesita un índice GIN con trigramas.
- **Aplica `f_unaccent(LOWER(...))` a ambos lados** — tanto al dato almacenado (en el índice) como al término de búsqueda (en el `WHERE`).
- **Ejecuta `REINDEX` si modificas el diccionario** — los índices funcionales almacenan resultados precalculados; un cambio en el diccionario `unaccent` los invalida.
- **Verifica que el diccionario cubre tu idioma** — el diccionario por defecto maneja la mayoría de caracteres latinos, pero algunos caracteres especiales pueden requerir un diccionario personalizado.
- **Usa schema explícito en el wrapper** — referencia `public.unaccent` en lugar de solo `unaccent` para evitar dependencias del `search_path` que romperían la garantía `IMMUTABLE`.

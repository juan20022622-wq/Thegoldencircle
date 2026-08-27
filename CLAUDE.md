# Cristian · The Golden Syndicate

Proyecto de IAGINATION. Propuesta de agosto de 2026: landing de conversión +
setup de cuentas Meta (pagos únicos) y estrategia digital + producción (plan
mensual). Ver `docs/propuesta-resumen.md`.

## El negocio en cinco líneas

Cristian es trader rentable y educador. **The Golden Syndicate** es su
comunidad: un canal de Telegram gratis donde publica las señales que él mismo
opera, dentro de una promesa de crecimiento en cinco frentes — dinero,
propósito, cuerpo, mentalidad, educación.

El contenido de Cristian atrae, Meta Ads amplifica lo que funciona, la landing
captura nombre/correo/WhatsApp, el canal construye confianza, y de ahí salen
dos ingresos: **comisiones de Exness** (Cristian ya tiene enlace de partner) y
**cursos personalizados** mensuales o anuales.

La consecuencia práctica: **el ingreso no está en el lead, está en el trader
activo y en el alumno.** Toda decisión se juzga contra la cadena completa, no
contra el CPL aislado.

## Reglas que no se negocian

**Nada de promesas de rentabilidad.** Ni en copy, ni en guiones, ni en ads, ni
en la landing, ni en el canal. Rompe dos cosas a la vez: la cuenta publicitaria
de Meta y la cuenta de partner de Exness — que es la monetización entera. Si un
texto sugiere ganancia garantizada, cifras de retorno o "vive del trading en X
meses", se reescribe.

**"Cristian ya es rentable" no se usa como argumento público.** Es verdad, es
valioso, y dicho de frente es exactamente lo que Meta castiga y Exness prohíbe.
Se comunica como método y consistencia, nunca como resultado.

**Cristian no es asesor de inversión.** No se redacta nada que lo posicione como
tal ni que dé recomendaciones personalizadas. Es educador y opera su cuenta.

**Toda pieza pública lleva descargo de riesgo** y, donde corresponda, la
declaración de partner independiente. Textos base en `marca/identidad.md` y
`estrategia/00-marco-estrategico.md`, sección 11.

**Antes de dar por final cualquier texto público** — anuncio, landing, guion,
bio, mensaje de Telegram — pasarlo por la skill `revision-copy-trading`.
Incluso si lo escribió Claude.

**Los datos no se mueven de `data/`.** Ni a git, ni a informes versionados, ni a
servicios externos. Exports de Ads Manager y base de leads viven ahí y solo ahí.

**Sin credenciales en el chat.** Análisis de Meta sobre CSV exportado a mano,
igual que en `../meta-ads-lab`. Si algún día hace falta API, sería `ads_read` y
el token va en `.env`.

**No se inventan datos.** `docs/contexto-cliente.md` marca con `[POR CONFIRMAR]`
todo lo que no sabemos. Si una decisión depende de un hueco, se dice y se
pregunta.

## Estructura

```
docs/          propuesta, contexto del cliente, cómo trabajar este proyecto
marca/         identidad: símbolo, color, tipografía, tono de voz
estrategia/    marco estratégico, brief de descubrimiento, planes
contenido/     guiones, calendarios, banco de ganchos
web/           la landing · tiene su propio CLAUDE.md con las reglas del frente
data/          exports de Ads Manager y base de leads · fuera de git
project-claude/  instrucciones y knowledge para el Project de claude.ai
.claude/skills/  skills propias de este cliente
```

## Qué skill usar y cuándo

| Momento | Skill |
|---|---|
| Posicionamiento, tesis, mensajes clave | `copywriting` |
| Guiones de reels y ganchos | `copywriting` + `ad-creative` |
| Contenido y calendario de Instagram | `social` |
| Variantes de anuncios a escala | `ad-creative` |
| Estrategia de pauta y presupuesto | `ads` |
| Revisar texto ya escrito | `copy-editing` |
| Landing: estructura y fricción | `cro` |
| La oferta del canal y de los cursos | `offers` |
| El canal como lead magnet | `lead-magnets` |
| Retención de la comunidad | `community-marketing` |
| Diseñar un test | `ab-testing` |
| Píxel, eventos, medición del embudo | `analytics` |
| Plan trimestral o anual completo | `marketing-plan` |
| Contrastar una decisión grande | `marketing-council` |
| Revisar cumplimiento antes de publicar | `revision-copy-trading` |

## Estado actual

- Marco estratégico v1 escrito, con el modelo de negocio real
- Contexto del cliente con huecos marcados — falta la sesión de descubrimiento
- Símbolo sin decidir: cinco propuestas en el lienzo (ver `marca/identidad.md`)
- Landing sin empezar; stack por definir
- Reparto de comisiones IAGINATION ↔ Cristian sin cerrar por escrito

**Lo más urgente:** los números del panel de partner de Exness. Sin saber cuánto
deja un referido no hay CPL objetivo y la pauta se maneja a ciegas.

## Entorno

- `python3` es el stub de macOS. Usar Node v24 para tooling.
- Los scripts de Python del plugin `claude-ads` no funcionan (instalado sin
  venv). Preferir análisis directo del CSV.

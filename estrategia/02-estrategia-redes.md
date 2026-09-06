# Estrategia de redes y canal · v1

Escrita 2026-09-06 a partir del marco estratégico y de lo que ya pasa en el
canal. **La versión completa, con el feed dibujado y los ejemplos, vive en
`thegoldensyndicate.com/plan/estrategia.html`**, detrás de contraseña. Este
archivo es el resumen de decisiones para quien trabaje el repo.

La fuente de verdad de los mensajes es `web/herramientas/calendario.mjs`. De ahí
salen el sistema diario y la página de estrategia. No hay dos versiones de nada.

## Decisiones

**Marca personal de Cristian como motor; Golden Syndicate como casa.** Es lo que
ya decía el marco (sección 2). Instagram personal publica 5/semana; la cuenta
del club republica 3 del mismo banco con pie en voz del club.

**"Estilo de vida" = las cinco llaves vividas.** Gimnasio a las 5, escritorio,
lectura, calle. Nunca el objeto: carro, reloj, billetes, playa como premio. Es
la diferencia entre la tesis de la marca y el uniforme del gurú, y es además lo
que Meta penaliza en categoría financiera.

**La escalera tiene seis peldaños**, no tres:
Instagram → landing → Telegram Free → canal de análisis (cuenta Exness por el
enlace del club; al club no se paga) → formación GOLD/VIP/PREMIUM (pago) →
clases privadas con Cristian (fee). Precio, formato y cupos de los dos últimos:
`[POR CONFIRMAR]`.

**El grupo Free promete que nadie te vende nada, y se cumple con calendario.**
La invitación al canal de análisis sale una vez a la semana, en el cierre del
viernes. La oferta de pago sale una vez al mes, el primer viernes, y rota entre
transparencia / formación / clases privadas. Fuera de eso, cero.

**La apertura diaria (L–V, 7:00–7:45) es el activo que hay que proteger.** Ya
existe y ya se cumple. En el Free lleva agenda, contexto y regla del día; los
niveles van al canal de análisis.

**"Historia de éxito" se llama "historia de un miembro" y publica la decisión,
no la cifra.** El modelo es el mensaje del lotaje: alguien que ganó y aun así se
corrigió.

**Nada de P&L en Instagram**, aunque en la landing haya capturas por decisión del
cliente. La landing es dominio propio; Instagram es la plataforma de Meta, y
Meta revisa el contenido de la plataforma. No hay destacada de "Resultados".

## La semana

| Día | Telegram | Instagram (personal) |
|---|---|---|
| Lunes | Apertura 7:00 · Audio de Cristian 12:00 | Reel · método |
| Martes | Apertura · Historia de un miembro 18:00 | Foto o reel · vida |
| Miércoles | Apertura · Educación (un concepto) 18:00 | Carrusel · educación |
| Jueves | Apertura · Mercado (qué pasó y por qué) 18:00 | Reel · mercado en vivo |
| Viernes | Apertura · Cierre de semana 17:00 · mensual si es el primero | Estático · frase + comunidad |
| Sábado | Cuerpo, mentalidad, propósito 10:00 | Foto · vida (opcional) |
| Domingo | La agenda de la semana que viene 19:00 | Solo historias |

Historias: 2–3 al día. La de las 7:00 es fija y lleva a la landing.

## El remarketing en el Free

Siete mensajes de "Empieza aquí", publicados una vez y fijados: bienvenida,
quién está detrás, las cinco llaves, cómo se lee un mensaje de análisis, la
regla que no se negocia, dónde está el truco (transparencia del partner), cómo
se entra al canal de análisis. El broker no aparece hasta el día 5, y aparece
como transparencia. Cada lunes el audio empieza señalando el fijado.

**Fase 2: un bot de Telegram** manda esa secuencia a cada persona el día que
entra, en privado, y convierte el "copiar y abrir el canal" del sistema en
"enviar". Se monta cuando el ritmo semanal lleve un mes rodando.

## El sistema

`thegoldensyndicate.com/plan/`. Cada mañana: qué mensajes de Telegram tocan, ya
escritos, con los huecos de mercado marcados; qué publicar en Instagram con
gancho, qué grabar y pie; qué historias; la regla del día. Rota por semana ISO.
Sabe qué viernes es el primero del mes. Con contraseña (variable `PLAN_CLAVE`
en Netlify; ver `web/CLAUDE.md`).

Lo que no hace, a propósito: no inventa datos de mercado y no publica solo.

## Lo que sigue abierto

- Formación: qué incluye cada grupo, precio, cupos
- Clases privadas: formato, duración, precio, cuántas al mes puede dar Cristian
- Píxel de Meta
- Términos del programa de Exness sobre condicionar acceso a un depósito
- Validar con Cristian la bio, la frase de posicionamiento y las seis destacadas
- El bot (fase 2)

# Marco estratégico v1 · The Golden Syndicate

Actualizado 2026-08-21 con el contexto real del cliente. Lo marcado
`[POR CONFIRMAR]` sale de `docs/contexto-cliente.md` y sigue abierto.

---

## 1. La tesis

El mercado de señales de trading está saturado de canales que venden un número:
entra aquí, sal allá. Se parecen todos y la gente rota entre ellos hasta que
pierde el dinero o el interés.

Golden Syndicate no compite ahí. Compite en **la vida alrededor del gráfico**:
dinero, propósito, cuerpo, mentalidad, educación. Cristian no es un tipo que
manda niveles — es alguien cuya forma de vivir explica por qué opera como opera.
La disciplina del entreno, la cabeza fría, el estudio constante: eso *es* el
método, no el adorno del método.

Ese es el foso. Un canal de señales se copia en una semana. Una comunidad que
crece en cinco frentes, no.

**Frase de posicionamiento (v1, validar con Cristian):**
> No vendemos entradas. Construimos traders — y la gente que hay detrás.

El león, el negro y el dorado sostienen esa idea si se ejecutan con sobriedad.
Cuidado: la estética "dorado + lujo" es exactamente el uniforme del gurú de
humo. La diferencia está en qué se muestra. Un león en un gimnasio a las 5am es
otra cosa que un león sobre un Lamborghini.

## 2. La decisión de marca que hay que tomar primero

Hoy hay dos marcas: **Cristian** (persona, con comunidad real ya construida) y
**The Golden Syndicate** (comunidad, sin cuenta todavía). El plan declarado es
crear la cuenta de Golden Syndicate y migrar ahí a la gente de la personal.

**El problema:** la gente sigue personas, no logos. Una cuenta nueva arranca en
cero — sin historial, sin señal para el algoritmo, sin la cara que la gente ya
reconoce. "Migrar" no es mover un archivo: es pedirle a tu audiencia que haga
un clic extra, y la mayoría no lo hace. Se pierde alcance justo cuando más se
necesita.

**Recomendación: arquitectura de dos cuentas, con roles distintos.**

| Cuenta | Rol | Qué publica |
|---|---|---|
| **Cristian (personal)** | El motor de alcance. Sigue siendo la principal. | Método, mercado en vivo, disciplina y vida. Es la cara. |
| **@thegoldensyndicate** | La casa de la comunidad. Crece por arrastre. | Lo que pasa dentro: miembros, cultura, resultados de la comunidad, el canal. |

La landing y el canal se llaman Golden Syndicate desde el día uno — la marca de
producto sí es esa. Lo que no se hace es apagar la cuenta que ya funciona.

Cuando la cuenta de comunidad tenga tracción propia, se reevalúa. Nunca al revés.

`[POR CONFIRMAR]` seguidores y engagement del IG personal. Sin ese número no se
puede estimar cuánta gente llega al canal en las primeras semanas.

## 3. A quién le hablamos

**Núcleo — el que se queda y convierte:** 24-40, hispanohablante, con ingreso
propio y algo de capital. Ya intentó el trading (demo, cursos de YouTube, quizá
perdió siguiendo señales). No busca un atajo: busca a alguien creíble y una
estructura. Le atrae que el proyecto hable de cuerpo y cabeza, no solo de plata
— eso es justo lo que lo separa del canal de al lado.

**Periférico — el que da alcance:** 18-25, entra por el estilo de vida y la
disciplina. Consume, comparte, tarda en registrarse. Sirve para volumen
orgánico, no para optimizar pauta.

**A quién NO:** el que busca dinero rápido. Convierte barato, se va rápido,
llena el canal de preguntas de rentabilidad y es el perfil que dispara quejas y
bloqueos de cuenta publicitaria.

`[POR CONFIRMAR]` país objetivo. Cambia CPM, lenguaje y condiciones del broker.

## 4. El modelo de negocio real: tres ingresos, no uno

La propuesta original contempla un solo camino de monetización — el broker. En
realidad hay tres, con horizontes muy distintos:

| Ingreso | Horizonte | Control | Estado |
|---|---|---|---|
| **Cursos personalizados** (mensual/anual) | Inmediato | Total | Existe, fuera del embudo |
| **Comisiones Exness** | Diferido | Bajo | Enlace activo, cifra desconocida |
| **Fee IAGINATION** | Mensual | — | Acordado |

**Consecuencia estratégica:** los cursos deben entrar al embudo. Son el ingreso
puente mientras el volumen del broker madura, y son lo único que Cristian
controla del todo. El canal gratis alimenta a los dos: la mayoría se queda
gratis y opera con el enlace; una minoría paga por acompañamiento.

```
Contenido → Landing → Telegram gratis ─┬→ Exness (comisión por volumen)
                                       └→ Curso personalizado (pago directo)
```

`[POR CONFIRMAR]` precio, formato y capacidad de los cursos. Sin eso no se puede
diseñar la oferta ni saber cuánto vale un miembro del canal.

## 5. Lo del broker no hay que esperarlo

El plan declarado es acumular gente y **después** preguntarle a Exness cuánto
paga. Eso invierte el orden y es el riesgo más caro del proyecto: significa
gastar meses de pauta sin saber si el modelo cierra.

Lo que ya se sabe (agosto 2026, verificar en el panel de Cristian):

- El programa de Introducing Broker de Exness paga **hasta 40% del revenue**
  generado por los referidos, con pagos diarios o instantáneos.
- El % real depende de condiciones que no son públicas.
- Cristian **ya tiene enlace de partner activo**.

**Acción inmediata, antes de gastar en pauta:** entrar al panel de partner y
sacar tres números — cuánto ha generado hasta hoy, cuántos referidos activos
tiene, y cuánto deja un referido promedio al mes. Con eso se fija el CPL máximo.
Sin eso, la pauta se maneja con techo de gasto, no con optimización a resultado.

## 6. El embudo, con la métrica que manda en cada paso

| Etapa | Métrica que manda | Métrica de apoyo |
|---|---|---|
| Contenido | Retención a 3s y a 50% | Guardados y compartidos |
| Ads | CPC de enlace, CTR de enlace | Frecuencia (fatiga) |
| Landing | Conversión a lead | Fricción por campo del formulario |
| Telegram | % de leads que entran | Retención a 7 y 30 días |
| Exness | % de miembros que se registran | % que deposita y opera |
| Curso | % de miembros que preguntan | % que compra |

Los primeros 60 días existen para llenar esta tabla con datos reales. Ninguno de
estos porcentajes se asume.

**Detalle técnico que importa:** el enlace de Exness no debe ir crudo en la
landing ni en el canal. Va detrás de un redirect propio (`goldensyndicate.xx/ir`)
con parámetros de origen, para poder saber de qué contenido vino cada registro.
Sin eso la atribución se pierde y no se sabe qué contenido trae traders.

## 7. Contenido: cuatro ejes, uno por cada cara de la promesa

Todo lo que se graba entra en uno. Si no entra, no se graba.

1. **Método** (35%) — cómo lee el mercado, qué mira antes de entrar, errores
   comunes con pantalla. Genera autoridad y guardados.
2. **Mercado en vivo** (20%) — reacción a lo que pasa esta semana. Genera
   recurrencia: la razón para volver mañana.
3. **Cuerpo y mentalidad** (30%) — entreno, rutina, cómo gestiona una racha
   mala, por qué la disciplina física y la del gráfico son la misma. **Este es
   el eje diferenciador de Golden Syndicate.** No es relleno lifestyle: es la
   prueba de la tesis.
4. **La comunidad** (15%) — qué pasa dentro del canal, miembros, cultura,
   propósito. Es lo que empuja el registro.

**Cadencia base:** 5 piezas/semana en el IG de Cristian, 3 nacidas de las
grabaciones con equipo y 2 grabadas con celular. La cuenta de Golden Syndicate
publica 3/semana, alimentada del mismo banco. Stories diarias sin producción.
`[POR CONFIRMAR]` según disponibilidad real de Cristian.

**Regla del banco de ganchos** (en `contenido/`): el gancho promete un
aprendizaje o una idea, nunca un retorno. "Por qué esta entrada era una trampa"
sí. "Cómo hice X% esta semana" no.

## 8. Pauta

**Fase 0 · antes de gastar.** Cuentas y píxel configurados, eventos probados con
tráfico real, landing publicada y midiendo. Revisar la política vigente de Meta
para productos y servicios financieros — **categoría restringida, los requisitos
cambian por país y por año; hay que mirar la política del momento del
lanzamiento, no la de la temporada pasada.**

**Fase 1 · amplificar lo que ya funciona (sem. 1-4).** No se inventan
creatividades para pauta: se toman las piezas orgánicas con mejor retención y se
les pone presupuesto. Objetivo conversión a lead, pocos conjuntos, público
amplio. Presupuesto de aprendizaje.

**Fase 2 · encontrar el ángulo (sem. 5-8).** Test de ángulos de mensaje —
método vs. disciplina vs. comunidad/propósito — no de colores de botón. Un
ángulo por conjunto. `ab-testing` para el diseño del test.

**Fase 3 · escalar con control de fatiga (sem. 9+).** Subidas graduales.
Vigilar frecuencia contra caída de CTR en serie diaria (por eso los exports van
por día, igual que en `meta-ads-lab`). Renovar creatividad antes de que suba el
CPL, no después.

**Retargeting** desde la fase 2: a quien vio 50% de un video o llegó a la landing
sin convertir. Mensaje distinto — prueba social de la comunidad, no la misma
oferta repetida.

Nota: las propias guías de Exness recomiendan Telegram, Discord y WhatsApp por
encima de pauta masiva. El embudo de la propuesta coincide con lo que el broker
prefiere; vale la pena mencionarlo cuando se negocien condiciones.

## 9. La landing

Seis principios, en orden de importancia:

1. **Una sola acción.** Entrar al canal. Nada compite.
2. **La promesa arriba y concreta.** Qué recibe, con qué frecuencia, gratis.
3. **Video de Cristian presentando el Syndicate.** El elemento de confianza más
   barato que existe para una marca personal. Sin él la página es de cualquiera.
4. **La promesa de los cinco frentes visible.** Es lo que hace que esta página no
   sea otra página de señales. Dinero, propósito, cuerpo, mentalidad, educación.
5. **Formulario corto.** Nombre, correo, WhatsApp es el máximo. WhatsApp es el
   campo caro: hay que justificarlo con la promesa.
6. **Descargo de riesgo visible.** En marcas financieras suma credibilidad.

Estética: negro y dorado, león. Sobriedad, no ostentación.

## 10. El canal: el producto de verdad

- **Ritual fijo.** Publicación a la misma hora todos los días de mercado, aunque
  sea "hoy no hay setup". La previsibilidad crea el hábito.
- **Contexto con cada señal.** Nunca el nivel solo: por qué, qué invalida la
  idea, qué se hace si falla. Eso convierte una señal en educación — y es lo que
  justifica que Cristian opere lo mismo que publica.
- **Los cinco frentes también dentro.** Si el canal es solo señales y frases
  motivacionales, la promesa de la landing no se cumple y la gente se va.
  `[POR CONFIRMAR]` cómo se estructura la semana dentro del canal.
- **Bienvenida en secuencia.** Los primeros 7 días definen si se queda:
  bienvenida, cómo se usa el canal, quién es Cristian, y recién ahí el broker.
- **El broker no se empuja el día uno.** Se presenta cuando el miembro ya vio
  valor. Empujarlo temprano quema la lista.

## 11. Cumplimiento — dos frentes, no uno

**Meta.** Nunca: rentabilidad prometida o insinuada, capturas de ganancias como
gancho, "ingreso pasivo", "libertad financiera", testimonios con cifras,
urgencia sobre dinero.

**Exness.** El broker prohíbe explícitamente prometer ganancias "garantizadas" o
"libres de riesgo", exige **declarar la condición de partner independiente** y
publicar descargo de riesgo. Romperlo no cuesta un anuncio: cuesta la cuenta de
partner, que es la monetización entera.

Texto base de descargo, en landing, bio y canal:

> El trading conlleva riesgo de pérdida. El contenido es educativo y no
> constituye asesoría de inversión. Los resultados pasados no garantizan
> resultados futuros. Opera solo con capital que puedas permitirte perder.

**"Cristian ya es rentable" no se usa como argumento público.** Es verdad y es
valioso, pero dicho de frente es exactamente lo que Meta castiga y Exness
prohíbe. Se comunica como método y consistencia, no como resultado.

**Transparencia sobre la comisión.** Que Cristian gane cuando alguien opera en
Exness debe estar declarado ante la comunidad. Ocultarlo destruye una marca de
confianza de un día para otro; declararlo cuesta una línea — y Exness lo exige.

Esto es criterio de marketing y de riesgo reputacional, no asesoría legal. Para
la exposición regulatoria real de Cristian frente a la normativa colombiana
sobre promoción de servicios financieros, que lo revise un abogado.

## 12. Los primeros 90 días

| Semanas | Foco | Cómo se sabe que salió bien |
|---|---|---|
| 1-2 | Descubrimiento, decisión de marca, números del panel de Exness, setup Meta | Contexto sin huecos; CPL máximo calculado |
| 3-4 | Landing en vivo, cuenta de Golden Syndicate abierta, primera grabación, banco de 20 ganchos | Landing midiendo conversión con tráfico orgánico |
| 5-8 | Pauta fase 1 y 2, ritmo de contenido estable, ritual diario en el canal | CPL con techo conocido; retención del canal a 7 días medida |
| 9-12 | Escala controlada, cursos integrados al embudo, primer informe con cifras de Exness | Tabla de conversión llena con datos reales |

Al cierre del trimestre la pregunta no es "¿funcionó?" sino **"¿cuánto vale un
miembro del canal y cuánto podemos pagar por él?"**. Ese es el entregable
estratégico real.

## 13. Riesgos

| Riesgo | Qué lo dispara | Mitigación |
|---|---|---|
| Bloqueo de cuenta publicitaria | Copy con promesa de rentabilidad | Regla en `CLAUDE.md` + skill `revision-copy-trading` antes de publicar |
| Pérdida de la cuenta de partner | Incumplir las guías de Exness | Mismo filtro, con el frente Exness incluido |
| Pauta a ciegas | Escalar sin saber el valor por referido | Sacar los números del panel antes de la fase 1 |
| Perder alcance al migrar | Apagar el IG personal por la cuenta nueva | Arquitectura de dos cuentas (sección 2) |
| Ingreso cero durante meses | Depender solo de comisiones diferidas | Meter los cursos al embudo |
| Dependencia de un solo broker | Cambio de condiciones o cierre del programa | La base de datos propia es el activo que sobrevive |
| Cristian no sostiene el ritmo | Producción que depende solo de 2 sesiones/mes | Dirección para contenido de celular, banco de ganchos lleno |
| Estética que traiciona la tesis | Dorado + lujo = uniforme del gurú | Sobriedad; el lujo es la disciplina, no el objeto |

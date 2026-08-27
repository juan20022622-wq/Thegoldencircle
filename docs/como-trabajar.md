# Cómo se trabaja este proyecto

Tres sitios, tres usos. El chat es desechable; **la memoria son estos archivos.**

## 1. Claude Code en la terminal — el frente de trabajo

```bash
cd ~/iagination/cristian
claude
```

Al abrir, Claude lee `CLAUDE.md` solo y ya sabe quién es Cristian, qué se le
vendió, qué no se puede escribir y qué skill usar en cada momento. No hay que
explicarle nada.

Para la landing, entrar por la subcarpeta — trae su propio `CLAUDE.md`:

```bash
cd ~/iagination/cristian/web
claude
```

Aquí están todas las skills: las globales de la máquina y el plugin `claude-ads`
(con prefijo: `claude-ads:ads-meta`).

## 2. La app de escritorio (Cowork) — conversación sobre archivos

Conectar la carpeta `iagination` con "Add folder" y pedir las cosas normal.
Sirve para dictar contexto, ordenar documentos y revisar sin abrir terminal.
Las skills de marketing están guardadas en la cuenta, así que también funcionan
aquí.

## 3. El Project de claude.ai — pensar desde el móvil

Se crea una vez:

1. Nuevo Project en claude.ai, nombre "Cristian · The Golden Syndicate"
2. Pegar en instrucciones personalizadas el contenido de
   `project-claude/instrucciones-project.md`
3. Correr `./project-claude/exportar-knowledge.sh` y subir los archivos que
   deja en `project-claude/knowledge/`

Cuando cambie la estrategia o el contexto, se vuelve a correr el script y se
re-suben. Es manual y son pocos archivos.

## El ciclo normal

1. Pasa algo — Cristian responde una pregunta, sale un dato del broker, se
   decide el logo
2. Se escribe en el archivo que corresponde (`docs/contexto-cliente.md` para
   datos del cliente, `marca/identidad.md` para decisiones de marca,
   `estrategia/` para el plan)
3. Se borra el `[POR CONFIRMAR]` que quedó resuelto
4. Si cambió algo que el Project debe saber, se corre el script de export

## Dónde va cada cosa

| Cosa | Archivo |
|---|---|
| Algo que dijo Cristian | `docs/contexto-cliente.md` |
| Una decisión de marca | `marca/identidad.md` |
| Un cambio de plan | `estrategia/00-marco-estrategico.md` |
| Un guion o un gancho | `contenido/` |
| Un export de Ads Manager | `data/` — nunca a git |
| Código de la landing | `web/` |

## Lo que nunca entra a git

Correos, teléfonos, cifras de la cuenta de Cristian, tokens. Todo eso vive en
`data/` o en `.env`, ambos ignorados.

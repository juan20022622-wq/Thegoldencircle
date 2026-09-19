# Los cinco carruseles de las llaves · tabla de conceptos

Cada lámina sale de cuatro pasos: **idea → tensión → gesto → objeto**. Las formas
no se eligen por bonitas; se eligen porque hacen el gesto. Lámina 1 es la portada
y la 6 es el cierre común: cinco losas, y la de esa llave encendida.

## 02 · dinero — tensión de la llave: buscar contra cuidar
| # | Idea | Gesto | Objeto |
|---|---|---|---|
| 1 | Primero se cuida | Algo valioso resguardado | Una esfera de oro dentro de una jaula de costillas |
| 2 | Cuánto estoy dispuesto a perder | Un límite puesto antes | Un carril, la esfera que rueda y el tope que ya estaba ahí |
| 3 | El tamaño sale de dos datos | La medida justa | Esferas de tamaño creciente; solo una es la que corresponde |
| 4 | Una pérdida pequeña es parte del plan | Una caída contenida | Fichas caídas, un tope, y las demás en pie |
| 5 | Lo primero es seguir en el camino | Un camino que no se corta | Losas que siguen hasta perderse de vista |

## 03 · propósito — impulso contra dirección
| # | Idea | Gesto | Objeto |
|---|---|---|---|
| 1 | Saber para qué | Apuntar | Una aguja en equilibrio sobre su eje |
| 2 | Sin para qué, todo parece oportunidad | Dispersarse | Un campo de varas, cada una hacia un lado |
| 3 | Con para qué, casi todo sobra | Alinearse | El mismo campo, que de una lámina a otra se ordena |
| 4 | Lo que te hace volver mañana | Volver | Una órbita alrededor de un centro |
| 5 | La pieza que sostiene a las otras | Sostener | Un arco, y su clave en oro |

## 04 · cuerpo — comodidad contra constancia
| # | Idea | Gesto | Objeto |
|---|---|---|---|
| 1 | La disciplina es una sola | Sostener un peso | Una masa sobre una columna delgada |
| 2 | Nadie mira, se hace igual | Contar los días | Barras iguales en fila, y la de hoy en oro |
| 3 | Aguantar una más | La tensión sostenida | Un arco tensado por su cuerda |
| 4 | Descansar también es entrenar | Reposar | Una esfera quieta en un cuenco |
| 5 | Sostener una rutina es sostener una decisión | El voladizo | Una viga que se atreve porque hay contrapeso |

## 05 · mentalidad — reaccionar contra estar en calma
| # | Idea | Gesto | Objeto |
|---|---|---|---|
| 1 | Calma cuando todo se mueve | La vertical | Una plomada entre losas que se inclinan |
| 2 | Una pérdida es un dato | Uno cae y la fila sigue | Bloques en pie y uno tumbado |
| 3 | La paciencia se entrena antes | Contener | Una esfera en una rampa, sujeta por una cuña pequeña |
| 4 | Saber esperar | El hueco que se elige | Pedestales ocupados y uno vacío, que es el que recibe la luz |
| 5 | Se nota en lo que no haces | El centro quieto | Anillos alrededor de algo que no se mueve |

## 06 · educación — el qué contra el porqué
| # | Idea | Gesto | Objeto |
|---|---|---|---|
| 1 | Entender el porqué | Abrir para ver dentro | Una esfera cortada que deja ver su núcleo |
| 2 | El porqué dice cuándo no | Encajar | Una pieza y el hueco exacto que le corresponde |
| 3 | Se aprende por capas | Acumular | Discos que se apilan hasta hacer cuerpo |
| 4 | Preguntar es parte del método | Propagarse | Una esfera y las ondas que salen de ella |
| 5 | Dejas de depender | Soltarse | El carril se acaba y la esfera sigue sola |

## Cómo se regeneran

    MODULOS=<carpeta temporal con three, puppeteer-core y sharp>
    node escenas/render-escena.mjs "escenas/pilares.html?pilar=dinero" <teselas/> 180 0,1,2,3,4,5
    node carruseles/pilares.mjs dinero <teselas/>

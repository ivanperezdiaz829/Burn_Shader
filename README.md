<!-- @import "design/style.css" -->

# **SHADER CON EFECTO DE QUEMADO**

## ÍNDICE

- [Idea y motivación del shader](#idea-y-motivación-del-shader)
- [Resultados](#resultados)
- [Fuentes y Documentación](#fuentes-y-documentación)

El proyecto consiste en crear un *shader* de libre disposición para aplicarlo sobre algún objeto, en el caso del mismo, se ha decidido diseñar un efecto de quemadura a aplicar sobre distintos elementos.

## IDEA Y MOTIVACIÓN DEL SHADER

La idea de hacer un efecto de quemadura surgió mientras realizaba un trabajo de investigación para recolectar ideas, durante ese proceso acabé en un hilo de *Reddit* acerca de shaders hechos en **Unity** y entre ellos, encontré una animación corta de una textura de papel quemado hecho con la herramienta anteriormente mencionada.

<h4 style="font-weight: bold">Video de inspiración sacado de reddit:</h4>

[![Video_reddit](/Images_Readme/Reddit.png)](https://www.reddit.com/r/Unity3D/comments/13pmlam/60sec_shader_breakdown_how_to_make_realistic/?tl=es-419)

De dicho vídeo se obtuvo la idea de utilizar ruido (imagen a escala de grises que utilizar como plantilla) y una imagen cualquiera (una foto antigua para imitar el video) para crear un efecto de quemado de manera gradual dependiendo de la escala de grises del propio ruido.

## RESULTADOS

Para crear el efecto esperado, como se ha comentado anteriormente, se ha hecho uso de imágenes de ruido y mediante un graduado de tonalidades en escala de grises se aplica un efecto de quemado sobre otra imagen (imagen *"original"*), el [shader](/shaders/burn_effect1.frag) consiste en un panel de color simple y modificable, de hecho, el proyecto tiene 3 modificaciones del shader con diferentes colores que se pueden cargar dentro del [shader.js](/shader.js) para visualizar los resultados, así como se puede modificar la imagen de ruido repitiendo la propia imagen original para generar otro efecto vistoso.

El efecto de quemadura se consigue aplicando gradualmente el efecto de quemado (cambiar la zona quemada a gris oscuro y aplicar el shader en los bordes) sobre los tonos más oscuros de la imagen seleccionada como ruido, y mostrando el efecto sobre la imagen seleccionada para ser quemada, así, dependiendo del ruido seleccionado, se consiguen diferentes efectos de quemado.

A continuación se muestran unos ejemplos de los shaders con el efecto de quemado con los diferentes colores del shader:

- Usando el [shader morado](/shaders/burn_effect1.frag) y la propia [imagen](/textures/unnamed.jpg) como ruido:

![Morado_No_Ruido](/Images_Readme/Morado_Imagen.gif)

- Usando el [shader morado](/shaders/burn_effect1.frag) y el ruido de [quemadura](/textures/burnNoises/textura-granulada-abstracta.jpg):

![Morado_Ruido](/Images_Readme/Morado_ruido.gif)

- Usando el [shader fuego](/shaders/burn_effect2.frag) y la propia [imagen](/textures/unnamed.jpg) como ruido:

![Fuego_No_Ruido](/Images_Readme/Fuego_Imagen.gif)

- Usando el [shader fuego](/shaders/burn_effect2.frag) y el ruido de [quemadura](/textures/burnNoises/textura-granulada-abstracta.jpg):

![Fuego_Ruido](/Images_Readme/Fuego_ruido.gif)

- Usando el [shader verdoso](/shaders/burn_effect3.frag) y la propia [image](/textures/unnamed.jpg) como ruido:

![Verde_No_Ruido](/Images_Readme/Verde_Imagen.gif)

- Usando el [shader verdoso](/shaders/burn_effect3.frag) y el ruido de [quemadura](/textures/unnamed.jpg):

![Verde_Ruido](/Images_Readme/Verde_ruido.gif)

Comentar que se tenía pensado agregar en el *shader* un efecto de quemadura dinámico pero debido a la restricción del peso máximo de 512B propuesto, no ha sido posible la implementación.

## FUENTES Y DOCUMENTACIÓN

- **Internet:** Se ha utilizado internet para la búsqueda de información y documentación, así como diferentes páginas de y foros en donde se muestran ejemplos y vídeos de *shaders*.

- **Inteligencia Artificial Generativa (ChatGPT, Gemini):** Se ha utilizado la IA únicamente para exportar una versión de la animación completamente en .js para obtener los .frag.

- **Enlaces:**
    - https://www.reddit.com/r/Unity3D/comments/13pmlam/60sec_shader_breakdown_how_to_make_realistic/?tl=es-419
    - https://www.filterforge.com/filters/
    - https://threejs.org/docs/
    - https://gemini.google.com
    - https://www.freepik.com/search?format=search&last_filter=query&last_value=semless+burn&query=semless+burn#uuid=3103a6b8-188e-4197-9029-22db5d106dec

--- Iván Pérez Díaz ---
Durante el desarrollo del proyecto se utilizó ChatGPT como herramienta de asistencia técnica para consultar dudas, obtener ejemplos de código, implementar funcionalidades y detectar posibles errores.

La IA se utilizó como apoyo durante el proceso de programación, pero las decisiones finales sobre el código, las modificaciones y las pruebas realizadas quedaron bajo mi responsabilidad.

Prompts utilizados

A lo largo del desarrollo se realizaron diferentes consultas a la Inteligencia Artificial para resolver problemas y avanzar con la implementación del videojuego.

Entre los principales prompts utilizados se encuentran:

Prompt 1: Desarrollo inicial del juego

"Quiero desarrollar un juego basado en el dinosaurio de Google Chrome utilizando React JS. Necesito implementar la mecánica de movimiento, los obstáculos y los controles del personaje."

Prompt 2: Implementación de desafíos.

"Quiero agregar desafíos y preguntas que aparezcan cada cierto tiempo durante la partida. Cuando aparezca un desafío, el juego debe pausarse hasta que el jugador responda."

Prompt 3: Renderizado condicional

"Necesito solucionar cómo mostrar y ocultar los elementos del juego cuando aparece el menú de un desafío, utilizando estados de React y renderizado condicional."

Prompt 4: Sistema de vidas y puntuación

"¿Cómo puedo implementar un sistema de vidas y puntos utilizando useState, de manera que el jugador pierda una vida cuando responde incorrectamente y el juego termine cuando llegue a cero?"

Prompt 5: Corrección de errores

"Estoy teniendo problemas con el funcionamiento de algunas condiciones del juego. Necesito que revises la lógica y me expliques cómo corregir los errores sin afectar el resto de las funcionalidades."

Prompt 6: Sentencias de control

"Necesito implementar y comprender el uso de if/else, switch, operador ternario y && dentro del juego para controlar las preguntas, las respuestas y los diferentes estados de la partida."

Error generado por la IA y corrección técnica

Durante el desarrollo se presentó un inconveniente con una de las soluciones de código propuestas por la Inteligencia Artificial.

Error: El dinosaurio no desaparecía al aparecer un desafío

Al implementar el sistema de preguntas, se solicitó a la IA una solución para pausar el juego y mostrar el menú correspondiente al desafío.

La primera solución propuesta no controlaba correctamente la visualización de todos los elementos. Como resultado, cuando aparecía el menú de preguntas, el dinosaurio seguía apareciendo en pantalla, aunque la partida estuviera pausada.

Análisis del problema

El inconveniente estaba relacionado con el renderizado condicional. La condición utilizada para mostrar el menú del desafío no contemplaba correctamente la visibilidad del dinosaurio y de los demás elementos que pertenecían a la partida.

Es decir, pausar el juego no significaba necesariamente ocultar sus elementos visuales, ya que eran dos comportamientos que debían controlarse por separado.

Solución aplicada

Se revisó la estructura del renderizado y se modificaron las condiciones para controlar qué elementos debían mostrarse dependiendo del estado actual del juego.

Se utilizaron estados de React y operadores condicionales para que, cuando apareciera un desafío, los elementos correspondientes a la partida dejaran de mostrarse.

De esta manera, se consiguió separar correctamente la pantalla del juego de la pantalla de preguntas.

Resultado y aprendizaje

Este error permitió comprender que no alcanza con solicitar una solución a la IA y copiar el código directamente. Es necesario analizar cómo funciona, probarlo dentro del proyecto y comprobar que no genere problemas en otras funcionalidades.

También permitió comprender mejor la diferencia entre pausar la lógica del juego y modificar los elementos que se muestran en pantalla mediante renderizado condicional.

Reflexión crítica sobre el uso de Inteligencia Artificial

La utilización de ChatGPT durante el desarrollo del proyecto resultó útil para resolver dudas y avanzar con funcionalidades que requerían conocimientos de React JS.

Una de las principales facilidades fue poder obtener ejemplos de código y explicaciones sobre conceptos como useState, el renderizado condicional, los eventos y las sentencias de control. Esto permitió ahorrar tiempo al momento de buscar soluciones y comprender cómo implementar determinadas características del juego.



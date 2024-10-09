Frontend - FluentPhrases - MERN Stack Application

Este repositorio contiene el código fuente del frontend de una aplicación web desarrollada con el stack MERN (MongoDB, Express, React JS, Node.js). Si estás interesado en explorar más proyectos o colaborar, me encuentro abierto a ofertas laborales como desarrollador React JS y MERN.

Descripción General

El frontend de la aplicación está construido utilizando React JS con Vite como herramienta de construcción. La interfaz permite a los usuarios interactuar con una base de datos de frases en inglés y frases en portugués traducidas en ambos casos al español y almacenadas en MongoDB. Las principales funcionalidades incluyen:

Selección de idioma y categorías de frases mediante un menú desplegable.

Muestra de una frase aleatoria dentro de una categoría o sin seleccionar ninguna categoría.

Reproducción de la frase en inglés con una API de texto a voz.

Navegación entre frases dentro de una categoría, en orden alfabético.

Funcionalidades adicionales como copiar la frase, compartirla y mostrar una nueva frase aleatoria.


Tecnologías Utilizadas

React JS: Para la construcción de la interfaz de usuario.

TypeScript: Mejora de la tipificación estática en todo el proyecto.

Vite: Utilizado para configurar el entorno de desarrollo del frontend.

Tailwind CSS: Para el diseño y estilización de los componentes.

Axios: Para manejar las solicitudes HTTP hacia el backend.

Text-to-Speech API: Para reproducir las frases en inglés de manera audible.


Estructura del Proyecto

El proyecto sigue una estructura estándar de React con TypeScript y está organizado de la siguiente manera:

src/: Contiene todos los archivos de código fuente.

components/: Componentes reutilizables de la aplicación.

services/: Servicios para realizar llamadas a la API del backend.

styles/: Configuración de Tailwind CSS.

App.tsx: Componente principal que estructura la aplicación.



Características Clave

1. Selección de Categoría: El usuario puede elegir entre varias categorías de frases.


2. Navegación Entre Frases: Posibilidad de avanzar y retroceder entre frases ordenadas alfabéticamente.


3. Reproducción en Voz Alta: Conexión a una API para reproducir la frase seleccionada.


4. Acciones Adicionales: El usuario puede copiar la frase, compartirla o generar una nueva frase aleatoria.



Instalación

Para ejecutar el frontend en tu máquina local, sigue los siguientes pasos:

1. Clona el repositorio:



git clone https://github.com/tuusuario/tu-repo.git

2. Navega al directorio del frontend:



cd frontend

3. Instala las dependencias:



npm install

4. Inicia la aplicación en modo de desarrollo:



npm run dev

La aplicación estará disponible en http://localhost:3000.

Contribución

Si deseas contribuir a este proyecto, siéntete libre de hacer un fork del repositorio y enviar tus pull requests. Las colaboraciones y sugerencias son bienvenidas.

Contacto

Si tienes alguna duda o te gustaría colaborar en futuros proyectos, no dudes en contactarme a través de GitHub.


---

Este proyecto forma parte de una solución completa utilizando el stack MERN, conectando con un backend desarrollado en Node.js y Express. La base de datos está alojada en MongoDB y permite almacenar y gestionar las frases en inglés y su traducción al español.


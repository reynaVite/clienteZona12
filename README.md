![image](https://github.com/user-attachments/assets/e44e6477-c328-4c89-a0f2-a6a92ea6a88e)# Proyecto de Aplicación Web Progresiva (PWA)

## Descripción del Proyecto
Este proyecto consiste en una **Aplicación Web Progresiva (PWA)** desarrollada con tecnologías modernas como **React +  Vite** y **Service Workers** para ofrecer una experiencia web mejorada y optimizada para dispositivos móviles y de escritorio. Su principal objetivo es facilitar el acceso a los recursos y funcionalidades clave de manera intuitiva y eficiente, mejorando la experiencia del usuario final tanto en línea como offline. La aplicación está diseñada para ser rápida, confiable y accesible, permitiendo la interacción con la plataforma incluso cuando no hay conexión a internet disponible.

El desarrollo sigue una metodología ágil basada en los principios de **Extreme Programming (XP)**, priorizando ciclos rápidos de entrega, colaboración continua y flexibilidad para adaptarse a los cambios en los requisitos a medida que surgen nuevas necesidades.

## Metodología de Desarrollo

### 1. Metodología utilizada
La metodología elegida para este proyecto es **Extreme Programming (XP)**, que se caracteriza por ciclos rápidos de retroalimentación, trabajo en equipo colaborativo y énfasis en la calidad del código. XP asegura que el producto pueda ajustarse rápidamente a nuevas funcionalidades y requerimientos, manteniendo un alto estándar técnico.

### 2. ¿Cómo se aplicó esta metodología?
El proyecto está dividido en sprints de corta duración (1-3 semanas). Cada sprint tiene objetivos claros y se revisa el progreso del proyecto al menos tres veces por sprint. La planificación y la retroalimentación constante con el equipo son claves para ajustarse a los cambios.

### 3. Planificación y fases del proyecto
El proyecto está dividido en las siguientes fases:

- ## 1. Preparación del entorno
- ## 2. Auditoría del Proyecto
- ## 3. Diseño de la Aplicación y Creación del App Shell
- ## 4. Implementación del Archivo `manifest.js`
- ## 5. Implementación del Service Worker y Funcionalidad Offline
- ## 6. Implementación de Notificaciones Push
- ## 7. Pruebas Finales y Despliegue

## Gestión de Tareas e Issues

### 1. Herramienta seleccionada
Utilizamos **Trello** para la gestión de tareas e issues. Las tarjetas están organizadas en listas que representan el estado de la tarea (Pendiente, En progreso, Finalizada).

### 2. Proceso de gestión de tareas en Trello
El flujo de trabajo en Trello es el siguiente:

1. **Creación de tarjeta**: Se crea una tarjeta en la lista de tareas pendientes.
2. **Asignación de tarea**: Se asigna una tarea a un miembro del equipo.
3. **Trabajo en la tarea**: La tarjeta se mueve a la lista correspondiente una vez que está en progreso.
4. **Revisión**: Tras finalizar la tarea, un miembro del equipo la revisa.
5. **Cierre de tarea**: La tarjeta se mueve a la lista de tareas completadas.

### 3. Priorización de tareas
Las tareas están etiquetadas por prioridad en Trello:

- **Alta**: Tareas críticas que deben completarse primero.
- **Media**: Tareas importantes pero no urgentes.
- **Baja**: Mejoras o ajustes menores.

--- 

## Control de Versiones

### 1. Herramienta seleccionada
Utilizamos **Git** para el control de versiones, con **GitHub** como la plataforma de colaboración. Las ramas permiten organizar y controlar el avance del desarrollo.

### 2. Estrategia de versionamiento
Se sigue la estrategia **GitFlow**:

- `main`: Contiene el código de producción estable.
- `develop`: Integra las nuevas funcionalidades antes de pasar a producción.
- `feature/`: Ramas creadas para desarrollar características específicas.
- `hotfix/`: Ramas para corregir errores críticos en producción.
### 3. Creacion de ramas
1. **Creación de ramas**:
   - Para cada nueva funcionalidad, se crea una rama desde `develop` con el prefijo `feature/` (e.g., `feature/nueva-funcionalidad`). Cada miembro del equipo trabaja en su rama hasta que la funcionalidad está completa.
   - Para preparaciones de lanzamientos, se crean ramas `release/` desde `develop`.
   - Las correcciones urgentes se realizan en ramas `hotfix/` creadas desde `master`.

2. **Revisión de código**:
   - Una vez completada la funcionalidad en la rama `feature/`, se crea un **pull request** hacia la rama `develop`. Este proceso incluye una revisión exhaustiva del código por otros miembros del equipo para garantizar que cumple con los estándares de calidad, y que no introduce errores o conflictos.
   - Las ramas `release/` y `hotfix/` también requieren pull requests hacia `develop` y `master`.

3. **Fusión**:
   - Después de pasar la revisión y las pruebas, las ramas `feature/` se fusionan en `develop` y las ramas `hotfix/` se fusionan tanto en `develop` como en `master`.
   - Las ramas de preparación de lanzamiento (`release/`) son fusionadas en `master` una vez que se aprueban y se lanzan a producción.

Este flujo asegura que cada nueva funcionalidad o corrección pase por un proceso de revisión y pruebas antes de ser integrada en las ramas principales, lo que mejora la calidad y estabilidad del código.

### 4. Integracion CI
- **Pruebas unitarias** para asegurar que cada componente del sistema funcione correctamente.
- **Pruebas de integración** para validar que los módulos interactúan adecuadamente entre sí.
- **Linting y análisis de estilo** para asegurar que el código cumpla con las guías de estilo definidas y sea mantenible.

La integración continua también ayuda a detectar errores de manera temprana y evitar que código defectuoso llegue a producción, mejorando así la eficiencia del equipo y la estabilidad del proyecto.

---
 
## Estrategia de Despliegue

### 1. Estrategia seleccionada
Utilizamos una estrategia de **Canary Deployment** para desplegar nuevas versiones de la PWA de forma gradual. Esto asegura que las nuevas características no afecten a todos los usuarios en caso de problemas.

### 2. Definición de entornos
El proyecto se despliega en los siguientes entornos:

- **Desarrollo**: Se prueba el código en las ramas `feature/`.
- **Staging**: Se revisa la integración de las ramas `develop`.
- **Producción**: Contiene el código estable de la rama `main`.

### 3. Integración continua
Usamos **GitHub Actions** para la integración continua, permitiendo que las pruebas y el despliegue se automaticen en cada commit a `develop` o `main`.

## Instrucciones para Ejecutar el Proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/reynaVite/clienteZona12.git
cd clienteZona12
```
### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar proyecto
```bash
npm run dev
```

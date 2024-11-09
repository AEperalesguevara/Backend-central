
# Food API

## Descripción

Este proyecto es una API para la gestión de alimentos (Food API). Permite realizar operaciones como agregar, listar y eliminar alimentos. 
La API está construida utilizando **Node.js**, **Express**, y **Prisma** como ORM para la base de datos **PostgreSQL**. 
El proyecto también soporta la subida de imágenes asociadas a los alimentos y su eliminación del servidor.

## Características

- **Agregar alimentos**: Crea un nuevo alimento con su información y su imagen correspondiente.
- **Listar alimentos**: Devuelve una lista de todos los alimentos en la base de datos.
- **Eliminar alimentos**: Elimina un alimento por su ID, incluyendo la eliminación de la imagen asociada.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript en el servidor.
- **Express**: Framework para la creación de aplicaciones web y APIs.
- **Prisma**: ORM para manejar la base de datos PostgreSQL.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional.
- **Multer**: Middleware para la subida de archivos.
- **TypeScript**: Superconjunto de JavaScript que añade tipado estático.

## Requisitos

- **Node.js** (versión 14 o superior)
- **PostgreSQL** (versión 13 o superior)
- **DBeaver** (opcional, para la visualización de la base de datos)
- **Prisma CLI**: Para manejar la base de datos y los modelos.

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/tu_usuario/food-api.git
   ```

2. Instalar las dependencias:

   ```bash
   cd food-api
   npm install
   ```

3. Configurar las variables de entorno. Crear un archivo `.env` en la raíz del proyecto con la siguiente información:

   ```env
   DATABASE_URL="postgresql://usuario:password@localhost:5432/restaurant-db"
   ```

4. Ejecutar las migraciones de Prisma para crear las tablas en la base de datos:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Iniciar el servidor:

   ```bash
   npm run dev
   ```

6. El servidor debería estar corriendo en: `http://localhost:3000`.

## Rutas de la API

### 1. **Agregar alimento** - `POST /api/food/add`

   Permite agregar un nuevo alimento.

   **URL**: `/api/food/add`

   **Parámetros**:

   - `name` (String) - Nombre del alimento.
   - `price` (Number) - Precio del alimento.
   - `image` (File) - Imagen del alimento (archivo tipo `multipart/form-data`).

   **Ejemplo de Petición (Postman)**:

   - Método: `POST`
   - URL: `http://localhost:3000/api/food/add`
   - Body: 
     - Form-data:
       - `name`: Pizza
       - `price`: 15
       - `image`: [Subir archivo de imagen]

   **Respuesta Exitosa**:

   ```json
   {
     "success": true,
     "message": "Food Added",
     "food": { "id": 1, "name": "Pizza", "price": 15, "image": "pizza.jpg" }
   }
   ```

### 2. **Listar alimentos** - `GET /api/food/list`

   Devuelve una lista de todos los alimentos registrados.

   **URL**: `/api/food/list`

   **Ejemplo de Petición (Postman)**:

   - Método: `GET`
   - URL: `http://localhost:3000/api/food/list`

   **Respuesta Exitosa**:

   ```json
   [
     {
       "id": 1,
       "name": "Pizza",
       "price": 15,
       "image": "pizza.jpg"
     },
     {
       "id": 2,
       "name": "Hamburguesa",
       "price": 10,
       "image": "hamburguesa.jpg"
     }
   ]
   ```

### 3. **Eliminar alimento** - `POST /api/food/remove`

   Elimina un alimento por su ID.

   **URL**: `/api/food/remove`

   **Parámetros**:

   - `id` (Number) - ID del alimento a eliminar.

   **Ejemplo de Petición (Postman)**:

   - Método: `POST`
   - URL: `http://localhost:3000/api/food/remove`
   - Body:
     - raw:
       ```json
       {
         "id": 1
       }
       ```

   **Respuesta Exitosa**:

   ```json
   {
     "success": true,
     "message": "Food Removed"
   }
   ```

## Estructura del Proyecto

```bash
Backend/
├── config/
├── controllers/
├── dist/
├── middleware/
├── models/
├── node_modules/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── routes/
├── src/
├── uploads/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Cómo Probar

Se recomienda utilizar **Postman** o **cURL** para hacer pruebas de las rutas. Las pruebas incluyen agregar alimentos con imágenes, listar alimentos y eliminar alimentos por su ID.

### Agregar alimento con Postman:
1. Selecciona el método `POST`.
2. Ingresa la URL `http://localhost:3000/api/food/add`.
3. En el **Body** selecciona `form-data`.
4. Añade los campos `name`, `price` y la imagen correspondiente (`image`).
5. Haz clic en **Send**.

### Eliminar alimento con Postman:
1. Selecciona el método `POST`.
2. Ingresa la URL `http://localhost:3000/api/food/remove`.
3. En el **Body** selecciona `raw` y luego `JSON`.
4. Introduce el JSON con el `id` del alimento:
   ```json
   {
     "id": 1
   }
   ```
5. Haz clic en **Send**.

## Contribuir

Si deseas contribuir a este proyecto, por favor realiza un `fork` del repositorio y envía un **pull request** con tus mejoras.

## Licencia

Este proyecto está bajo la licencia MIT.


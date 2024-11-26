
# Food API

## Descripción

Este proyecto es una **API para la gestión de un Restaurante - Ecommerce**. Permite realizar operaciones como agregar, listar y eliminar alimentos, además de gestionar órdenes, reservas, y usuarios.
La API está construida utilizando **Node.js**, **Express**, y **Prisma** como ORM para interactuar con una base de datos **PostgreSQL**. También soporta la **subida de imágenes** asociadas a los alimentos mediante **Multer** y **Cloudinary**.

## Características

- **Gestión de platillos**: Agregar, listar y eliminar diferentes platos con sus respectivas imágenes.
- **Gestión de usuarios**: Registro y autenticación de usuarios.
- **Órdenes y reservas**: Crear y administrar pedidos y reservas.
- **Subida de imágenes**: Carga y gestión de imágenes utilizando Multer y Cloudinary.
-**Envio de Correos**: Envio automatico de correos al hacer una reserva.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript en el servidor.
- **Express**: Framework para crear aplicaciones web y APIs.
- **Prisma**: ORM para manejar la base de datos PostgreSQL.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional.
- **Multer**: Middleware para la subida de archivos.
- **Cloudinary**: Servicio de almacenamiento de imágenes en la nube.
- **TypeScript**: Superconjunto de JavaScript con tipado estático.

## Requisitos

- **Node.js** (versión 18 o superior)
- **PostgreSQL** (versión 13 o superior)
- **Prisma CLI**: Para manejar la base de datos y los modelos.
- **Cloudinary Account**: Para almacenar imágenes en la nube.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/JohanEmersonPinares/Backend
   ```

2. Instala las dependencias:

   ```bash
   cd food-api
   npm install
   ```

3. Configura las variables de entorno. Crea un archivo `.env` en la raíz del proyecto con la siguiente información:

   ```env
   DATABASE_URL="postgresql://usuario:password@localhost:5432/restaurant-db"
   CLOUDINARY_CLOUD_NAME="tu_cloud_name"
   CLOUDINARY_API_KEY="tu_api_key"
   CLOUDINARY_API_SECRET="tu_api_secret"

Ademas se requieren las variables de entorno de Stripe y del Nodeemailer
   ```

4. Ejecuta las migraciones de Prisma para crear las tablas en la base de datos:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Inicia el servidor:

   ```bash
   npm run dev
   ```

6. La API estará disponible en `http://localhost:3000`.

## Estructura del Proyecto

```bash
Backend/
├── config/                # Configuraciones principales
│   ├── cloudinary.ts      # Configuración de Cloudinary
│   ├── db.ts              # Configuración de la base de datos (Prisma)
│   └── multer.ts          # Configuración de Multer
├── controllers/           # Controladores de la API
│   ├── cartController.ts  # Controlador para el carrito
│   ├── foodController.ts  # Controlador para alimentos
│   ├── orderController.ts # Controlador para órdenes
│   ├── reservationController.ts # Controlador para reservas
│   └── userController.ts  # Controlador para usuarios
├── dist/                  # Código transpilado por TypeScript
├── middleware/            # Middleware personalizados
│   └── auth.ts            # Middleware de autenticación
├── models/                # Modelos de datos
│   ├── foodModel.ts       # Modelo de alimentos
│   └── userModel.ts       # Modelo de usuarios
├── prisma/                # Configuración de Prisma
│   ├── migrations/        # Migraciones de la base de datos
│   └── schema.prisma      # Definición del esquema
├── routes/                # Definición de rutas
│   ├── cartRoute.ts       # Rutas del carrito
│   ├── foodRoute.ts       # Rutas de alimentos
│   ├── orderRoute.ts      # Rutas de órdenes
│   ├── reservationRoute.ts # Rutas de reservas
│   └── userRoute.ts       # Rutas de usuarios
├── src/                   # Código principal
│   ├── app.ts             # Configuración inicial del servidor
│   └── index.ts           # Entrada principal
├── uploads/               # Almacenamiento temporal de imágenes
├── .env                   # Variables de entorno
├── .gitignore             # Archivos ignorados por Git
├── package.json           # Configuración de dependencias
├── package-lock.json      # Información detallada de dependencias
├── tsconfig.json          # Configuración de TypeScript
└── README.md              # Documentación del proyecto
```

## Rutas Principales de la API

### Alimentos

- **Agregar alimento**: `POST /api/food/add`
- **Listar alimentos**: `GET /api/food/list`
- **Eliminar alimento**: `POST /api/food/remove`

### Usuarios

- **Registrar usuario**: `POST /api/user/register`
- **Autenticar usuario**: `POST /api/user/login`

### Órdenes

- **Crear orden**: `POST /api/order/add`
- **Listar órdenes**: `GET /api/order/list`

### Reservas

- **Crear reserva**: `POST /api/reservation/`
- **Listar reservas**: `GET /api/reservation/`

## Cómo Probar

1. Utiliza herramientas como **Postman** o **cURL** para realizar pruebas de las rutas.
2. Asegúrate de configurar correctamente las variables de entorno para la conexión con la base de datos y Cloudinary.


## ✨ Autores

- **[@JohanPinares](https://github.com/JohanEmersonPinares)**
- **[@BryamAranguri](https://github.com/bryamaranguri)**
- **[@AEperalesguevara](https://github.com/AEperalesguevara)**


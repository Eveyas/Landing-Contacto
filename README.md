# Landing Contacto
Temática: Soporte Técnico Profesional

## Concepto:
Este proyecto consiste en implementar un formulario de contacto interactivo, permitiendo a los usuarios ingresar sus datos personales, de modo que estos datos serán enviados a un endpoint API local mediante una solicitud HTTP POST

## Integrantes
- Laines Cupul Evelin Yasmin - 22394139@utcancun.edu.mx
- Medrano Cordova Edgar - 22393268@utcancun.edu.mx

# Herramientas utilizadas: 
## FRONTEND
- React: biblioteca de JavaScript para construir las interfaces del usuario
- CSS: para el diseño personalizado y responsivo

## BACKEND
- Node.Js: es el entorno de ejecución para JavaScript en el servidor

BD:
- Mysql: sistema de gestión de bases de datos relacionales, permitiendo almacenar los datos del formulario

# Pasos para correr el proyecto 

## Frontend
Clonar el repositorio
```sh
git clone https://github.com/Eveyas/Landing-Contacto.git
```
Entrar a la carpeta 'Frontend' del proyecto
```sh
cd Frontend
```
Instalar las dependencias correspondientes
```sh
npm install
```
Inicializar el Frontend
```sh
npm start
```


## Backend
Creación de la Base de datos en 'Mysql'
```sh
CREATE DATABASE LandingPage;
USE LandingPage;

CREATE TABLE ContacUs (
id INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR (30),
apellidos VARCHAR (50),
correo VARCHAR (50),
telefono VARCHAR (15),
mensaje TEXT
);
```
Configuración del archvivo .env
```sh
DB_HOST=localhost
DB_USER=******
DB_PASSWORD=******
DB_NAME=LandingPage
```
Entrar a la carpeta 'Backend' del proyecto
```sh
cd Backend
```
Instalar las dependencias correspondientes
```sh
npm install
```
Inicializar el Backend
```sh
node app.js
```

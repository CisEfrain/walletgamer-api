# Api WalletGamer

### Requerimientos

  - Node Js
  - MySql


### Instalación Local

1. Clonar el repositorio

```sh
git clone git@gitlab.com:walletgamer/api.git
```

2. Instalar las dependencias

```sh
npm install
```

3. Crear base de datos MySql con el nombre: wallet
4. Verificar conexion de base de datos en el archivo: ./config/development
5. Generar las tablas de la base de datos

```sh
npm run migration
```
6. Iniciar el servidor en local

```sh
npm run dev
```

# Express Boilerplate

## Installation

### Clone this project from git

```sh
$ git clone git@github.com:dekhangga/express-boilerplate.git
```

### Required Tools

Make sure you have [npm](https://www.npmjs.org/) installed globally.

```sh
$ sudo apt-get install npm
```

### Setup configuration

* Create file (project-directory)/config/env.json. by using sample template on env.json.example
Notes: If you don't wanna using auth, just set usingAuth = false

### Install dependencies

In the project root directory run the following command to install the dependencies:

```sh
$ npm install
```

### Database configuration

* This starter pack using [db-migrate](https://db-migrate.readthedocs.io/) for migration purpose. You should install db-migrate globally.
* This starter pack using sqlite3 by default. You can change this on (project-directory)/config/database.json
* Run default migration (create user table) by run the following command:
```sh
$ db-migrate up --config config/database.json
```
* This starter pack using [sequelize](http://docs.sequelizejs.com/) for ORM.

### Project description
* See sample routes on components/authentication.js and controllers directory
* See sample models and its dependencies on models directory
* See sample services on services.js and services directory
* See sample config on config directory

## How to Run

In the project root directory run the following command to run the server:

```sh
$ node app.js
```
Or if you want to use [nodemon](https://github.com/remy/nodemon)
```sh
$ npm install -g nodemon
$ nodemon app.js
```
Server will run by default on http://localhost:3000/. The port can be changed in file .env.json.
Sample API:
* GET http://localhost:3000/api/users
* POST http://localhost:3000/api/register with body {"username": "admin", "password": "123456"}
* POST http://localhost:3000/api/uploads with params: file
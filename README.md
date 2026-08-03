# Todo List API

A simple Todo List REST API built with **Node.js**, **Express**, and **SQLite**.

This project started as a basic CRUD application and is being expanded with authentication and user management.

## Features

* Todo CRUD operations
* SQLite database integration
* Input validation
* User registration
* Password hashing with bcrypt
* Modular route structure

## Tech Stack

* Node.js
* Express.js
* SQLite
* better-sqlite3
* bcrypt

## Installation

Clone the repository:

```bash
git clone https://github.com/MagnusGPT/todo-app-with-authentication
cd todo-list
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The API will run on:

```
http://localhost:3000
```

## API Endpoints

### Todos

```
GET    /todos
GET    /todos/:id
POST   /todos
PUT    /todos/:id
DELETE /todos/:id
```

### Authentication

```
POST /register
POST /login
```

(Authentication is currently being implemented.)

## Database

The application uses SQLite with tables for:

* Users
* Todos

Todos are designed to belong to users through a relationship between the two tables.

---

Built as a learning project to practice backend development, databases, and API design.

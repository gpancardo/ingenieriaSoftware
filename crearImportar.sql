CREATE DATABASE db;

USE db;

CREATE TABLE usuarios (
  numUsuario INT PRIMARY KEY,
  nombre VARCHAR(100),
  fechaRegistro DATE,
  licencia VARCHAR(50),
  area VARCHAR(55)
);
CREATE TABLE tickets (
  ticket INT PRIMARY KEY,
  titulo VARCHAR(100),
  fechaRegistro DATE,
  contenido VARCHAR(50),
  estado INT(3)
);
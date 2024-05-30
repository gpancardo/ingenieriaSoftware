CREATE DATABASE db;

USE db;

CREATE TABLE alumnos (
  numeroCuenta INT PRIMARY KEY,
  nombre VARCHAR(100),
  fechaRegistro DATE,
  carrera VARCHAR(50),
  email VARCHAR(55)
);
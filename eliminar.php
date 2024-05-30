<?php

$host = '';
$user = '';
$contra = '';
$bd = '';

$conexion = new mysqli($host, $user, $contra, $bd);

$numeroCuenta = $_POST['numeroCuenta'];

$consulta = "DELETE FROM alumnos WHERE numeroCuenta = '$numeroCuenta'";

$conexion->query($consulta);

header("Location: " . "https://fesarweb2.000webhostapp.com/listar.php");

$conexion->close();
?>

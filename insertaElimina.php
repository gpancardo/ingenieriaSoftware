<?php

$host = '';
$user = '';
$contra = '';
$bd = '';

$conexion = new mysqli($host, $user, $contra, $bd);

// Verificar si se esta enviando un numero de cuenta para eliminar
if(isset($_POST['eliminarCuenta'])) {
    $numeroCuenta = $_POST['eliminarCuenta'];

    $consulta = "DELETE FROM alumnos WHERE numeroCuenta = '$numeroCuenta'";
    
    $conexion->query($consulta);

    $conexion->close();
    
    header("Location: https://fesarweb2.000webhostapp.com/listar.php");
    exit(); // Salir para evitar que se ejecute el resto del codigo
}

// Si no se esta eliminando, entonces se esta insertando un nuevo registro
$numeroCuenta = $_POST['numeroCuenta'];
$nombreCompleto = $_POST['nombreCompleto'];
$email = $_POST['email'];
$carrera = $_POST['carrera'];

$fechaRegistro = date('Y-m-d');
$urlExitoso = "https://fesarweb2.000webhostapp.com/registroExitoso.html";
$urlError = "https://fesarweb2.000webhostapp.com/error.html";

try {
    $dbh = new PDO("mysql:host=$host;dbname=$bd", $user, $contra);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
    $stmt = $dbh->prepare("INSERT INTO alumnos (numeroCuenta, nombreCompleto, email, carrera, fechaRegistro) VALUES (
                            :numeroCuenta, :nombreCompleto, :email, :carrera, :fechaRegistro)");
    $stmt->bindParam(':numeroCuenta', $numeroCuenta);
    $stmt->bindParam(':nombreCompleto', $nombreCompleto);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':carrera', $carrera);
    $stmt->bindParam(':fechaRegistro', $fechaRegistro);
    $stmt->execute();
  
    $dbh = null;
  
    header("Location: $urlExitoso");
    exit(); // Salir para evitar que se ejecute el resto del codigo
} catch (PDOException $e) {
    header("Location: $urlError");
    exit(); // Salir para evitar que se ejecute el resto del codigo
}

?>

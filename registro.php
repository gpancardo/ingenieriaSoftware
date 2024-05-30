<?php
$numeroCuenta = $_POST['numeroCuenta'];
$nombreCompleto = $_POST['nombreCompleto'];
$email = $_POST['email'];
$carrera = $_POST['carrera'];

$host = '';
$bd = '';
$username = '';
$password = '';

$fechaRegistro = date('Y-m-d');
$url="https://fesarweb2.000webhostapp.com/registroExitoso.html";
$urlError="https://fesarweb2.000webhostapp.com/error.html";

try {
  $dbh = new PDO("mysql:host=$host;dbname=$bd", $username, $password);
  $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
  $stmt = $dbh->prepare("INSERT INTO alumnos (numeroCuenta, nombreCompleto, email, carrera, fechaRegistro) VALUES (:numeroCuenta, :nombreCompleto, :email, :carrera, :fechaRegistro)");
  $stmt->bindParam(':numeroCuenta', $numeroCuenta);
  $stmt->bindParam(':nombreCompleto', $nombreCompleto);
  $stmt->bindParam(':email', $email);
  $stmt->bindParam(':carrera', $carrera);
  $stmt->bindParam(':fechaRegistro', $fechaRegistro);
  $stmt->execute();
  
  $dbh = null;
  
  header("Location: " . $url);
} catch (PDOException $e) {
  header("Location: " . $urlError);
}
?>

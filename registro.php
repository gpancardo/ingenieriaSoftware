<?php

    include_once 'credenciales.php';

// Función para conectar a la base de datos
function conectarBaseDatos($host, $bd, $username, $password) {
    try {
        $dbh = new PDO("mysql:host=$host;dbname=$bd", $username, $password);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbh;
    } catch (PDOException $e) {
        redirigir('error.html');
    }
}

// Función para redirigir a una URL. Entrada URL y función vacía
function redirigir($url) {
    header("Location: " . $url);
    exit();
}

// Función para registrar usuario. Los parametros son conexion a la base y datos del usuario. Función vacía (sin salidas)
function registrarUsuario($dbh, $numUsuario, $nombre, $licencia, $area) {
    $fechaRegistro = date('Y-m-d');
    $stmt = $dbh->prepare("INSERT INTO usuarios (numUsuario, nombre, licencia, area, fechaRegistro) VALUES (:numUsuario, :nombre, :licencia, :area, :fechaRegistro)");
    $stmt->bindParam(':numUsuario', $numUsuario);
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':licencia', $licencia);
    $stmt->bindParam(':area', $area);
    $stmt->bindParam(':fechaRegistro', $fechaRegistro);
    $stmt->execute();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $numUsuario = $_POST['numUsuario'];
    $nombre = $_POST['nombre'];
    $licencia = $_POST['licencia'];
    $area = $_POST['area'];


    $dbh = conectarBaseDatos($host, $bd, $username, $password);

    if ($dbh) {
        registrarUsuario($dbh, $numUsuario, $nombre, $licencia, $area);
        redirigir('registroExitoso.html');
    } else {
        redirigir('error.html');
    }
}
?>

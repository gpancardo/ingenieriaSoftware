<?php

include_once "credenciales.php";


// Función para conectar a la base de datos
function conectarBaseDatos($host, $user, $contra, $bd) {
    $conexion = new mysqli($host, $user, $contra, $bd);

    if ($conexion->connect_error) {
        redirigir('error.html');
    }

    return $conexion;
}

// Función para redirigir a una URL específica. Entrada URL. Sin salidas
function redirigir($url) {
    header("Location: " . $url);
    exit();
}

// Función para eliminar ticket. Entradas ticket y conexión. Sin salidas.
function eliminarTicket($conexion, $ticket) {
    $consulta = $conexion->prepare("DELETE FROM tickets WHERE ticket = ?");
    $consulta->bind_param("s", $ticket);
    $consulta->execute();
    $consulta->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ticket = $_POST['ticket'];

    incluirCredenciales();

    $conexion = conectarBaseDatos($host, $user, $contra, $bd);

    eliminarTicket($conexion, $ticket);

    redirigir('listar.php');

    $conexion->close();
}

?>

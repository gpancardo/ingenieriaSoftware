<?php
include_once 'credenciales.php';

//Inicia una conexión a partir de las credenciales y regresa una conexión
function getConexion($server, $usuario, $contra, $bd) {
    $conn = new mysqli($server, $usuario, $contra, $bd);
    if ($conn->connect_error) {
        die("Fallo: " . $conn->connect_error);
    }
    return $conn;
}

//Inicia sesión si las credenciales proporcionadas por el usuario son correctas
function autenticacion($conn, $numUsuario, $licencia) {
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE numUsuario = ? AND licencia = ?");
    $stmt->bind_param("ss", $numUsuario, $licencia);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $stmt->close();
    return $resultado;
}

//Con el estado de resultado redirige a una URL de error o una de éxito
function redireccion($resultado, $correcta, $errorUrl) {
    if ($resultado->num_rows == 1) {
        header("Location: " . $correcta);
    } else {
        header("Location: " . $errorUrl);
    }
    exit();
}

$numUsuario = $_POST['numUsuario'];
$licencia = $_POST['licencia'];
$url = "listar.php";
$urlError = "error.html";

$conn = getConexion($server, $usuario, $contra, $bd);
$resultado = autenticacion($conn, $numUsuario, $licencia);
redireccion($resultadoado, $url, $urlError);

$conn->close();
?>


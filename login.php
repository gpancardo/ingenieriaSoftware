<?php
$server = "localhost";
$usuario = "";
$contra = "";
$bd = "";

$conn = new mysqli($server, $usuario, $contra, $bd);

if ($conn->connect_error) {
    die("Fallo: " . $conn->connect_error);
}

$email = $_POST['email'];
$numeroCuenta = $_POST['numeroCuenta'];

$url = "https://fesarweb2.000webhostapp.com/listar.php";
$urlError = "https://fesarweb2.000webhostapp.com/error.html";

$stmt = $conn->prepare("SELECT * FROM alumnos WHERE email = ? AND numeroCuenta = ?");
$stmt->bind_param("ss", $email, $numeroCuenta);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 1) {
    header("Location: " . $url);
} else {
    header("Location: " . $urlError);
}

$stmt->close();
$conn->close();
?>

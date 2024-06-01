<!DOCTYPE html>
<html>
<head>
    <title>Lista de Alumnos</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
    </style>
        <link rel="icon" type="image/x-icon" href="https://yt3.ggpht.com/a/AGF-l7_KZ5Hw_JMujdmt1Uga3RuuIFsWxN-uLjv7zA=s900-c-k-c0xffffffff-no-rj-mo">
        <!--Import Google Icon Font-->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <!--Import materialize.css-->
        <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>

        <!--Let browser know website is optimized for mobile-->
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>
    <nav>
        <div class="nav-wrapper blue darken-4">
            <a href="index.html" class="brand-logo">PowerTicket</a>
        </div>
    </nav>
    <?php
include_once 'credenciales.php';

//Toma como parametros las credenciales de la base de datos y regresa la conexión concretada
function getConexion($server, $usuario, $contra, $bd) {
    return new mysqli($server, $usuario, $contra, $bd);
}

//Hace una query a la base de datos que llama a todas las entradas de tickets
function consutarTickets($conn) {
    $sql = "SELECT * FROM tickets";
    return $conn->query($sql);
}

//Función vacía que muestra formulario
function formulario() {
    echo '
    <form class="col s8 offset-s2" action="eliminar.php" method="post">
        <div class="form-field col s12">
            <label for="ticket">Ticket</label>
            <input placeholder="Ticket" name="ticket" type="text" class="validate" required>
        </div>
        <button type="submit" class="offset-s3 waves-effect waves-light btn amber darken-1 col s6">Eliminar ticket</button>
    </form>';
}

//Función vacía que muestra cabecera de tabla
function cabeceraTabla() {
    echo "<table>";
    echo "<tr><th>Ticket</th><th>Titulo</th><th>Contenido</th><th>Fecha de inicio</th><th>Estado</th></tr>";
}

//Función vacía que muestra fila de tabla
function filaTabla($row) {
    echo "<tr>";
    echo "<td>" . $row['ticket'] . "</td>";
    echo "<td>" . $row['titulo'] . "</td>";
    echo "<td>" . $row['contenido'] . "</td>";
    echo "<td>" . $row['fechaRegistro'] . "</td>";
    echo "<td>" . $row['estado'] . "</td>";
    echo "</tr>";
}

//A partir del resultado de la query se muestran los tickets en filas
function mostrarTickets($result) {
    cabeceraTabla();
    while ($row = $result->fetch_assoc()) {
        filaTabla($row);
    }
    echo "</table>";
}

$conn = getConexion($server, $usuario, $contra, $bd);
$result = consultarTickets($conn);

if ($result->num_rows > 0) {
    formulario();
    mostrarTickets($result);
} else {
    echo "No hay tickets aún.";
}

$conn->close();
?>

    <script type="text/javascript" src="js/materialize.min.js"></script>
</body>
</html>
<!DOCTYPE html>
<html>

<head>
    <title> Resultados Laboratorio Sonia Garcia de Leon Rodriguez</title>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css" type="text/CSS">
</head>
<body>
    <p>Registro completado con éxito</p>
    <form action="" method="POST">
        <button class="button_consulta" name="submit" type="submit" id="consulta"> Consulta </button>
    </form>
    <button class="button_consulta" type="submit" id="volver" onclick="volver();"> Volver </button>
    <script>
        function volver() {
            window.location.href = './index.html';
        }
    </script>
</body>
</html>

<?php

if(isset($_POST['submit'])){
    
    $servername= "localhost";
    $username = "root";
    $password = "";
    $dbname = "laboratoriofinal";
    //Create connection

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection

    if ($conn -> connect_error) {
        die("Connection failed: ". $conn -> connect_error);
    }

    $sql = "SELECT nombre, primer_apellido, segundo_apellido, login_usuario FROM usuario";

    $resultado = mysqli_query($conn, $sql);

    if (!$resultado){
        echo "Error: " . $sql . "<br>" . $conn ->error;
    } else {
        echo '<div class="container_tabla">';
        echo    '<table class="table table-striped">';
        echo        '<thead>';
        echo            '<tr>';
        echo                '<th scope="col">Nombre</th>';
        echo                '<th scope="col">Primer apellido</th>';
        echo                '<th scope="col">Segundo apellido</th>';
        echo                '<th scope="col">Login</th>';
        echo            '</tr>';
        echo        '</thead>';
        echo        '<tbody>';
        
        while($colum = mysqli_fetch_array($resultado)) {
            echo '<tr>';
            echo    '<td>'.$colum['nombre'].'</td>';
            echo    '<td>'.$colum['primer_apellido'].'</td>';
            echo    '<td>'.$colum['segundo_apellido'].'</td>';
            echo    '<td>'.$colum['login_usuario'].'</td>';
            echo '</tr>';
        }

        echo '</tbody>';
        echo '</table>';
        echo '</div>';
    }
    $conn -> close();
}
?>
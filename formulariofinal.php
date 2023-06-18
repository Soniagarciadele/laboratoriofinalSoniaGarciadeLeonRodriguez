<?php


$nombre = $_POST ['nombre'] ??'';
$primerApellido = $_POST ['primer_apellido'] ?? '';
$segundoApellido = $_POST ['segundo_apellido'] ?? '';
$email = $_POST ['email'] ?? '';
$loginUsuario = $_POST ['login_usuario'] ?? '';
$clave = $_POST ['clave']?? '';

$respuesta = validate_request($nombre, $primerApellido, $segundoApellido, $email, $loginUsuario, $clave);

if($respuesta['status'] == 'ok') {
    //Conexión con PDO

    $servername= "localhost";
    $username = "root";
    $password = "";
    $dbname = "laboratoriofinal";

    try {
        //Create connection

        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection

        if ($conn -> connect_error) {
            throw new mysqli_sql_exception('Error al conectar con la base de datos');
        }

        $sql = "INSERT INTO usuario (nombre, primer_apellido, segundo_apellido, email, login_usuario, clave)
        VALUES ('$nombre', '$primerApellido', '$segundoApellido', '$email', '$loginUsuario', '$clave')";

        if (!mysqli_query($conn, $sql)){
            $respuesta['status'] = 'ko';
            $respuesta += ['messageError'=> "Error: " . $sql . " " . $conn ->error];
            $respuesta += ['userMessageError' => 'El mail o el usuario ya estan registrados'];
        }
        $conn -> close();
    } catch (mysqli_sql_exception $e) {
        $respuesta['status'] = 'ko';
        $respuesta += ['exceptionMessage' => $e->getMessage()];
        $respuesta += ['userMessageError' => $e->getMessage()];
    }

}

echo json_encode($respuesta);


function validate_request($nombre, $primerApellido, $segundoApellido, $email, $loginUsuario, $clave){
    $respuesta = ['status' => 'ok'];
    $matches = null;
    if($nombre == NULL or $nombre == '' or strlen($nombre)>25 or preg_match('/^[a-zA-ZÀ-ÿ\s]+$/', $nombre, $matches) == 0){
        $respuesta += ['nombre' => 'error'];
        $respuesta['status'] = 'ko';
    }
    if($primerApellido == NULL or $primerApellido == '' or strlen($primerApellido)>25 or preg_match('/^[a-zA-ZÀ-ÿ\s]+$/', $primerApellido, $matches) == 0){
         $respuesta += ['primer_apellido' => 'error'];
         $respuesta['status'] = 'ko';
    }
    if($segundoApellido == NULL or $segundoApellido == '' or strlen($segundoApellido)>25 or preg_match('/^[a-zA-ZÀ-ÿ\s]+$/', $segundoApellido, $matches) == 0){
          $respuesta += ['segundo_apellido' => 'error'];
          $respuesta['status'] = 'ko';
    }
    if($email == NULL or $email  == '' or strlen($primerApellido)>50 or preg_match('/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/', $email, $matches) == 0){
        $respuesta += ['email' => 'error'];
        $respuesta['status'] = 'ko';
    }
    if($loginUsuario == NULL or $loginUsuario == '' or strlen($loginUsuario)>25 or preg_match('/^\w+([.-_+]?\w+)+$/', $loginUsuario, $matches) == 0){
        $respuesta += ['login_usuario' => 'error'];
        $respuesta['status'] = 'ko';
    }
    if($clave == NULL or $clave == '' or preg_match('/^.{4,8}$/', $clave, $matches) == 0){
        $respuesta += ['clave' => 'error'];
        $respuesta['status'] = 'ko';
    }

    return $respuesta;
}

?>
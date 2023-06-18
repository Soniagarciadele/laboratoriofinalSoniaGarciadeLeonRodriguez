let formulario = document.getElementById("formulario");
let inputs = document.querySelectorAll("#formulario div");
const imgSuccess = "images/success-icon.svg";
const imgError = "images/error-icon.svg";
const campoVacio = "Rellene este campo";
var claveActual = "";

class Validaciones {
    constructor(nombreOk, emailOk, primerApellidoOk, segundoApellidoOk, loginUsuarioOk, claveOk, confirmarClaveOk) {
        this.nombreOk = nombreOk;
        this.primerApellidoOk = primerApellidoOk;
        this.segundoApellidoOk = segundoApellidoOk;
        this.emailOk = emailOk;
        this.loginUsuarioOk = loginUsuarioOk;
        this.claveOk = claveOk;
        this.confirmarClaveOk = confirmarClaveOk;
    }

    setValidate(validate, containerType) {
        if(containerType === "nombre") {
            this.nombreOk = validate;
        } else if(containerType === "primer_apellido") {
            this.primerApellidoOk = validate;
        } else if(containerType === "segundo_apellido") {
            this.segundoApellidoOk = validate;
        } else if(containerType === "email") {
            this.emailOk = validate;
        } else if(containerType === "login_usuario") {
            this.loginUsuarioOk = validate;
        } else if(containerType === "clave") {
            this.claveOk = validate;
        } else if(containerType === "confirmeclave") {
            this.confirmarClaveOk = validate;
        }
    }

    validateOK() {
        return this.nombreOk && this.primerApellidoOk && this.segundoApellidoOk && this.loginUsuarioOk && this.emailOk && this.claveOk && this.confirmarClaveOk;
    }
}

var validaciones = new Validaciones(false, false, false, false, false, false, false);

const expresiones = {
    nombre: /^[a-zA-ZÀ-ÿ\s].{0,25}$/,
    primer_apellido: /^[a-zA-ZÀ-ÿ\s].{0,25}$/,
    segundo_apellido: /^[a-zA-ZÀ-ÿ\s].{0,25}$/,
    email: /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})$/ ,
    login_usuario:/^[0-9a-zA-AÀ-ÿ\s.-_+].{0,25}$/,
    clave: /^.{4,8}$/
}

const anotaciones = {
    nombre: "Nombre inválido, max. 25 letras",
    primer_apellido: "Apellido inválido, max. 25 letras",
    segundo_apellido: "Apellido inválido, max. 25 letras",
    email: "Email inválido, debe ser formato email",
    login_usuario: "Nombre de usuario de max. 25 caracteres",
    clave: "Debe tener entre 4 y 8 caracteres",
    confirmeclave: "Las contraseñas no coinciden"
}

formulario.addEventListener("submit", (event) => {
    enviar();
    event.preventDefault();
});

inputs.forEach((input) => {
    var imagen = input.querySelector(".image");
    var inputText = input.querySelector(".input_text");
    inputText.addEventListener("blur", (event) => {
        validar(event.target, imagen, input);
    });
})

function validar(inputText, imagen, inputContainer) {
    switch(inputText.name) {
        case "nombre":
            validarTexto(inputText, expresiones.nombre, imagen, inputContainer);
        break;
        case "primer_apellido":
            validarTexto(inputText, expresiones.primer_apellido, imagen, inputContainer);
        break;
        case "segundo_apellido":
            validarTexto(inputText, expresiones.segundo_apellido, imagen, inputContainer);
        break;
        case "email":
            validarTexto(inputText, expresiones.email, imagen, inputContainer);
        break;
        case "login_usuario":
            validarTexto(inputText, expresiones.login_usuario, imagen, inputContainer);
        break;
        case "clave":
            validarTexto(inputText, expresiones.clave, imagen, inputContainer);
            claveActual = inputText.value;
            var confirmClaveContainer = document.getElementById("confirmarclave");
            var inputTextCofirmClave = confirmClaveContainer.querySelector(".input_text");
            var imagenConfirmClave = confirmClaveContainer.querySelector(".image");
            validateConfirmarClave(inputTextCofirmClave, imagenConfirmClave, confirmClaveContainer);
        break;
        case "confirmeclave":
            validateConfirmarClave(inputText, imagen, inputContainer);
        break;
    }
}

function validarTexto(inputText, expresion, imagen, inputContainer) {
    if(expresion.test(inputText.value)) {
        validaciones.setValidate(true, inputText.name);
        mostrarValidacionSuccess(imagen, inputContainer);
    } else {
        validaciones.setValidate(false, inputText.name);
        mostrarValidacionError(imagen, inputContainer);
    }
}

function validateConfirmarClave(inputText, imagen, inputContainer) {
    if(claveActual === inputText.value) {
        validaciones.setValidate(true, inputText.name);
        mostrarValidacionSuccess(imagen, inputContainer)
    } else {
        validaciones.setValidate(false, inputText.name);
        mostrarValidacionError(imagen, inputContainer);
    }
}

function mostrarValidacionSuccess(imagen, inputContainer) {
    imagen.src = imgSuccess;
    inputContainer.classList.add("input__container-success");
    inputContainer.classList.remove("input__container-error");
    inputContainer.querySelector(".input_anotation").textContent = "";
}

function mostrarValidacionError(imagen, inputContainer) {
    imagen.src = imgError;
    inputContainer.classList.add("input__container-error");
    inputContainer.classList.remove("input__container-success");
    var inputText = inputContainer.querySelector(".input_text");
    if(inputText.value === "") {
        inputContainer.querySelector(".input_anotation").textContent = campoVacio;
    }
    inputContainer.querySelector(".input_anotation").textContent = anotaciones[inputText.name];
}

async function enviar() {
    if(validaciones.validateOK()) {
        //alert("La inscripción ha sido correcta");
        let datos = new FormData(formulario);
        let peticion = {
            method: "POST",
            body:datos
        }
        let response = await fetch("formulariofinal.php", peticion);
        let jsonResponse = await response.json();
        if(jsonResponse.status === 'ok') {
            window.location.href = "./resultados.php";
        } else {
            let error = '';
            if(jsonResponse.messageError) {
                error = jsonResponse.messageError;
            } else if (jsonResponse.exceptionError) {
                error = jsonResponse.exceptionError;
            } else {
                inputs.forEach((input) => {
                    var imagen = input.querySelector(".image");
                    var inputText = input.querySelector(".input_text");
                    if(inputText.name === 'nombre' && jsonResponse.nombre && jsonResponse.nombre === 'error') {
                        mostrarValidacionError(imagen, input);
                    } 
                    if(inputText.name === 'primer_apellido' && jsonResponse.primer_apellido && jsonResponse.primer_apellido === 'error') {
                        mostrarValidacionError(imagen, input);
                    }
                    if(inputText.name === 'segundo_apellido' && jsonResponse.segundo_apellido && jsonResponse.segundo_apellido === 'error') {
                        mostrarValidacionError(imagen, input);
                    }
                    if(inputText.name === 'email' && jsonResponse.email && jsonResponse.email === 'error') {
                        mostrarValidacionError(imagen, input);
                    }
                    if(inputText.name === 'login_usuario' && jsonResponse.login_usuario && jsonResponse.login_usuario === 'error') {
                        mostrarValidacionError(imagen, input);
                    }
                    if(inputText.name === 'clave' && jsonResponse.clave && jsonResponse.clave === 'error') {
                        mostrarValidacionError(imagen, input);
                    }
                })
            }

            if(error !== '') {
                var alert = document.getElementById("alert");
                alert.style.display = "block";
                alert.querySelector(".contentAlert").textContent = jsonResponse.userMessageError;
            }
        }

        
        
    } else {
        inputs.forEach((input) => {
            var imagen = input.querySelector(".image");
            if(input.querySelector(".input_text").value === "") {
                imagen.src = imgError;
                input.classList.add("input__container-error");
                input.classList.remove("input__container-success");
                input.querySelector(".input_anotation").textContent = campoVacio;
            }
        })
    }
}

function removeAlert() {
    var alert = document.getElementById("alert");
    alert.style.display = "none";
}
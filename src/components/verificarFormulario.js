export function verificarFormulario(nombre= true, correo = true, password = true, avatar = true) {


  if (
    nombre !== true &&
    nombre.length <= 1)
   {
    alert('Por favor, introduce tu nombre');
    return false; 
  }


  if (
    correo !== true &&
    (correo.length < 4 || !correo.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
  ) {
    alert('Por favor, introduce un correo electrónico válido');
    return false; 
  }

  
  if (password !== true && password.length < 8) {
    alert('La contraseña debe tener al menos 8 caracteres');
    return false;
  }
  
 
  if (arguments.length >= 4) { 
   
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'jfif'];
      const fileExtension = avatar?.name?.split('.').pop().toLowerCase() || '';
      if (!allowedExtensions.includes(fileExtension)) {
        alert(
          'Por favor, selecciona un archivo de imagen con formato válido: jpg, jpeg, png, gif, webp, avif, jfif.'
        );
        return false;
      }
    
  }

  return true;
}


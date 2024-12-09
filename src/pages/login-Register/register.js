import { peticionFetch } from '../../components/fetch/fetch'
import { Header } from '../../components/header/header'
import { loginSubmit } from './login'
import { verificarFormulario } from '../../components/verificarFormulario'
import './register.css'
import { button } from '../../components/buttons/button'


const template = () => `
  <section id="register">
    <form>
      <input type="text" placeholder="Nombre" id="nombre" required />
      
      <input 
        type="email" 
        id="correo" 
        name="email" 
        title="Por favor, introduce un correo electrónico válido"
        placeholder="Correo electrónico"
        required
      />

      <input 
        type="password" 
        id="password" 
        placeholder="Password"   
        title="La contraseña debe tener al menos 8 caracteres"
        minlength="8" 
    required 
      />

      <input 
        type="file" 
        id="avatar" 
        placeholder="Avatar" 
        title="'jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'jfif'"
        required
      />
      ${button("Crear Cuenta","" ,"registerbtn")}
    </form>
  </section>
`


const registerSubmit = async () => {
 
  const nombre = document.querySelector('#nombre').value
  const correo = document.querySelector('#correo').value
  const password = document.querySelector('#password').value
  const avatar = document.querySelector('#avatar').files[0] || ''

  if (verificarFormulario(nombre, correo, password, avatar) === false) {
    return
  }

  const formData = new FormData()
  formData.append('nombre', nombre)
  formData.append('correo', correo)
  formData.append('password', password)
  formData.append('avatar', avatar)
  

  try {
    const data = await peticionFetch(
      '/api/v1/usuarios/registro',
      'POST',
      formData
    )
    if (data.status === 201) {
      alert(`Te has resgistrado`)
      await loginSubmit(correo, password)
    }
  } catch (error) {
    let estadoPeticion = document.querySelector('.estado-peticion')
    estadoPeticion.textContent = 'Ese correo ya existe'
  }
}


const Register = () => {
 
  document.querySelector('main').innerHTML = template()

  
  document.querySelector('#registerbtn').addEventListener('click', (ev) => {
    ev.preventDefault()
    registerSubmit()
    Header()
  })
}


export default Register

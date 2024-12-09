import { peticionFetch } from '../../components/fetch/fetch'
import Eventos from '../eventos/eventos'
import { Header } from '../../components/header/header'
import Register from './register'
import './login.css'
import { button } from '../../components/buttons/button'
const template = () => `
<section id="login">
        <form>
          <input type="text" placeholder="Correo" id="correo"/>
          <input type="password" id="password" placeholder="Password" />
          ${button('Iniciar sesión.', '', 'loginbtn')}
        </form>
    <p>¿No tienes cuenta? Registrate</p>
    ${button('Crear Cuenta.', '', 'registerbtn')}
  </section>
`

const loginSubmit = async (correo, password) => {
  const body = {
    correo: correo,
    password: password
  }

  const data = await peticionFetch(
    '/api/v1/usuarios/login',
    'POST',
    body
  )

  const dataRes = await data.json()
 
  const dataToken = {
    token: dataRes.token,
    id: dataRes.id
  }

  localStorage.setItem('token', JSON.stringify(dataToken))
  localStorage.setItem('eventos', JSON.stringify(dataRes.eventos))
  localStorage.setItem('nombre', JSON.stringify(dataRes.nombre))
  localStorage.setItem('correo', JSON.stringify(correo))
  alert(`Welcome ${correo}`)
  Eventos()
  Header()
}


const Login = () => {
 
  document.querySelector('main').innerHTML = template()

  
  document.querySelector('#loginbtn').addEventListener('click', (ev) => {
    ev.preventDefault()
    const correo = document.querySelector('#correo').value
    const password = document.querySelector('#password').value
    loginSubmit(correo, password) 
  })
  document.querySelector('#registerbtn').addEventListener('click', (ev) => {
    ev.preventDefault()
    Register()
  })
}

export { Login, loginSubmit }

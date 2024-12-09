import { button } from '../../components/buttons/button'
import { peticionFetch } from '../../components/fetch/fetch'
import {
  mostrarEventos,
  ordenarEventos
} from '../../components/mostrarEventos/mostrarEventos'
import { verificarFormulario } from '../../components/verificarFormulario'
import './usuarios.css'
const template = () => `
  <section id="mi_usuario">
   
    <ul id="usuariocontainer">
    </ul>
    ${button('Modificar Usuario', '', 'modificar-usuario')}
    <h3>Tus proximos eventos son:</h3>
  <div id="eventos-container"></div>
  </section>
`

const miUsuario = async () => {
  const userData = localStorage.getItem('token')

  const { id, token } = JSON.parse(userData)


  const usuarioData = await peticionFetch(
    `/api/v1/usuarios/${id}`,
    'GET',
    '',
    token
  )
  const usuario = await usuarioData.json()
  mostrarUsuario(usuario)

  const botonesModificar = document.querySelectorAll('.modificar')

  botonesModificar.forEach((boton) => {
    boton.style.display = 'none'
  })
  const botonModificarUsuario = document.querySelector('#modificar-usuario')
  botonModificarUsuario.addEventListener('click', () => {
    const botonModificarUsuario = document.querySelector('#modificar-usuario')
    const botonesModificar = document.querySelectorAll('.modificar')
   
    if (botonModificarUsuario.textContent.trim() === 'Modificar Usuario') {
     
      botonModificarUsuario.textContent = 'Cancelar Modificacion'
      botonesModificar.forEach((boton) => {
        boton.style.display = 'block'
      })
    } else {
      const botonesModificar = document.querySelectorAll('.modificar')

      botonModificarUsuario.textContent = 'Modificar Usuario'
      botonesModificar.forEach((boton) => {
        boton.style.display = 'none'
      })

      mostrarUsuario(usuario)
    }
  })
  const eventos = usuario.eventos
  ordenarEventos(eventos)
  mostrarEventos(eventos)
}

const mostrarUsuario = async (usuario) => {
  const usuariocontainer = document.querySelector('#usuariocontainer')
  usuariocontainer.innerHTML = `
  <li>
    <div id="avatar">
      <img src=${usuario.avatar} alt=${usuario.nombre}>
      ${button('Modificar avatar', 'modificar', 'modificar-avatar')}
    </div>
  </li>
  <li>
    <div id="nombre">
      <h3>${usuario.nombre}</h3>
      ${button('Modificar nombre', 'modificar', 'modificar-nombre')}
    </div>
  </li>
  <li>
    <div id="correo">
      <h3>${usuario.correo}</h3>
      ${button('Modificar correo', 'modificar', 'modificar-correo')}
    </div>
  </li>
  <li>
    <div id="password">
      ${button('Modificar contraseña', 'modificar', 'modificar-password')}
    </div>
  </li>
  `
  const botonesModificar = document.querySelectorAll('.modificar')
  botonesModificar.forEach((boton) => {
    boton.style.display = 'none'
  })
  await modificarAtributos('nombre')
  await modificarAtributos('correo')
  await modificarAtributos('password', 'password')
  await modificarAtributos('avatar', 'file')
}

const modificarAtributos = async (atributo, tipo = 'text') => {
  const boton = document.querySelector(`#modificar-${atributo}`)
  boton.addEventListener('click', () => {
    const contenedor = document.querySelector(`#${atributo}`)
    contenedor.innerHTML = `
      <input type="${tipo}" class="input-modificar" id="new-${atributo}" placeholder="Nuevo ${atributo}" />
       ${button('Cambiar', '', `confirmar-${atributo}`)}
      `

    const botonConfirmar = document.querySelector(`#confirmar-${atributo}`)
    botonConfirmar.addEventListener('click', async () => {
      const { id, token } = JSON.parse(localStorage.getItem('token'))
      let newAtributo
      let body
      if (atributo === 'avatar') {
        newAtributo = document.querySelector(`#new-${atributo}`).files[0]
       
        if (verificarFormulario(undefined, undefined,undefined, newAtributo) === false) {
        
          return
        }
        body = new FormData()
        body.append('avatar', newAtributo)
      
      } else {
        newAtributo = document.querySelector(`#new-${atributo}`).value

        if (atributo === "nombre") {
          if (verificarFormulario(newAtributo) === false) {
            return
          }
        }

        if (atributo === 'correo') {
          if (verificarFormulario(undefined,newAtributo) === false) {
           
            return
          }
        }
        if (atributo === "password") {
          if (verificarFormulario(undefined,undefined, newAtributo) === false) {
            return
          }
        }

        body = {
          [atributo]: newAtributo
        }
      }
      try {
        await peticionFetch(
          `/api/v1/usuarios/${id}`,
          'PUT',
          body,
          token
        )
        Usuario()
      } catch (error) {
        let estadoPeticion = document.querySelector('.estado-peticion')
        estadoPeticion.textContent= "Ese correo ya existe"
      }
    })
  })
}

export const Usuario = async () => {
  document.querySelector('main').innerHTML = template()
  await miUsuario()
}

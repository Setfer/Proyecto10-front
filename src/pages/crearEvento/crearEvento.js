import { button } from '../../components/buttons/button'
import { peticionFetch } from '../../components/fetch/fetch'
import { mostrarEventos } from '../../components/mostrarEventos/mostrarEventos'
import { verificarFormulario } from '../../components/verificarFormulario'
import './crearEvento.css'
const template = () => `
<section id="add-evento">
  
         <h2>Introduce los datos del evento</h2>
         <form>
          <input type="text" placeholder="titulo del evento" id="titulo"/>
          <textarea id="descripcion" placeholder="Descripcion del evento"></textarea>
          <input type="datetime-local" id="fecha" placeholder="fecha del evento" />
           <input type="file" id="cartel" />
          ${button("Crear evento","", "submit-evento")}
        </form>
  </section>`

const postEvento = async () => {
  const titulo = document.querySelector('#titulo').value
  const descripcion = document.querySelector('#descripcion').value

  const fechaLocal = document.querySelector('#fecha').value
  let fechaISO = ''
  if (fechaLocal) {
    const fecha = new Date(fechaLocal);
    const fechaActual = new Date();
    if (fecha < fechaActual) {
      alert('La fecha del evento no puede ser anterior a la fecha actual.');
      return; 
    }
    fechaISO = fecha.toISOString();
  }

  const cartel = document.querySelector('#cartel').files[0]
  if (verificarFormulario(undefined, undefined, undefined, cartel) === false) {
    return
  }

  const { token } = JSON.parse(localStorage.getItem('token'))

  const formData = new FormData()
  formData.append('evento', titulo)
  formData.append('descripcion', descripcion)
  formData.append('fecha', fechaISO)
  formData.append('cartel', cartel)

  try {
    const post = await peticionFetch(
      '/api/v1/eventos',
      'POST',
      formData,
      token
    )
    const postJson = await post.json()
    const secction = document.querySelector('#add-evento')
    secction.innerHTML =
      '<h2>Has creado el evento :</h2><div id=lista-eventos></div>'
    mostrarEventos(postJson)
  } catch (error) {
    if (error.message === 'El elemento ya existe (409).') {
      let estadoPeticion = document.querySelector('.estado-peticion');
      estadoPeticion.textContent = "Ese evento ya existe";
    }
  }
}

const CrearEvento = () => {
  document.querySelector('main').innerHTML = template()

  document.querySelector('#submit-evento').addEventListener('click', (ev) => {
    ev.preventDefault()
    postEvento()
  })
}

export default CrearEvento

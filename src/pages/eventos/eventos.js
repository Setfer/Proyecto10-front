import { peticionFetch } from '../../components/fetch/fetch'
import './eventos.css'
import {
  mostrarEventos,
  ordenarEventos
} from '../../components/mostrarEventos/mostrarEventos'


const template = () => `
  <section id="eventos">
   <h2>Estos son los proximos eventos :</h2>
    <div id="eventos-container">
    </div>
  </section>
`



export const getEventos = async () => {
  const data = await peticionFetch('http://localhost:3000/api/v1/eventos')
  const dataRes = await data.json()

  ordenarEventos(dataRes)
  mostrarEventos(dataRes)
}

const Eventos = () => {
  document.querySelector('main').innerHTML = template()
  getEventos()
}

export default Eventos

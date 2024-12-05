import { peticionFetch } from '../fetch/fetch'
import { cambiarFormatoFecha } from '../modfificarFecha'
import './mostrarEventos.css'

export const ordenarEventos = (eventos) => {
  const eventosContainer = document.querySelector('#eventos-container')
  eventosContainer.innerHTML = `
    <div id="ordenar-eventos">
  <label for="ordenar">Ordenar por:</label>
  <select id="ordenar"  >
  <option value="#">...</option>
  <option value="nombre">Nombre</option>
  <option value="fecha">Fecha mas recientes</option>
  <option value="asistentes">Numero de asistentes</option>
</select>
  </div>
  <ul id="lista-eventos"></ul>
  `

  document.querySelector('#ordenar').addEventListener('change', (e) => {
    const criterio = e.target.value
    let eventosOrdenados = [...eventos] 

    if (criterio === 'nombre') {
      eventosOrdenados.sort((a, b) => a.evento.localeCompare(b.evento))
    } else if (criterio === 'fecha') {
      eventosOrdenados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)) 
    } else if (criterio === 'asistentes') {
      eventosOrdenados.sort((a, b) => b.asistentes.length - a.asistentes.length)
    }

    mostrarEventos(eventosOrdenados) 
  })
}



export const mostrarEventos = async (eventos) => {
  const listaEventos = document.querySelector('#lista-eventos')
  listaEventos.innerHTML = ''
  if (Array.isArray(eventos)) {
    for (const evento of eventos) {
        const fecha = cambiarFormatoFecha(evento.fecha)
      const li = document.createElement('li')
      li.classList = 'evento-info'
      if (
        Array.isArray(evento.asistentes) &&
        evento.asistentes[0] &&
        evento.asistentes[0].nombre &&
        localStorage.getItem('token')
      ) {
        let asistentesHTML = evento.asistentes
        .map(
          (usuario) => `
            <div class="asistente">
              <img src="${usuario.avatar}" alt="${usuario.nombre}" class="asistente-avatar"/>
              <span>${usuario.nombre}</span>
            </div>
          `
        )
        .join('');


        li.innerHTML = `
        <img src="${evento.cartel}" alt="${evento.evento}" />
        <h3>${evento.evento}</h3>
        <h4>${fecha}</h4>
        <h5>${evento.descripcion}</h5>
        <div class="asistentes-container" id="asistentes-${evento._id}">
        <p>Asistentes : </p>
          ${asistentesHTML || '<p>No hay asistentes registrados.</p>'}
        </div>
      `;
        
      } else {
        li.innerHTML = 
          `<img src=${evento.cartel} alt=${evento.evento}/>
            <h3>${evento.evento}</h3>
            <h4>${fecha}</h4>
            <h5>${evento.descripcion}</h5>`
          
      }

      const eventossaved = JSON.parse(localStorage.getItem('eventos'))
      if (eventossaved && eventossaved.includes(evento._id)) {
        const btnNoAsistir = document.createElement('button')
        btnNoAsistir.className = 'no_asistir'
        btnNoAsistir.textContent = 'Cancelar asistencia'

        btnNoAsistir.addEventListener('click', async () => {
          await cancelarAsistencia(evento._id)

          mostrarEventos(eventos)
        })
        li.append(btnNoAsistir)
      } else if (eventossaved) {
        const btnAsistir = document.createElement('button')
        btnAsistir.className = 'asistir'
        btnAsistir.textContent = 'asistir'

        btnAsistir.addEventListener('click', async () => {
          await asistirEvento(evento._id)

          mostrarEventos(eventos)
        })
        li.append(btnAsistir)
      }
      listaEventos.appendChild(li)
      document.querySelector('#eventos-container').append(listaEventos)
    }
  } else {
    const eventosContainer = document.querySelector('#lista-eventos')
    const fecha = cambiarFormatoFecha(eventos.fecha)
    eventosContainer.innerHTML = 
          `<img src=${eventos.cartel} alt=${eventos.evento}/>
            <h3>${eventos.evento}</h3>
            <h4>${fecha}</h4>
            <h5>${eventos.descripcion}</h5>`
  }
}







const asistirEvento = async (idEvento) => {
  const { id, token } = JSON.parse(localStorage.getItem('token'))

  //agregamos evento al usuario
  const evento = {
    eventos: [idEvento]
  }
  const addEventosUserData = await peticionFetch(
    `http://localhost:3000/api/v1/usuarios/${id}`,
    'PUT',
    evento,
    token
  )

  //agregamos usuario al evento
  const usuario = {
    asistentes: [id]
  }
  const addUserEventoData = await peticionFetch(
    `http://localhost:3000/api/v1/eventos/${idEvento}`,
    'PUT',
    usuario,
    token
  )

  const eventos = JSON.parse(localStorage.getItem('eventos'))
  const newEventos = [...new Set([...eventos, idEvento])]
  localStorage.setItem('eventos', JSON.stringify(newEventos))
}

const cancelarAsistencia = async (idEvento) => {
  const { id, token } = JSON.parse(localStorage.getItem('token'))

  //eliminamos el evento del usuario
  const evento = {
    eventos: idEvento
  }
  const deleteEventoUserData = await peticionFetch(
    `http://localhost:3000/api/v1/usuarios/removeevento/${id}`,
    'PUT',
    evento,
    token
  )
  //elimianmos del usuario el evento
  const usuario = {
    asistentes: [id]
  }
  const deleteUserEventoData = await peticionFetch(
    `http://localhost:3000/api/v1/eventos/removeusuario/${idEvento}`,
    'PUT',
    usuario,
    token
  )
  const oldEventos = JSON.parse(localStorage.getItem('eventos'))
  const eventosActualizados = oldEventos.filter((evento) => evento !== idEvento)
  localStorage.setItem('eventos', JSON.stringify(eventosActualizados))
}

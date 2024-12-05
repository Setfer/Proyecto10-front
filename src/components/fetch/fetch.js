import './fetch.css'


export const peticionFetch = async (
  url,
  method = 'GET',
  body = '',
  token = ''
) => {
  const options = {
    method: method,
    headers: {}
  }

  let estadoPeticion = document.querySelector('.estado-peticion')

  if (estadoPeticion) {
    estadoPeticion.remove()
  }

 
  estadoPeticion = document.createElement('p')
  const main = document.querySelector('main')
  main.append(estadoPeticion)

  estadoPeticion.className = 'estado-peticion cargando'
  estadoPeticion.textContent = 'cargando...'
  if (body instanceof FormData) {
    options.body = body
  } else if (body) {
    options.body = JSON.stringify(body)
    options.headers['Content-Type'] = 'application/json'
  }
  
  if (token) {
    options.headers.Authorization = `Bearer ${token}`
  }
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
     
      switch (response.status) {
        case 400:
          throw new Error('Solicitud incorrecta. Todos los campos son obligatorios.')
        case 401:
          throw new Error('Usuario o contraseña incorrectos.')
        case 403:
          throw new Error('Acceso denegado (403). No tienes permisos.')
        case 404:
          throw new Error('Recurso no encontrado (404).')
        case 409:
          throw new Error('El elemento ya existe (409).')
        case 500:
          throw new Error('Error del servidor (500). Inténtalo más tarde.')
        default:
          throw new Error(`Error inesperado: ${response.status}`)
      }
    }

   
    estadoPeticion.className = 'estado-peticion realizada'
    estadoPeticion.textContent = 'Completado'
    return await response
  } catch (error) {

    estadoPeticion.className = 'estado-peticion error'
    estadoPeticion.textContent = error.message 

    throw error
  }
}

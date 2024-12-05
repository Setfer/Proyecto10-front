import CrearEvento from '../../pages/crearEvento/crearEvento';
import Eventos from '../../pages/eventos/eventos';
import { Login } from '../../pages/login-Register/login';
import { Usuario } from '../../pages/usuarios/usuarios';
import './header.css';

const routes = [
  { texto: 'Eventos', funcion: Eventos, path: '/eventos' },
  { texto: 'Mi usuario y eventos', funcion: Usuario, path: '/mi-usuario' },
  { texto: 'Crear Evento', funcion: CrearEvento, path: '/crear-evento' },
  { texto: 'Login', funcion: Login, path: '/login' },
];

export const Header = () => {
  const header = document.querySelector('header');
  header.innerHTML = '';


  const toggleButton = document.createElement('img');
  toggleButton.classList.add('menu-toggle');
  toggleButton.src = `https://img.icons8.com/?size=24&id=58RxaWPffZGK&format=png`;


  const nav = document.createElement('nav');

  for (const route of routes) {
    const enlace = document.createElement('a');

    if (route.texto === 'Login' && localStorage.getItem('token')) {
      enlace.textContent = 'Logout';
      enlace.addEventListener('click', () => {
        localStorage.clear();
        Header();
        Eventos();
        history.pushState({}, '', '/eventos');
      });
    } else {
      if (
        !localStorage.getItem('token') &&
        (route.texto === 'Mi usuario y eventos' || route.texto === 'Crear Evento')
      ) {

      } else {
        enlace.textContent = route.texto;
        enlace.addEventListener('click', () => {
          route.funcion();
          history.pushState({}, '', route.path);
        });
      }
    }
    nav.append(enlace);
  }

  
  toggleButton.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  
  header.append(toggleButton, nav);
};


window.addEventListener('popstate', () => {
  const currentPath = window.location.pathname;
  const currentRoute = routes.find((route) => route.path === currentPath);
  if (currentRoute && currentRoute.funcion) {
    currentRoute.funcion();
  }
});

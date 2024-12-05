
import { Footer } from './src/components/footer/footer';
import { Header } from './src/components/header/header';
import Eventos from './src/pages/eventos/eventos';
import './style.css'


const Main = () => {
  const app = document.querySelector("#app");

    app.innerHTML = `
      <header></header>
      <main></main>
      <footer></footer>
    `
}
Main()
Header()
Eventos()
Footer()



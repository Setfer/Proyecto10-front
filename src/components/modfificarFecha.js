export function cambiarFormatoFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = fecha.getUTCDate().toString().padStart(2, '0');
  const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0'); 
  const anio = fecha.getUTCFullYear(); // Año
  
  const horas = fecha.getUTCHours().toString().padStart(2, '0'); 
  const minutos = fecha.getUTCMinutes().toString().padStart(2, '0'); 

  return `${dia}/${mes}/${anio} ${horas}:${minutos}`; 
}

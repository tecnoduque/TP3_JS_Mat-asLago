// Datos de ejemplo
const datos = [
    'Manzana',
    'Banana',
    'Naranja',
    'Pera',
    'Mango',
    'Uva',
    'Piña',
    'Sandía',
    'Melón',
  ];
  
  // Obtener referencias a los elementos del DOM
  const inputBusqueda = document.getElementById('input-busqueda');
  const listaResultados = document.getElementById('lista-resultados');
  
  // Manejar el evento de entrada en el campo de búsqueda
  inputBusqueda.addEventListener('input', () => {
    const busqueda = inputBusqueda.value.toLowerCase();
    const resultadosFiltrados = datos.filter(dato => dato.toLowerCase().includes(busqueda));
    
    // Limpiar la lista de resultados
    listaResultados.innerHTML = '';
  
    // Mostrar los resultados coincidentes
    resultadosFiltrados.forEach(resultado => {
      const elementoResultado = document.createElement('li');
      elementoResultado.textContent = resultado;
      listaResultados.appendChild(elementoResultado);
    });
  });
  
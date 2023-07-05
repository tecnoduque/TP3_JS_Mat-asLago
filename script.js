// Fijarse si hay servicios en el local storage 
let serviciosPosibles = JSON.parse(localStorage.getItem(`servicios`)) || [
  { id: 1, cant: 0, nombre: `Visita a domicilio`, precio: 3000 },
  { id: 2, cant: 0, nombre: `Adicional por distancia`, precio: 1500 },
  { id: 3, cant: 0, nombre: `Configuración modem / router / mikrotik / unifi)`, precio: 3500 },
  { id: 4, cant: 0, nombre: `Cableado estructurado con materiales x 20mts`, precio: 3000 },
  { id: 5, cant: 0, nombre: `Cableado estructurado sin materiales x 20mts`, precio: 3000 },
  { id: 6, cant: 0, nombre: `Trabajos sobre CCTV / Controles de acceso`, precio: 4000 },
  { id: 7, cant: 0, nombre: `Instalación sistemas operativos w10 / OSX`, precio: 8000 },
  { id: 8, cant: 0, nombre: `Instalación puesto de trabajo`, precio: 3000 },
  { id: 9, cant: 0, nombre: `Acceso remoto simple`, precio: 200 },
  { id: 10, cant: 0, nombre: `Acceso remoto complejo`, precio: 3500 },
  { id: 11, cant: 0, nombre: `Relevamientos eléctricos, de red, de CCTV`, precio: 2500 },
  { id: 12, cant: 0, nombre: `Cambios en página web, dominios, hosting, integraciones de pago`, precio: 3000 }
]
// crear el carrito 
let carrito = obtenerCarrito()

// DOM
const btnVaciarLocalStorage = document.getElementById("btnVaciarLocalStorage")

const registro = document.getElementById(`registro`)
const inputBusqueda = document.getElementById(`input-busqueda`)
const listaResultados = document.getElementById(`lista-resultados`)
const btnNuevoServicio = document.getElementById(`btn-nuevo-servicio`)
const eliminarResultados = document.getElementById(`eliminarResultados`)
const contenedor = document.getElementById(`contenedor`)
const elementosCarrito = document.getElementById(`carrito`)
const verRegistroBtn = document.getElementById(`verRegistro`)
const totalCarrito = document.getElementById(`totalCarrito`)

totalCarrito.innerHTML = `$0`;


document.getElementById("input-busqueda").addEventListener("keyup", function(event) {
  if (event.key === "Escape") {
    this.value = "";
    listaResultados.innerHTML = ``
    agregarRegistro(`se presionó ESC y se limpió el campo de buscar servicio`)
  }
});
document.getElementById("buscarParaEliminar").addEventListener("keyup", function(event) {
  if (event.key === "Escape") {
    this.value = "";
    eliminarResultados.innerHTML = ``
    agregarRegistro(`se presionó ESC y limpió el campo de eliminar servicio`)
  }
});



btnVaciarLocalStorage.addEventListener("click", () => {
  eliminarLocalStorage();
});

function eliminarLocalStorage() {
  localStorage.clear();
  agregarRegistro(`vaciado el localStorage`)
}

function agregarRegistro(mensaje) {
  registro.value += `${mensaje}\n`;
}

// Fn traer el carrito de localStorage
function obtenerCarrito() {
  const carritoJSON = localStorage.getItem(`carrito`) 
  return carritoJSON ? JSON.parse(carritoJSON) : [] // si null/undefined deja el arraw vacío 
  agregarRegistro(`viendo qué hay en localStorage ${carritoJson}`)
}
// Llamar a la fn mostrarCarrito después de traer carrito desde localStorage
mostrarCarrito()

// Fn para guardar el carrito en localStorage
function guardarCarrito() {
  localStorage.setItem(`carrito`, JSON.stringify(carrito))
}

// Fn para agregar un servicio al carrito mirando si ya está
function agregarAlCarrito(servicio) {
  const servicioExistente = carrito.find(item => item.id === servicio.id)
  
  if (servicioExistente) {
    servicioExistente.cant += 1
    agregarRegistro(`se incrementó +1 el servicio ${servicioExistente.nombre}`)

  } else {
    const nuevoServicio = {
      id: servicio.id,
      cant: 1,
      nombre: servicio.nombre,
      precio: servicio.precio
    }
    carrito.push(nuevoServicio)
    agregarRegistro(`se agregó el servicio ${nuevoServicio.nombre}`)
  


  }
  
  
  // Limpiar la lista de resultados
  listaResultados.innerHTML = ``
  // Limpiar el campo de búsqueda
  inputBusqueda.value = ``
  // Guardar el carrito en localStorage y mostrar el carrito actualizado
  guardarCarrito()
  mostrarCarrito()
}
// Fn para mostrar el array carrito
function mostrarCarrito() {
  // Limpiar el contenido anterior del carrito para no repetir resultados
  elementosCarrito.innerHTML = ``
  
  // Recorrer los elementos del carrito
  carrito.forEach(servicio => {
    
    
  const servicioElemento = document.createElement(`li`)

    
    // Crear el elemento para mostrar el nombre y precio del servicio
    const nombrePrecioElemento = document.createElement(`div`)
    nombrePrecioElemento.innerHTML = `${servicio.cant} -  ${servicio.nombre} - $${servicio.precio}`
    
    // Crear el botón de eliminación
    const eliminarBtn = document.createElement(`button`)
    eliminarBtn.innerHTML = `-`
    eliminarBtn.addEventListener(`click`, () => eliminarDelCarrito(servicio.id))

    // Crear el botón de eliminación
  const agregarBtn = document.createElement(`button`)
  agregarBtn.innerHTML = `+`
  agregarBtn.addEventListener(`click`, () => incrementarEnCarrito(servicio.id))

  //el total del carrito
  totalCarrito.innerHTML = sumarPreciosCarrito()
  
  // Agregar los elementos al servicioElemento
    servicioElemento.appendChild(nombrePrecioElemento)
    servicioElemento.appendChild(eliminarBtn)
    servicioElemento.appendChild(agregarBtn)
  
    // Agregar el servicioElemento al carrito
    elementosCarrito.appendChild(servicioElemento)  
  })
}
//fn de reduce para el total del carrito
function sumarPreciosCarrito() {
  const tieneServicios = carrito.some(servicio => servicio.cant > 0);
  if (tieneServicios) {
    const total = carrito.reduce((suma, servicio) => suma + (servicio.precio * servicio.cant), 0);
    const totalCompleto = `$${total}`;
    return totalCompleto;
  } else {
    return "0";
  }
}




function eliminarDelCarrito(servicioId) {
  const servicioEliminar = carrito.findIndex(item => item.id === servicioId)
  
  if (servicioEliminar !== -1) {
    carrito[servicioEliminar].cant -= 1
    agregarRegistro(`se eliminó del carrito una unidad de ${carrito[servicioEliminar].nombre}`)

    
    if (carrito[servicioEliminar].cant === 0) {
      carrito.splice(servicioEliminar, 1)
    }

    // Guardar el carrito en localStorage y mostrar el carrito actualizado
    guardarCarrito()
    mostrarCarrito()
  }
}

function incrementarEnCarrito(servicioId) {
  const servicioIncrementar = carrito.findIndex(item => item.id === servicioId)
  
  if (servicioIncrementar !== -1) {
    carrito[servicioIncrementar].cant += 1
    agregarRegistro(`se incrementó una unidad de ${carrito[servicioIncrementar].nombre}`)

    
    if (carrito[servicioIncrementar].cant === 0) {
      carrito.splice(servicioIncrementar, 1)
    }
    
    // Guardar el carrito en localStorage y mostrar el carrito actualizado
    guardarCarrito()
    mostrarCarrito()
  }
}
// controlamos el evento de input 
inputBusqueda.addEventListener(`input`, () => {
  const busqueda = inputBusqueda.value.toLowerCase()
  const resultadosFiltrados = serviciosPosibles.filter(servicio => servicio.nombre.toLowerCase().includes(busqueda))


  //ordenar alfabeticamente la lista de resultados
  resultadosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));


  // Limpiar la lista de resultados cuando se hace click
  listaResultados.innerHTML = ``

  // Mostrar qué se encontró 
  resultadosFiltrados.forEach(resultado => {
    const elementoResultado = document.createElement(`li`)
    elementoResultado.innerHTML = resultado.nombre
    elementoResultado.addEventListener(`click`, () => agregarAlCarrito(resultado))
    listaResultados.appendChild(elementoResultado)

  })
})

// Controlar el botón de Nuevo Servicio
btnNuevoServicio.addEventListener(`click`, () => {
  nuevoServicio()
})

// Fn para agregar un nuevo servicio a serviciosPosibles y ya meterlo al carrito
function nuevoServicio() {
  const ultimoIDutilizado = obtenerUltimoID();
  let nuevoNombre = document.getElementById("nombreServicio").value;
  let nuevoPrecio = parseFloat(document.getElementById("valorServicio").value);

  if (nuevoNombre === "") {
    nuevoNombre = `Servicio con ID ${ultimoIDutilizado + 1}`;
    agregarRegistro(`No se le puso nombre al servicio así que le puse automáticamente ${nuevoNombre}`
    );
  }

  if (isNaN(nuevoPrecio)) {
    nuevoPrecio = 0;
    agregarRegistro(
      `El servicio con ID ${ultimoIDutilizado + 1} tenía un precio raro, así que se asignó 0.`
    );
  }

  const nuevoServicio = {
    id: ultimoIDutilizado + 1,
    cant: 1,
    nombre: nuevoNombre,
    precio: nuevoPrecio,
  };

  serviciosPosibles.push(nuevoServicio)
  carrito.push(nuevoServicio)
  agregarRegistro(`se agregó un servicio con ID ${nuevoServicio.id} y se puso en el carrito`)

  mostrarCarrito()
  guardarCarrito()
  guardarServicios()
}
// Fn para eliminar un servicio de serviciosPosibles
  buscarParaEliminar.addEventListener(`input`, () => {
    const busqueda = buscarParaEliminar.value.toLowerCase()
    const resultadosFiltrados = serviciosPosibles.filter(servicio => servicio.nombre.toLowerCase().includes(busqueda))

    //ordenar alfabeticamente 
    resultadosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));

  
    // Mostrar qué se encontró 
    resultadosFiltrados.forEach(resultado => {
      const elementoResultado = document.createElement(`li`)
      elementoResultado.innerHTML = resultado.nombre
      elementoResultado.addEventListener(`click`, () => eliminarServicio(resultado))
      eliminarResultados.appendChild(elementoResultado)

    })
  })

  function eliminarServicio(servicio) {
    const indiceServicio = serviciosPosibles.findIndex(item => item.id === servicio.id)
    
    if (indiceServicio !== -1) {
      serviciosPosibles.splice(indiceServicio, 1)
      eliminarResultados.innerHTML = ``
      buscarParaEliminar.value = ``

      
      agregarRegistro(`se eliminó el servicio con id ${servicio.id}`)



      
    // Guardar los cambios en localStorage y mostrar los servicios actualizados
      guardarServicios()
      mostrarCarrito()
    }
  }

// Fn para guardar los serviciosPosibles en localStorage
function guardarServicios() {
  localStorage.setItem(`servicios`, JSON.stringify(serviciosPosibles))
}

// Fn para obtener el último ID utilizado en el array serviciosPosibles
function obtenerUltimoID() {
  let ultimoID = 0
  serviciosPosibles.forEach(servicio => {
    if (servicio.id > ultimoID) {
      ultimoID = servicio.id
    }
  })
  return ultimoID
}

// Llamar a la función guardarCarrito después de cargar el carrito desde localStorage
guardarCarrito()


//Controlar el botón de ver carrito
verRegistroBtn.addEventListener(`click`, () => {
  if (registro.style.display === 'none') {
    registro.style.display = 'block'; // Mostrar el textarea
    verRegistroBtn.innerHTML = 'Ocultar Registro';
  } else {
    registro.style.display = 'none'; // Ocultar el textarea
    verRegistroBtn.innerHTML = 'Mostrar Registro';
  }
});




// prueba fn de fade in
function paraFade(elemento) {
  elemento.classList.add('visible');
}
const elementosFade = document.querySelectorAll('.fade-in');
elementosFade.forEach(element => {
  paraFade(element);
});








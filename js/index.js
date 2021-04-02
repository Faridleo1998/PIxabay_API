// Variables
const $header = document.querySelector('#header');
const $formulario = document.querySelector('#form');
const $resultado = document.querySelector('#resultado');
const $alerta = document.querySelector('#alerta');
const $paginacion = document.querySelector('#paginacion');
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

// Functions
const mostrarAlerta = () => {
    $alerta.classList.add('show');

    setTimeout(() => {
        $alerta.classList.remove('show');
    }, 2000)
}

const calcularPaginas = total => parseInt(Math.ceil(total / registrosPorPagina));

const imprimirPaginas = () => {
    iterador = crearPaginador(totalPaginas);

    while (true) {
        const { value, done } = iterador.next();
        if (done) return;

        const boton = document.createElement('A');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente');
        boton.onclick = () => {
            paginaActual = value;
            consultarAPI();
        }

        $paginacion.appendChild(boton);
    }
}

const mostrarImagenes = imagenes => {
    if ($alerta.classList.contains('show')) {
        $alerta.classList.remove('show');
    }
    while ($resultado.firstChild) {
        $resultado.removeChild($resultado.firstChild)
    }
    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;
        $resultado.innerHTML += `
            <figure class="figure">
                <img src="${previewURL}" loading="lazy">
                <figcaption class="figure__info">
                    <p class="figure__text">
                        <svg width="30" heigth="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>
                        ${likes}
                    </p>
                    <p class="figure__text">
                        <svg width="30" heigth="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /> <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
                        ${views}
                    </p>
                    <a class="figure__link" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver Imagen</a>
                </figcaption>
            </figure>
        `;
    });
    while ($paginacion.firstChild) {
        $paginacion.removeChild($paginacion.firstChild);
    }
    imprimirPaginas();
}

const consultarAPI = () => {
    const textoBusqueda = document.querySelector('#textoBusqueda').value;
    const key = '20904151-5a54370626ec262e04a1e6375';
    const url = `https://pixabay.com/api/?key=${key}&q=${textoBusqueda}&image_type=photo&per_page=${registrosPorPagina}&page=${paginaActual}`;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        })
}

function* crearPaginador(totalPaginas) {
    for (let i = 1; i <= totalPaginas; i++) {
        yield i;
    }
}

const validarFormulario = e => {
    e.preventDefault();
    const textoBusqueda = document.querySelector('#textoBusqueda').value;
    if (textoBusqueda.trim() === '') {
        mostrarAlerta();
        return;
    }

    consultarAPI();
}


document.addEventListener('DOMContentLoaded', () => {
    $formulario.addEventListener('submit', validarFormulario);
})
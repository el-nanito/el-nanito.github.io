const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('lista-1');
const elementos2 = document.getElementById('lista-2');
const lista = document.querySelector('#carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const finalizarCompraBtn = document.getElementById('finalizar-compra');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-btn');
const generarBoletaBtn = document.getElementById('generar-boleta');

cargarEventListeners();

function cargarEventListeners() {
    elementos1.addEventListener('click', comprarElemento);
    elementos2.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    finalizarCompraBtn.addEventListener('click', mostrarModal);
    closeBtn.addEventListener('click', cerrarModal);
    generarBoletaBtn.addEventListener('click', generarBoletaPDF);
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.precio').textContent,
        id: elemento.querySelector('.agregar-carrito').getAttribute('data-id'),
        cantidad: parseInt(elemento.querySelector('.cantidad').value)
    }
    insertarCarrito(infoElemento);
}

function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    const precioTotal = parseFloat(elemento.precio.replace('S/', '')) * elemento.cantidad;
    row.innerHTML = `
        <td>
            <img src="${elemento.imagen}" width="100">
        </td>
        <td>
            ${elemento.titulo}
        </td>
        <td>
            S/${precioTotal.toFixed(2)}
        </td>
        <td>
            <a href="#" class="borrar" data-id="${elemento.id}">X</a>
        </td>
    `;
    lista.appendChild(row);
}

function eliminarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar')) {
        e.target.parentElement.parentElement.remove();
    }
}

function vaciarCarrito() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    return false;
}

function mostrarModal() {
    modal.style.display = 'block';
}

function cerrarModal() {
    modal.style.display = 'none';
}

function generarBoletaPDF() {
    const nombre = document.getElementById('nombre').value;
    const numeroTarjeta = document.getElementById('numero-tarjeta').value;
    const cvv = document.getElementById('cvv').value;
    const fechaVencimiento = document.getElementById('fecha-vencimiento').value;
    const dni = document.getElementById('dni').value;

    if (nombre === '' || numeroTarjeta === '' || cvv === '' || fechaVencimiento === '' || dni === '') {
        alert('Por favor complete todos los campos.');
        return;
    }

    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();
    let y = 20;

    doc.setFontSize(12);
    doc.text(20, y, `MINIMARKET EL ÑAÑITO`)
    y += 10;
    doc.text(20, y, `Boleta de pago`)
    y += 10;
    doc.text(20, y, `Fecha: ${fecha}`)
    y += 10;
    doc.text(20, y, `Nombre: ${nombre}`);
    y += 10;
    doc.text(20, y, `DNI: ${dni}`);
    y += 10;
    doc.text(20, y, `Número de Tarjeta: ${numeroTarjeta}`);
    y += 20;

    doc.setFontSize(16);
    doc.text(20, y, 'Detalle de la compra:');
    y += 10;
    doc.setFontSize(12);

    lista.querySelectorAll('tr').forEach(row => {
        const columns = row.querySelectorAll('td');
        const producto = columns[1].textContent;
        const precio = columns[2].textContent;
        doc.text(20, y, `${producto} - ${precio}`);
        y += 20;
    });
    doc.save(`boleta_${fecha}.pdf`);

    alert('Compra realizada correctamente. Se ha generado la boleta en PDF.');

    cerrarModal();

    vaciarCarrito();
}
window.onscroll = function(){
    if(document.documentElement.scrollTop >100){
        document.querySelector('.go-top-container')
        .classList.add('show');
    }
    else{
        document.querySelector('.go-top-container')
        .classList.remove('show');
    }
}
document.querySelector('.go-top-container').addEventListener('click', ()=>{
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
})

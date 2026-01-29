// ============================================
// DNI CANINO – SCRIPT ESTABLE FINAL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    inicializarElementos();
    cargarDatos();
    inicializarEventos();
    actualizarVista();

    if (document.getElementById('formularioPerro')) {
        cargarFormulario();
    }
});

// ============================================
// ESTADO GLOBAL
// ============================================

const datosPorDefecto = {
    nombre: '',
    raza: '',
    color: '',
    sexo: '',
    nacimiento: '',
    tutor: '',
    domicilio: '',
    telefono: '',
    email: '',
    microchip: '',
    veterinario: '',
    vacunas: '',
    alergias: '',
    tratamientos: '',
    observaciones: '',
    firma: '',
    fotoBase64: '',
    fechaActualizacion: ''
};

let datosPerro = { ...datosPorDefecto };
let fotoTemp = null;

// ============================================
// ELEMENTOS
// ============================================

let formulario, btnGuardar;
let fotoInput, previewFoto, uploadText;
let btnQuitarFoto;
let btnGenerarQR;

// ============================================
// INIT ELEMENTOS
// ============================================

function inicializarElementos() {
    formulario = document.getElementById('formularioPerro');
    btnGuardar = document.getElementById('btnGuardar');

    fotoInput = document.getElementById('fotoInput');
    previewFoto = document.getElementById('previewFoto');
    uploadText = document.getElementById('uploadText');
    btnQuitarFoto = document.getElementById('btnQuitarFoto');

    btnGenerarQR = document.getElementById('generarQR');

    document.getElementById('btnVolver')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// ============================================
// STORAGE
// ============================================

function cargarDatos() {
    const guardados = localStorage.getItem('dniPerro');
    if (guardados) {
        datosPerro = { ...datosPorDefecto, ...JSON.parse(guardados) };
    }
}

function guardarDatos() {
    datosPerro.fechaActualizacion = new Date().toLocaleString('es-AR');
    localStorage.setItem('dniPerro', JSON.stringify(datosPerro));
}

// ============================================
// EVENTOS
// ============================================

function inicializarEventos() {
    formulario?.addEventListener('submit', e => {
        e.preventDefault();
        guardarFormulario();
    });

    fotoInput?.addEventListener('change', cargarFoto);
    btnQuitarFoto?.addEventListener('click', quitarFoto);

    btnGenerarQR?.addEventListener('click', generarQR);
}

// ============================================
// FORMULARIO
// ============================================

function guardarFormulario() {
    btnGuardar.disabled = true;

    Object.keys(datosPorDefecto).forEach(id => {
        const el = document.getElementById(id);
        if (el && id !== 'fotoBase64') {
            datosPerro[id] = el.value.trim();
        }
    });

    if (!datosPerro.nombre || !datosPerro.tutor || !datosPerro.telefono) {
        alert('Nombre, tutor y teléfono son obligatorios');
        btnGuardar.disabled = false;
        return;
    }

    if (fotoTemp) {
        datosPerro.fotoBase64 = fotoTemp;
    }

    guardarDatos();

    const toast = document.getElementById('toastExito');
    toast?.classList.add('mostrar');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1200);
}

function cargarFormulario() {
    Object.keys(datosPorDefecto).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = datosPerro[id] || '';
    });

    if (datosPerro.fotoBase64 && previewFoto) {
        previewFoto.src = datosPerro.fotoBase64;
        previewFoto.style.display = 'block';
        uploadText && (uploadText.style.display = 'none');
    }
}

// ============================================
// VISTA
// ============================================

function actualizarVista() {
    Object.keys(datosPorDefecto).forEach(id => {
        const vista = document.getElementById(id + 'Vista');
        if (vista) vista.textContent = datosPerro[id] || '—';
    });

    const fotoVista = document.getElementById('fotoVista');
    const sinFoto = document.getElementById('sinFotoVista');

    if (!fotoVista || !sinFoto) return;

    if (datosPerro.fotoBase64) {
        fotoVista.src = datosPerro.fotoBase64;
        fotoVista.style.display = 'block';
        sinFoto.style.display = 'none';
    } else {
        fotoVista.style.display = 'none';
        sinFoto.style.display = 'flex';
    }
}

// ============================================
// FOTO
// ============================================

function cargarFoto() {
    const file = fotoInput?.files[0];
    if (!file || !file.type.startsWith('image')) return;

    const reader = new FileReader();
    reader.onload = e => {
        fotoTemp = e.target.result;
        previewFoto.src = fotoTemp;
        previewFoto.style.display = 'block';
        uploadText && (uploadText.style.display = 'none');
    };
    reader.readAsDataURL(file);
}

function quitarFoto() {
    fotoTemp = null;
    datosPerro.fotoBase64 = '';
    if (previewFoto) previewFoto.style.display = 'none';
    uploadText && (uploadText.style.display = 'block');
}

// ============================================
// QR
// ============================================

function generarQR() {
    if (typeof QRCode === 'undefined') {
        alert('La librería QR no está cargada');
        return;
    }

    if (!datosPerro.telefono) {
        alert('Falta el teléfono');
        return;
    }

    const contenedor = document.getElementById('qrCodeCanvas');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    const texto = `PERRO EXTRAVIADO\nNombre: ${datosPerro.nombre}\nTel: ${datosPerro.telefono}`;

    new QRCode(contenedor, {
        text: texto,
        width: 180,
        height: 180,
        correctLevel: QRCode.CorrectLevel.H
    });

    document.getElementById('qrSection')?.classList.add('qr-generado');
}

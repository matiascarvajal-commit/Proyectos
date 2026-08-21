// 1. Base de Datos
const baseDatos = [
    { 
        id: 1, nombre: "Cale Henituse", origen: "Familia Henituse / <span class='tachado'>Corea del Sur</span>", 
        rol: "Estratega / <span class='tachado'>Comandante Supremo</span>", estado: "Activo",
        ultimaAparicion: "Continente Occidental",
        curiosidades: "Sujeto altamente impredecible. Su objetivo declarado es ser un vago, pero sus acciones indican <span class='tachado'>una manipulación psicológica a gran escala</span>. Nivel de amenaza: <span class='tachado'>Nivel Dragón</span>.",
        imagen: "https://static.wikia.nocookie.net/trash-of-the-counts-family/images/7/72/Cale29.jpg/revision/latest?cb=20210514214537",
        imagenLocal: "img/Cale.jpg"
    },
    { 
        id: 2, nombre: "Jonathan Almendair Crespo", origen: "<span class='tachado'>Suburbios</span>", 
        rol: "Sobreviviente", estado: "Paradero Desconocido",
        ultimaAparicion: "Zonas de Guerra (Registros de un diario personal)",
        curiosidades: "El sujeto no tiene relación alguna con <span class='tachado'>el Experimento Finn</span>. Los registros en su diario confirman que operaba de forma independiente.",
        imagen: "https://static.wikia.nocookie.net/el-diario-de-jonathan/images/0/0b/JAR.png/revision/latest?cb=20181226131138",
        imagenLocal: "img/Jonathan.jpg"
    },
    { 
        id: 3, nombre: "Light Yagami", origen: "Kanto, Japón", 
        rol: "Estudiante / <span class='tachado'>Alias: Kira</span>", estado: "Eliminado",
        ultimaAparicion: "Almacén Yellow Box",
        curiosidades: "Responsable de la eliminación de <span class='tachado'>miles de criminales a nivel mundial</span> utilizando el artefacto designado como [ARCHIVO D.N.].",
        imagen: "https://wallpapers-clan.com/wp-content/uploads/2022/12/death-note-light-yagami-pfp-14.jpx",
        imagenLocal: "img/Light.jpg"
    },
    { 
        id: 4, nombre: "Leon Scott Kennedy", origen: "R.P.D. / D.S.O.", 
        rol: "Agente Especial", estado: "Activo",
        ultimaAparicion: "Misión: <span class='tachado'>Investigacion Virus T, Sujeto Infectado</span>",
        curiosidades: "Sobrevivió al incidente de Raccoon City. Posee autorización de seguridad de nivel <span class='tachado'>G-7</span>. Reportes indican un uso excesivo de patadas giratorias.",
        imagen: "https://images7.alphacoders.com/140/thumb-1920-1408267.pnx",
        imagenLocal: "img/Leon.jpg"
    }
];

// 2. Elementos del DOM (Login)
const pantallaLogin = document.getElementById('pantalla-login');
const pantallaEscritorio = document.getElementById('pantalla-escritorio');
const btnIngresar = document.getElementById('btnIngresar');
const inputUsuario = document.getElementById('inputUsuario');
const inputPassword = document.getElementById('inputPassword');
const mensajeLogin = document.getElementById('mensajeLogin');

// 3. Elementos del DOM (Buscador)
const carpetaFisica = document.getElementById('carpeta-fisica');
const inputBusqueda = document.getElementById('inputBusqueda');
const btnBuscar = document.getElementById('btnBuscar');
const zonaDocumentos = document.getElementById('zona-documentos');

let hojaActual = null; // Variable para recordar qué hoja está en la mesa

// 4. Lógica de Inicio de Sesión
btnIngresar.addEventListener('click', () => {
    // Credenciales de prueba
    if (inputUsuario.value.toLowerCase() === "admin" && inputPassword.value === "1234") {
        mensajeLogin.textContent = "";
        
        // Disparar animación de sentarse
        pantallaLogin.classList.add('animacion-sentarse');
        
        // Esperar 1.5 segundos a que termine la animación antes de cambiar de pantalla
        // Esperar 1.5 segundos a que termine la animación antes de cambiar de pantalla
        setTimeout(() => {
            // Apagamos la pantalla de login por completo
            pantallaLogin.classList.remove('activa');
            pantallaLogin.classList.add('oculta');
            pantallaLogin.style.display = 'none'; // ¡Parche de seguridad!
            
            // Mostramos el escritorio
            pantallaEscritorio.classList.remove('oculta');
            pantallaEscritorio.classList.add('activa');
        }, 1500);

    } else {
        mensajeLogin.textContent = "[ ACCESO DENEGADO ]";
    }
});

// 5. Lógica de Búsqueda y Animación de Hojas
const realizarBusqueda = () => {
    const termino = inputBusqueda.value.toLowerCase().trim();
    if (termino === '') return;

    // EL CAMBIO ESTÁ AQUÍ: Reemplazamos .includes() por ===
    const resultados = baseDatos.filter(personaje => personaje.nombre.toLowerCase() === termino);

    if (resultados.length > 0) {
        const personaje = resultados[0]; // Tomamos el primer resultado
        
        // Animamos la carpeta abriéndose un poco
        carpetaFisica.classList.add('carpeta-abierta');

        // Si ya hay una hoja en la mesa, la descartamos
        if (hojaActual) {
            hojaActual.classList.remove('hoja-entrante');
            hojaActual.classList.add('hoja-descartada');
            
            // Eliminamos la hoja descartada del HTML después de 1 segundo (cuando termina de caer)
            const hojaABorrar = hojaActual;
            setTimeout(() => { hojaABorrar.remove(); }, 1000);
        }

        // Creamos la nueva hoja
        const nuevaHoja = document.createElement('div');
        nuevaHoja.className = 'tarjeta hoja-entrante'; // Clase que la hace deslizarse hacia abajo
        
        nuevaHoja.innerHTML = `
            <div class="sello-clasificado">CONFIDENCIAL</div>
            <div class="tarjeta-grid">
                <div class="tarjeta-imagen">
                        <img src="${personaje.imagen}" onerror="this.onerror=null; this.src='${personaje.imagenLocal}';" alt="Fotografía">
                            </div>
                <div class="tarjeta-info">
                    <ul class="lista-datos">
                        <li><strong>SUJETO:</strong> ${personaje.nombre}</li>
                        <li><strong>ORIGEN:</strong> ${personaje.origen}</li>
                        <li><strong>ROL:</strong> ${personaje.rol}</li>
                        <li><strong>ÚLTIMA APARICIÓN:</strong> ${personaje.ultimaAparicion}</li>
                        <li><strong>ESTADO:</strong> ${personaje.estado}</li>
                    </ul>
                    <div class="seccion-notas">
                        <strong>[OBSERVACIONES]</strong>
                        <p>${personaje.curiosidades}</p>
                    </div>
                </div>
            </div>
        `;

        zonaDocumentos.appendChild(nuevaHoja);
        hojaActual = nuevaHoja; // Actualizamos cuál es la hoja que está actualmente en la mesa

    } else {
        // Si no se encuentra, mostramos alerta y cerramos la carpeta
        alert("Sujeto no encontrado en los registros. Verifique el nombre completo.");
        carpetaFisica.classList.remove('carpeta-abierta');
    }
};

// 6. Eventos del Buscador
btnBuscar.addEventListener('click', realizarBusqueda);
inputBusqueda.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') realizarBusqueda();
});
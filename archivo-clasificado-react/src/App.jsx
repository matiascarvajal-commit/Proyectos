import { useState } from 'react';
import './App.css';

// La base de datos original ahora es solo el "estado inicial"
const baseDatosInicial = [
    { 
        id: 1, nombre: "Cale Henituse", origen: "Familia Henituse / Corea del Sur", 
        rol: "Estratega / Comandante Supremo", estado: "Activo",
        ultimaAparicion: "Continente Occidental",
        curiosidades: "Sujeto altamente impredecible. Su objetivo declarado es ser un vago. Nivel de amenaza: Nivel Dragón.",
        imagen: "https://static.wikia.nocookie.net/trash-of-the-counts-family/images/7/72/Cale29.jpg",
        imagenLocal: "img/Cale.jpg" 
    },
    { 
        id: 2, nombre: "Jonathan Almendair Crespo", origen: "Suburbios", 
        rol: "Sobreviviente", estado: "Paradero Desconocido",
        ultimaAparicion: "Zonas de Guerra",
        curiosidades: "El sujeto no tiene relación alguna con el Experimento Finn. Los registros en su diario confirman que operaba de forma independiente.",
        imagen: "https://static.wikia.nocookie.net/el-diario-de-jonathan/images/0/0b/JAR.png",
        imagenLocal: "img/Jonathan.png" 
    },
    { 
        id: 3, nombre: "Light Yagami", origen: "Kanto, Japón", 
        rol: "Estudiante / Alias: Kira", estado: "Eliminado",
        ultimaAparicion: "Almacén Yellow Box",
        curiosidades: "Responsable de la eliminación de miles de criminales a nivel mundial.",
        imagen: "https://link-de-internet-falso-para-probar.com/light.jpg", 
        imagenLocal: "img/Light.jpg" 
    },
    { 
        id: 4, nombre: "Leon Scott Kennedy", origen: "R.P.D. / D.S.O.", 
        rol: "Agente Especial", estado: "Activo",
        ultimaAparicion: "Misión: Investigacion Virus T",
        curiosidades: "Sobrevivió al incidente de Raccoon City. Reportes indican un uso excesivo de patadas giratorias.",
        imagen: "https://images7.alphacoders.com/140/thumb-1920-1408267.png",
        imagenLocal: "img/Leon.png" 
    }
];

function App() {
  // --- ESTADOS DEL SISTEMA ---
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // --- ESTADOS DE LA BASE DE DATOS Y VISTAS ---
  const [registros, setRegistros] = useState(baseDatosInicial); // La BD ahora es un estado
  const [vistaActual, setVistaActual] = useState('buscador'); // 'buscador' o 'registro'
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);

  // --- ESTADOS DEL NUEVO FORMULARIO ---
  const [nuevoSujeto, setNuevoSujeto] = useState({
      nombre: '', origen: '', rol: '', estado: '', ultimaAparicion: '', curiosidades: '', imagen: '', imagenLocal: ''
  });

  // --- FUNCIONES ---
  const manejarLogin = () => {
    if (usuario.toLowerCase() === 'admin' && password === '1234') {
        setMensajeError('');
        setEstaAutenticado(true); 
    } else {
        setMensajeError('[ ACCESO DENEGADO ]');
    }
  };

  const manejarBusqueda = () => {
    const textoLimpio = terminoBusqueda.toLowerCase().trim();
    if (textoLimpio === "") {
        setResultados([]); 
        return;
    }
    const encontrados = registros.filter(personaje => 
        personaje.nombre.toLowerCase().includes(textoLimpio) || 
        personaje.rol.toLowerCase().includes(textoLimpio)
    );
    setResultados(encontrados);
  };

  // --- NUEVA FUNCIÓN: Leer archivo del disco duro ---
  const manejarSubidaImagen = (e) => {
      const archivo = e.target.files[0];
      if (archivo) {
          // Crea un enlace temporal en la memoria del navegador para la foto
          const urlTemporal = URL.createObjectURL(archivo);
          setNuevoSujeto({ ...nuevoSujeto, imagenLocal: urlTemporal });
      }
  };

  const archivarNuevoSujeto = () => {
      // SEGURO DE DATOS: Evitar expedientes sin nombre
      if (nuevoSujeto.nombre.trim() === '') {
          alert("[ ERROR DEL SISTEMA ] - Se requiere el Nombre o Alias del sujeto para abrir un expediente.");
          return;
      }

      const nuevoId = registros.length + 1;
      
      const sujetoFinal = { 
          ...nuevoSujeto, 
          id: nuevoId, 
          // Si el agente no subió una foto local, usamos una silueta genérica de respaldo
          imagenLocal: nuevoSujeto.imagenLocal !== '' ? nuevoSujeto.imagenLocal : 'img/leon.png' 
      };

      setRegistros([...registros, sujetoFinal]);

      // Limpiamos el formulario
      setNuevoSujeto({nombre: '', origen: '', rol: '', estado: '', ultimaAparicion: '', curiosidades: '', imagen: '', imagenLocal: ''});
      setVistaActual('buscador');
      setResultados([sujetoFinal]);
  };

  // --- INTERFAZ DEL ESCRITORIO ---
  if (estaAutenticado) {
      return (
          <div className="pantalla-principal">
              <div id="pantalla-escritorio" className="pantalla activa">
                  <main className="contenedor-escritorio">
                      
                      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
                      <div className="barra-navegacion">
                          <button 
                              className={vistaActual === 'buscador' ? 'btn-nav activo' : 'btn-nav'} 
                              onClick={() => setVistaActual('buscador')}
                          >
                              [ EXTRACCIÓN DE DATOS ]
                          </button>
                          <button 
                              className={vistaActual === 'registro' ? 'btn-nav activo' : 'btn-nav'} 
                              onClick={() => setVistaActual('registro')}
                          >
                              [ REGISTRO DE NUEVO SUJETO ]
                          </button>
                      </div>

                      {/* VISTA 1: EL BUSCADOR (Igual que antes) */}
                      {vistaActual === 'buscador' && (
                          <>
                              <div id="carpeta-fisica" className="carpeta-clasificada abierta">
                                  <div className="etiqueta-carpeta">NIVEL DE ACCESO: ALTO SECRETO</div>
                                  <h1>Base de Datos de Inteligencia</h1>
                                  
                                  <div className="caja-busqueda">
                                      <input 
                                        type="text" 
                                        placeholder="Ingrese el alias o rol..." 
                                        value={terminoBusqueda}
                                        onChange={(e) => setTerminoBusqueda(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') manejarBusqueda(); }}
                                      />
                                      <button onClick={manejarBusqueda}>Extraer</button>
                                  </div>
                              </div>

                              <div id="zona-documentos">
                                  {resultados.map((personaje) => (
                                      <div key={personaje.id} className="hoja-personaje hoja-entrante">
                                          <div className="sello-confidencial">CONFIDENCIAL</div>
                                          <div className="cabecera-hoja">
                                              <div className="datos-principales">
                                                  <h2>{personaje.nombre}</h2>
                                                  <p><strong>Origen:</strong> {personaje.origen}</p>
                                                  <p><strong>Rol:</strong> {personaje.rol}</p>
                                                  <p><strong>Estado:</strong> {personaje.estado}</p>
                                              </div>
                                              <div className="tarjeta-imagen">
                                                  <img 
                                                    src={personaje.imagen} 
                                                    onError={(e) => { e.target.onerror = null; e.target.src = personaje.imagenLocal; }} 
                                                    alt={`Fotografía de ${personaje.nombre}`} 
                                                  />
                                              </div>
                                          </div>
                                          <div className="cuerpo-hoja">
                                              <h3>[ ÚLTIMO AVISTAMIENTO ]</h3>
                                              <p>{personaje.ultimaAparicion}</p>
                                              <h3>[ NOTAS DEL AGENTE ]</h3>
                                              <p>{personaje.curiosidades}</p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </>
                      )}

                      {/* VISTA 2: EL FORMULARIO DE INGRESO */}
                      {vistaActual === 'registro' && (
                          <div className="carpeta-clasificada abierta">
                              <div className="etiqueta-carpeta">CLASIFICACIÓN: INGRESO MANUAL</div>
                              <h1>Generar Nuevo Expediente</h1>
                              
                              <div className="formulario-ingreso">
                                  <input type="text" placeholder="Nombre completo / Alias (Requerido)" value={nuevoSujeto.nombre} onChange={(e) => setNuevoSujeto({...nuevoSujeto, nombre: e.target.value})} />
                                  <input type="text" placeholder="Origen / Afiliación" value={nuevoSujeto.origen} onChange={(e) => setNuevoSujeto({...nuevoSujeto, origen: e.target.value})} />
                                  <input type="text" placeholder="Rol / Rango" value={nuevoSujeto.rol} onChange={(e) => setNuevoSujeto({...nuevoSujeto, rol: e.target.value})} />
                                  <input type="text" placeholder="Estado (Activo, Eliminado, Desconocido)" value={nuevoSujeto.estado} onChange={(e) => setNuevoSujeto({...nuevoSujeto, estado: e.target.value})} />
                                  <input type="text" placeholder="Último Avistamiento" value={nuevoSujeto.ultimaAparicion} onChange={(e) => setNuevoSujeto({...nuevoSujeto, ultimaAparicion: e.target.value})} />
                                  <textarea placeholder="Notas del Agente / Curiosidades..." value={nuevoSujeto.curiosidades} onChange={(e) => setNuevoSujeto({...nuevoSujeto, curiosidades: e.target.value})}></textarea>
                                  
                                  <div className="seccion-archivos">
                                      <p className="texto-terminal-pequeno">ADJUNTAR EVIDENCIA FOTOGRÁFICA</p>
                                      <input type="text" placeholder="Opción A: URL de fotografía en base de datos global (Internet)" value={nuevoSujeto.imagen} onChange={(e) => setNuevoSujeto({...nuevoSujeto, imagen: e.target.value})} />
                                      
                                      <div className="grupo-archivo">
                                          <label>Opción B: Subir evidencia local (Último avistamiento)</label>
                                          <input type="file" accept="image/*" onChange={manejarSubidaImagen} className="input-archivo" />
                                      </div>
                                  </div>
                                  
                                  <button className="btn-archivar" onClick={archivarNuevoSujeto}>[ GENERAR ARCHIVO Y SELLAR ]</button>
                              </div>
                          </div>
                      )}

                  </main>
              </div>
          </div>
      );
  }

  // --- INTERFAZ DE LOGIN ---
  return (
    <div className="pantalla-principal">
      <div id="pantalla-login" className="pantalla activa">
          <div className="puerta-fondo"></div>
          <div className="cono-luz"></div>
          <div className="escena-interrogatorio">
              <div className="agente"><div className="cabeza-agente"></div><div className="cuerpo-agente"></div></div>
              <div className="mesa-interrogatorio"></div>
              <div className="sospechoso"><div className="cabeza-sospechoso"></div><div className="cuerpo-sospechoso"></div></div>
          </div>

          <div className="mesa-login">
              <h2 className="texto-terminal">INICIAR SESIÓN</h2>
              <input type="text" placeholder="USUARIO" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
              <input type="password" placeholder="CONTRASEÑA" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') manejarLogin(); }} />
              <button onClick={manejarLogin}>ENTRAR</button>
              <p className="error-login">{mensajeError}</p>
          </div>
      </div>
    </div>
  );
}

export default App;
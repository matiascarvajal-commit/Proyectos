import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // --- ESTADOS DEL SISTEMA ---
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // --- ESTADOS DE LA BASE DE DATOS Y VISTAS ---
  const [registros, setRegistros] = useState([]); 
  const [vistaActual, setVistaActual] = useState('buscador'); 
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);

  // --- MEMORIA DEL FORMULARIO ---
  const [nuevoSujeto, setNuevoSujeto] = useState({
      nombre: '', origen: '', rol: '', estado: '', ultimaAparicion: '', curiosidades: '', imagen: '', imagenLocal: ''
  });

  // --- CARGAR DATOS DESDE LA BÓVEDA ---
  useEffect(() => {
      const extraerExpedientes = async () => {
          try {
              const respuesta = await fetch('http://localhost:5000/api/sujetos');
              const datos = await respuesta.json();
              setRegistros(datos);
          } catch (error) {
              console.error("[ ERROR DE ENLACE ] No se pudo contactar a la Aduana.");
          }
      };
      
      extraerExpedientes();
  }, [estaAutenticado]);

  // --- FUNCIONES DEL SISTEMA ---
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

const manejarSubidaImagen = (e) => {
      const archivo = e.target.files[0];
      if (archivo) {
          // Usamos FileReader para convertir la foto física en texto (Base64)
          const lector = new FileReader();
          
          lector.onloadend = () => {
              // Una vez que termina de leerla, guardamos el texto resultante en el estado
              setNuevoSujeto({ ...nuevoSujeto, imagenLocal: lector.result });
          };
          
          // Le ordenamos que inicie la conversión
          lector.readAsDataURL(archivo);
      }
  };

  const archivarNuevoSujeto = async () => {
      if (nuevoSujeto.nombre.trim() === '') {
          alert("[ ERROR DEL SISTEMA ] - Se requiere el Nombre o Alias.");
          return;
      }

      const sujetoFinal = { 
          ...nuevoSujeto, 
          imagenLocal: nuevoSujeto.imagenLocal !== '' ? nuevoSujeto.imagenLocal : '/img/Leon.jpg' 
      };

      try {
          const respuesta = await fetch('http://localhost:5000/api/sujetos', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(sujetoFinal)
          });

          if (respuesta.ok) {
              const sujetoGuardado = await respuesta.json();
              setRegistros([...registros, sujetoGuardado]);
              setNuevoSujeto({nombre: '', origen: '', rol: '', estado: '', ultimaAparicion: '', curiosidades: '', imagen: '', imagenLocal: ''});
              setVistaActual('buscador');
              setResultados([sujetoGuardado]);
          }
      } catch (error) {
          alert("[ ERROR DE TRANSMISIÓN ] - La Bóveda rechazó la conexión.");
      }
  };

  const eliminarSujeto = async (idMongo) => {
      const autorizacion = window.confirm("[ ALERTA ] - ¿Autoriza la destrucción permanente de este expediente?");
      if (!autorizacion) return;

      console.log("Enviando orden de purga para el ID:", idMongo);

      try {
          const respuesta = await fetch(`http://localhost:5000/api/sujetos/${idMongo}`, {
              method: 'DELETE'
          });

          if (respuesta.ok) {
              const nuevosRegistros = registros.filter(personaje => personaje._id !== idMongo);
              setRegistros(nuevosRegistros);
              
              const nuevosResultados = resultados.filter(personaje => personaje._id !== idMongo);
              setResultados(nuevosResultados);
              
              alert("[ SISTEMA ] - Expediente purgado de la base de datos.");
          } else {
              alert("[ ALERTA ] - La Aduana recibió la orden, pero la Bóveda no pudo borrarlo.");
          }
      } catch (error) {
          alert("[ ERROR CRÍTICO ] - La orden no pudo llegar a la Aduana. ¿Está encendido el servidor?");
      }
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

                      {/* VISTA 1: EL BUSCADOR */}
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
                                      <div key={personaje._id || personaje.id} className="hoja-personaje hoja-entrante">
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
                                              
                                              {/* EL BOTÓN DE PURGA CONECTADO */}
                                              <button 
                                                  className="btn-eliminar" 
                                                  onClick={() => eliminarSujeto(personaje._id || personaje.id)}
                                              >
                                                  [ DESTRUIR EXPEDIENTE ]
                                              </button>
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
                                          <input 
                                                type="file" 
                                                accept=".jpg, .jpeg, .png, .webp" 
                                                onChange={manejarSubidaImagen} 
                                                className="input-archivo" 
                                            />
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
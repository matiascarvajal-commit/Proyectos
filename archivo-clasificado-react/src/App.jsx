import { useState } from 'react';
import './App.css';

// 1. Tu Base de Datos (Fuera del componente App porque no cambia)
const baseDatos = [
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
        imagen: "https://wallpapers-clan.com/wp-content/uploads/2022/12/death-note-light-yagami-pfp-14.jpg", 
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
  // Estados para el Login
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // Estados para el Buscador
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);

  // Lógica de Login
  const manejarLogin = () => {
    if (usuario.toLowerCase() === 'admin' && password === '1234') {
        setMensajeError('');
        setEstaAutenticado(true); 
    } else {
        setMensajeError('[ ACCESO DENEGADO ]');
    }
  };

  // Lógica de Búsqueda
  const manejarBusqueda = () => {
    const textoLimpio = terminoBusqueda.toLowerCase().trim();
    
    if (textoLimpio === "") {
        setResultados([]); // Limpia la pantalla si buscan vacío
        return;
    }

    const encontrados = baseDatos.filter(personaje => 
        personaje.nombre.toLowerCase().includes(textoLimpio) || 
        personaje.rol.toLowerCase().includes(textoLimpio)
    );

    setResultados(encontrados);
  };

  // PANTALLA 2: ESCRITORIO
  if (estaAutenticado) {
      return (
          <div className="pantalla-principal">
              <div id="pantalla-escritorio" className="pantalla activa">
                  <main className="contenedor-escritorio">
                      
                      <div id="carpeta-fisica" className="carpeta-clasificada abierta">
                          <div className="etiqueta-carpeta">NIVEL DE ACCESO: ALTO SECRETO</div>
                          <h1>Base de Datos de Inteligencia</h1>
                          
                          <div className="caja-busqueda">
                                <input 
                                  type="text" 
                                  placeholder="Ingrese el alias o rol..." 
                                  value={terminoBusqueda}
                                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                                  onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                          manejarBusqueda();
                                      }
                                  }}
                                />
                                <button onClick={manejarBusqueda}>Extraer</button>
                            </div>
                      </div>

                      {/* ZONA DE RESULTADOS: Aquí React mapea los datos y dibuja el HTML */}
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
                          
                          {/* Mensaje si no hay resultados y el usuario escribió algo */}
                          {resultados.length === 0 && terminoBusqueda !== "" && (
                              <div className="hoja-personaje hoja-entrante" style={{textAlign: 'center'}}>
                                  <h2>[ REGISTRO NO ENCONTRADO ]</h2>
                                  <p>El sujeto no figura en la base de datos.</p>
                              </div>
                          )}
                      </div>

                  </main>
              </div>
          </div>
      );
  }

  // PANTALLA 1: LOGIN (Igual que antes)
  return (
    <div className="pantalla-principal">
      <div id="pantalla-login" className="pantalla activa">
          <div className="puerta-fondo"></div>
          <div className="cono-luz"></div>
          
          <div className="escena-interrogatorio">
              <div className="agente">
                  <div className="cabeza-agente"></div>
                  <div className="cuerpo-agente"></div>
              </div>
              <div className="mesa-interrogatorio"></div>
              <div className="sospechoso">
                  <div className="cabeza-sospechoso"></div>
                  <div className="cuerpo-sospechoso"></div>
              </div>
          </div>

          <div className="mesa-login">
              <h2 className="texto-terminal">INICIAR SESIÓN</h2>
              <input 
                type="text" 
                placeholder="USUARIO" 
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="CONTRASEÑA" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button onClick={manejarLogin}>ENTRAR</button>
              <p className="error-login">{mensajeError}</p>
          </div>
      </div>
    </div>
  );
}

export default App;
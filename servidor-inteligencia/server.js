const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Inicializamos el marco del servidor
const app = express();
const PUERTO = 5000;

// ==========================================
// 1. PROTOCOLOS DE ENTRADA (Middlewares)
// ==========================================
app.use(cors()); // Permite que el puerto 5173 (React) hable con este puerto (5000)
// ==========================================
// 1. PROTOCOLOS DE ENTRADA (Middlewares)
// ==========================================
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// ==========================================
// 2. CONEXIÓN A LA BÓVEDA (MongoDB)
// ==========================================
// Usamos 127.0.0.1 para apuntar directo a tu contenedor Docker local
mongoose.connect('mongodb://127.0.0.1:27017/archivo_inteligencia')
    .then(() => console.log('[ OK ] Conexión establecida con la Bóveda MongoDB'))
    .catch(err => console.error('[ ERROR CRÍTICO ] Fallo al conectar con la base de datos:', err));

// ==========================================
// 3. MOLDE DEL DOCUMENTO (Esquema NoSQL)
// ==========================================
// Así le decimos a Mongo qué forma tienen nuestros expedientes
const esquemaSujeto = new mongoose.Schema({
    nombre: { type: String, required: true },
    origen: String,
    rol: String,
    estado: String,
    ultimaAparicion: String,
    curiosidades: String,
    imagen: String,
    imagenLocal: String
});

// Creamos el modelo basado en el esquema
const Sujeto = mongoose.model('Sujeto', esquemaSujeto);

// ==========================================
// 4. RUTAS DE COMUNICACIÓN (Endpoints)
// ==========================================

// RUTA GET: React usa esto para PEDIR todos los expedientes
app.get('/api/sujetos', async (req, res) => {
    try {
        const sujetos = await Sujeto.find(); // Extrae todo de la bóveda
        res.json(sujetos); // Se los envía a React
    } catch (error) {
        res.status(500).json({ mensaje: "Error al extraer los documentos" });
    }
});

// RUTA POST: React usa esto para GUARDAR un nuevo expediente
app.post('/api/sujetos', async (req, res) => {
    try {
        const nuevoSujeto = new Sujeto(req.body); // Toma los datos enviados por React
        const sujetoGuardado = await nuevoSujeto.save(); // Los sella en la Bóveda
        res.status(201).json(sujetoGuardado); // Confirma el guardado exitoso
    } catch (error) {
        res.status(400).json({ mensaje: "Datos rechazados por la Aduana", error });
    }
});

// RUTA DELETE: React usa esto para ELIMINAR un expediente por su ID
app.delete('/api/sujetos/:id', async (req, res) => {
    try {
        const idMongo = req.params.id;
        await Sujeto.findByIdAndDelete(idMongo); // Ordena a la bóveda destruir el documento
        res.status(200).json({ mensaje: "Expediente purgado con éxito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al intentar destruir el documento", error });
    }
});

// ==========================================
// 5. ENCENDIDO DEL SISTEMA
// ==========================================
app.listen(PUERTO, () => {
    console.log(`[ SISTEMA ONLINE ] Aduana operando y escuchando en el puerto ${PUERTO}`);
});
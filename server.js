const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Contact = require("./src/models/contact");
const path = require("path");
const getPublicIPAddress = require("./src/utils/getIP");
const updateEnv = require("./src/utils/updateEnv");

dotenv.config();

// Actualizar IP pública antes de iniciar el servidor
(async () => {
  const ip = await getPublicIPAddress();
  if (ip) {
    updateEnv("IP_HOST", ip);
    process.env.IP_HOST = ip; // también la actualizamos en tiempo real
  }

  const app = express();
  const PORT = process.env.PORT || 3001;
  
  app.use(cors());
  app.use(express.json());
  
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.error("Error al conectar con MongoDB:", err));

  // Servir archivos estáticos (HTML, CSS, JS) desde /public
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.post("/api/contact", async (req, res) => {
    
    const { nombre, correo, ciudad } = req.body;
    
    if (!nombre || !correo || !ciudad) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    try {
      const contact = new Contact({ nombre, correo, ciudad });
      await contact.save();
      res.status(201).json({ message: "Formulario recibido y guardado." });
    } catch (error) {
      res.status(500).json({ error: "Error al guardar los datos." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    app.get("/api/ip", (req, res) => {
      res.json({ ip: process.env.IP_HOST || req.hostname });
    });
  }
  
  // Ruta por defecto: sirve index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
  
  app.use((err, req, res, next) => {
    console.error("Error no manejado:", err.stack); // Log interno
    res.status(500).json({ message: "Error interno del servidor." }); // Respuesta genérica
  });

  app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Servidor corriendo en http://${process.env.IP_HOST}:${PORT}`);
    }
  });
})();
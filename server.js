const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Contact = require("./src/models/contact");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error al conectar con MongoDB:", err));

  // Servir archivos estáticos (HTML, CSS, JS) desde /public
app.use(express.static(path.join(__dirname, 'public')));

app.post("/api/contact", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: "Formulario recibido y guardado." });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar los datos." });
  }
});

// Ruta por defecto: sirve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

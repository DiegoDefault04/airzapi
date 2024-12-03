const mongoose = require('mongoose');
const Counter = require("./Counter");

const datosSchema = new mongoose.Schema({
  ID: { type: Number, unique: true }, // El ID será único y automático
  NombreVivienda: String,
  TipoVivienda: String,
  Estado: String,
  Habitaciones: Number,
  Baños: Number,
  Muebles: String,
  Precio: Number,
  SuperficieTotal: Number,
  SuperficieUtil: Number,
  PrecioPorMetroCuadrado: String,
  CertificadoEnergetico: String,
  AñoConstruccion: Number,
  UbicacionCalle: String,
  UbicacionPiso: String,
  CodigoPostal: String,
  Localidad: String,
  Provincia: String,
  Distrito: String,
  Barrio: String,
  GastosComunidad: Number,
  Calefaccion: String,
  Garage: String,
  Trastero: String,
  BalconTerrace: String,
  Piscina: String,
  Jardin: String,
  Planta: String,
  Ascensor: String,
  Orientacion: String,
  NotaAgente: String,
  Fotografias: [String],
});

datosSchema.pre("save", async function (next) {
  const doc = this;

  if (!doc.isNew) {
    return next();
  }

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "datosID" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // Crear el documento si no existe
    );

    doc.ID = counter.seq;
    next();
  } catch (error) {
    next(error);
  }
});

const Datos = mongoose.model("Datos", datosSchema);

module.exports = Datos;

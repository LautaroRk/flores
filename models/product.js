const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({

    // Especies (rosa, lilium, etc)
    species: {
        type: ObjectId,
        ref: 'Species',
        required: true
    },
    // Nombre botánico
    botanic_name: {
        type: String,
        trim: true,
        required: false,
        unique: 32
    },
    // Variedad/Color
    variety: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    // Descripcion (datos aproximados):
    // epoca de floracion / duracion / tiempo de apertura / pimpollos x tallo 
    description: {
        type: String,
        required: false,
        maxlength: 2000
    },
    // Cantidad de varas por paquete
    quantity: {
        type: Number,
        required: true
    },
    // Precio
    price: {
        type: Number,
        required: true,
        maxlength: 32
    },
    // Foto
    photo: {
        data: Buffer,
        contentType: String
    },
    // Disponible actualmente ( true/false )
    is_available: {
        required: true,
        default: false,
        type: Boolean
    },
    // Altura aproximada del tallo
    stem_height: {
        type: Number,
        required: false,
        maxlength: 32
    },
    // Cantidad de paquetes vendidos
    sold: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
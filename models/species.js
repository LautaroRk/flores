const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true,
        unique: 32
    }

}, { timestamps: true });

module.exports = mongoose.model("Species", speciesSchema);
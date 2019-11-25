const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
require('dotenv').config();

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const speciesRoutes = require('./routes/species');
const productRoutes = require('./routes/product');

// app
const app = express();

// db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log( "Base de datos conectada" ));

// middlewares
app.use( morgan('dev') );
app.use( bodyParser.json() );
app.use( cookieParser() );
app.use( expressValidator() );
app.use( cors() );

// routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", speciesRoutes);
app.use("/api", productRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
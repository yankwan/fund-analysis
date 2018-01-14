const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Init App
const app = express();

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// static file
app.use(express.static(path.join(__dirname, 'dist')));


// Router
const eda = require('./router/eda_router');
app.use('/eda', eda);

const em = require('./router/em_router');
app.use('/em', em);

// Start Server
app.listen(3000, () => {
    console.log('Server started on port 3000');
})




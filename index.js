const express = require('express');
require('dotenv').config();
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const router = require('./backend/routes/router');

const app = express();
const PORT = process.env.PORT || 3000;
const swaggerSpec = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node API',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:9999'
            }
        ]
    },
    apis: [`${path.join(__dirname, './backend/routes/router.js')}`]
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/frontend/views/pages'));

app.use(express.static(path.join(__dirname, '/frontend/static')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/', router);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

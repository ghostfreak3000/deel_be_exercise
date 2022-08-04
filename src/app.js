const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
const routes = require('./routes/routes')

app.use('/contracts',routes.contracts)
app.use('/jobs',routes.jobs)
app.use('/balances',routes.balances)
app.use('/admin',routes.admin)

module.exports = app;

const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const app = express();
const sequelize = require('./util/database');
const cors = require('cors');

app.set('view engine', 'ejs');
app.set('views', 'views');

const routes = require('./routes/routes');

app.use(bodyparser.json({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(routes);

sequelize
.sync()
.then(result=>{
    app.listen(4000);
})
.catch(err=>console.log(err));



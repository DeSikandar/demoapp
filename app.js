require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const pgp = require('pg-promise')();
const expressLayout = require('express-ejs-layouts');

const Employee = require('./models/employe');

const db = pgp(
  `postgres://${process.env.postgresuser}:${process.env.postgrespass}@localhost:5432/nodeapps`
);

const app = express();

//static
app.use(express.static(__dirname + '/public'));

app.use(expressLayout);
app.set('view engine', 'ejs');

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/', async (req, res) => {
  const emp = await Employee.find();
  const employe = await db.any('select * from employee');

  res.render('index', { emp: emp, employe: employe });
});

app.post('/register', (req, res) => {
  const emp = new Employee({
    name: req.body.name,
    email: req.body.email,
  });

  emp
    .save()
    .then(() => {
      console.log('employee added success');
    })
    .catch((error) => {
      throw error;
    });

  db.none('insert into employee(name,email) values(${name},${email})', {
    name: req.body.name,
    email: req.body.email,
  })
    .then((rs) => console.log(rs))
    .catch((error) => {
      throw error;
    });

  res.redirect('/');
  //   res.send(req.body);
});

app.get('/postgres', (req, res) => {
  db.one('select * from employee')
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  res.send('hellow');
});

mongoose
  .connect(
    `mongodb+srv://${process.env.mongo_user}:${process.env.mongo_password}@app.jh4nj.mongodb.net/nodeapp?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(3000, () => {
      console.log('server is running 3000');
    });
  })
  .catch((err) => {
    console.log(err);
  });

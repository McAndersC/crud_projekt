// Requires
const express = require('express');
const path = require('path');
const users = require('./users');

// Constants.
const expressServer = express();

// Express server use(s)
expressServer.use(express.json());
expressServer.use(express.static('client'));
expressServer.use(express.urlencoded({
    extended: true
  }));

// Server Module.
const server = {};

// Route til vores Klient forside.
expressServer.get('/', (req, res) => {
  
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.resolve(__dirname, '../client/index.html'))

})

// Route til vores Klient forside.
expressServer.get('/login', (req, res) => {
  
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.resolve(__dirname, '../client/login.html'))

})

// Route til at hente alle brugere.
expressServer.get('/users/all', (req, res) => {

    users.getUsers( (code, returnObj) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(code);
        res.send(returnObj);
    })
})

// Route to register/post new user.
expressServer.post('/users/register', (req, res) => {

    users.registerUser(req.body, (code, returnObj) => {

        res.setHeader('Content-Type', 'application/json');
        res.status(code);
        res.send(returnObj);

    })
})

expressServer.post('/users/login', (req, res) => {

    users.loginUser(req.body, (code, returnObj) => {

        res.setHeader('Content-Type', 'application/json');
        res.status(code);
        res.send(returnObj);

    })

})

// Starting Express server, making it listen for requests.
server.run = () => {

    console.log('Starter server')

    expressServer.listen(3000, () => {

        console.log('Server er startet, lytter på port 3000');

    })
}

// Exporting our server module object.
module.exports = server;
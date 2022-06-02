const server = require('./lib/server.js');

const app = {}

app.init = () => {

    console.log('Initialisere Applikationen')
    server.run();

}

app.init();
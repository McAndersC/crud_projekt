const server = require('./lib/server.js');

const app = {}

// Vi initialiserer vores applikation.
app.init = () => {

    // Vi kalder run metoden på vores server objekt.
    server.run();

}

app.init();
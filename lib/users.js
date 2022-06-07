
const fs = require("fs");
const users = {};

users.getUsers = (callback) => {

    fs.readFile('./data/users.json', 'utf8', (err, data) => {

        if( err)
        {

            console.log(err);
            return callback(503, {'response' : 'der opstod en fejl'})

        }

        return callback(200, {'response' : JSON.parse(data)});


    })

}

module.exports = users;

const fs = require('fs');
const { v4: uuidv4} = require('uuid');
const users = {};

const userFile = './data/users.json';
const usersFolder = './data/users/';

users.getUsers = (callback) => {

    fs.readFile(userFile, 'utf8', (err, data) => {

        if( err)
        {

            console.log(err);
            return callback(503, {'response' : 'der opstod en fejl'})

        }

        return callback(200, JSON.parse(data));


    })

}

users.registerUser = (payload, callback) => {

    const { password, username} = payload;

    fs.readFile(userFile, 'utf8', (err, data) => {

        if(err)
        {
            return callback(503, {'response' : 'der opstod en fejl'})
        }

        let userList = [];
        userList = JSON.parse(data);

        let user = {
            id: uuidv4(),
            username: username
        }

        userList.push(user);

        fs.writeFile(userFile, JSON.stringify(userList), (err) => {

            if(err) {
                console.log(err)
            }

            fs.writeFile(usersFolder + user.id + '.json', JSON.stringify(payload), (err) => {

                if(err) {
                    console.log(err);
                }
    
                return callback(200, {'response' : 'Bruger er oprettet'})
    
            })


        })
    })
    


}

module.exports = users;
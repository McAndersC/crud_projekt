
const bcrypt = require('bcryptjs');
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

    fs.readFile(userFile, 'utf8', async (err, data) => {

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

        const encryptedPassword = await bcrypt.hash(password, 10)
        payload.password = encryptedPassword;

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

users.loginUser = (payload, callback) => {

    const { password, username} = payload;

    console.log('Payload', payload);

    fs.readFile(userFile, 'utf8', (err, data) => {

        if(err)
        {
            return callback(503, {'response' : 'der opstod en fejl'})
        }

        let userList = [];
        userList = JSON.parse(data);

        let user = userList.find((user) => user.username === username);

        if(user) {

            fs.readFile(usersFolder + user.id + '.json', 'utf8', (err, data) => {

                if(err) {

                    callback(503, {'response' : 'Der opstod en fejl.'})

                }

                let userDetails = JSON.parse(data);
                const compare = bcrypt.compareSync(password, userDetails.password);

                if(compare)
                {
                    let userDetails = JSON.parse(data)
                    console.log(compare, userDetails);

                    return callback(200, {'response' : 'Velkommen', 'data' : userDetails})

                } else {
                    console.log(compare);
                    
                    return callback(401, {'response' : 'Adgang er ikke tilladt'})
                }
           

            })

        } else {

            return callback(401, {'response' : 'Bruger kan ikke findes'})

        }
    })


}

module.exports = users;

const bcrypt = require('bcryptjs');
const fs = require('fs');
const { v4: uuidv4} = require('uuid');
const users = {};

// Globale Stier til filer og mapper.
const userFile = './data/users.json';
const usersFolder = './data/users/';

// Get Users - Her henter vi vores brugere fra vores bruger fil.
users.getUsers = (callback) => {

    // Vi benytter "fs" (filesystem).
    fs.readFile(userFile, 'utf8', (err, data) => {

        if( err)
        {
            // Ved fejl læsning sender vi en fejlbesked retur.
            return callback(503, {'response' : 'der opstod en fejl'})

        }

        // hvis alt er OK så sender vi 200 status ok og selve bruger data`en.
        // Console.log(JSON.parse(data))
        return callback(200, JSON.parse(data));


    })

}

// Register User - Her opretter vi nye brugere til systemet.
users.registerUser = (payload, callback) => {

    // Fra voers payload udtrækker vi to værdier. password og username.
    const { password, username} = payload;

    // Vi indæser vores bruger fil for at undersøge om brugeren vi opdaterer allerede eksisterer.
    fs.readFile(userFile, 'utf8', async (err, data) => {
        
        // Ved fejllæsning sender vi en fejl status.
        if(err)
        {
            return callback(503, {'response' : 'der opstod en fejl'})
        }

        // Her samler vi en ny liste af brugere og putter vores data fra filen i.
        let userList = [];
        userList = JSON.parse(data);

        //Vi undersøger først hvorvidt vores nye´s brugers brugernavn allerede er i brug.
        let userNameExists = userList.find((user) => user.username === username);

        if(!userNameExists)
        {
            // Vi opretter et user object og tildeler brugeren et id.
            let user = {
                id: uuidv4(),
                username: username
            }

            // Vi skubber vores nye bruger ind i userListen.
            userList.push(user);

            // Vi kryptere password så dette password ikke står som "clear text" i databasen.
            // Vi vil undgå at man ved at stjæle data´en.
            const encryptedPassword = await bcrypt.hash(password, 10)
            
            // Vi tilføjer det krypteret password til svores payload.
            payload.password = encryptedPassword;

            // Nu skriver vi vores brugerfil igen (users.json) med vores nye bruger.
            fs.writeFile(userFile, JSON.stringify(userList), (err) => {

                if(err) {
                    console.log(err)
                }

                // Vi skriver/overskriver brugeres detalje fil.
                fs.writeFile(usersFolder + user.id + '.json', JSON.stringify(payload), (err) => {

                    if(err) {
                        console.log(err);
                    }

                    // Vi sender en retur besked hvis alt er godt.
                    return callback(200, {'response' : 'Bruger er oprettet'})

                })


            })
        } else {

            // Vi har undersøgt og brugeren kan ikke oprettets.
            return callback(201, {'response' : 'Bruger kan ikke oprettes, brugernavnet er i brug.'})
        }

       
    })
}

// Login User - Dette endpoint er til at logge brugeren ind.
users.loginUser = (payload, callback) => {

    //Vi trækker værdierne password, username ud af vores payload.
    const { password, username} = payload;

    // Vi læser vores brugerfil
    fs.readFile(userFile, 'utf8', (err, data) => {

        if(err)
        {
            return callback(503, {'response' : 'der opstod en fejl'})
        }

        // Her samler vi en ny liste af brugere og putter vores data fra filen i.
        let userList = [];
        userList = JSON.parse(data);

        //Vi undersøger først om der eksistere en bruger med det pågældende brugernavn,
        let user = userList.find((user) => user.username === username);

        // Hvis brugeren eksistere så kan 
        if(user) {

            // Vi indæser brugerens detaljer for at få fat i det krypteret password.
            fs.readFile(usersFolder + user.id + '.json', 'utf8', (err, data) => {

                if(err) {

                    callback(503, {'response' : 'Der opstod en fejl.'})

                }

                // Vi samler og parser brugers detaljer i en userDetails variabel. 
                let userDetails = JSON.parse(data);
                
                // Vi benytter bcrypt til at sammeligne det indkomne password med det krypteret password.
                const compare = bcrypt.compareSync(password, userDetails.password);

                // Hvis passwordet er godkendt kan vi logge brugeren ind, ellers sender vi en authentication error code tilbage.
                if(compare)
                {

                    return callback(200, {'response' : 'Velkommen', 'data' : userDetails})

                } else {
    
                    
                    return callback(401, {'response' : 'Adgang er ikke tilladt'})
                }
           

            })

        } else {

            return callback(401, {'response' : 'Bruger kan ikke findes'})

        }
    })

}

// Update User - Dette endpoint er til at opdatere brugeren.
users.updateUser = (payload, callback) => {

    /* 
   
        Fra en form vil vi gerne kunne opdatere vores bruger.
        
        1. Brugeren skal kunne opdatere sin email addresse.

   */

    // Fra voers payload udtrækker vi tre værdier. username, name og email.
    const { username, email } = payload;

    // Vi læser vores brugerfil
    fs.readFile(userFile, 'utf8', (err, data) => {

        if(err)
        {
            return callback(503, {'response' : 'der opstod en fejl'})
        }

        // Her samler vi en ny liste af brugere og putter vores data fra filen i.
        let userList = [];
        userList = JSON.parse(data);

        //Vi undersøger først om der eksistere en bruger med det pågældende brugernavn,
        let user = userList.find((user) => user.username === username);

        if(user)
        {

            fs.readFile(usersFolder + user.id + '.json', 'utf8', (err, data) => {

                if(err) {

                    callback(503, {'response' : 'Der opstod en fejl.'})

                }

                // Vi samler og parser brugers detaljer i en userDetails variabel. 
                let userDetails = JSON.parse(data);
                userDetails.email = email;

                // Vi skriver/overskriver brugeres detalje fil.
                fs.writeFile(usersFolder + user.id + '.json', JSON.stringify(userDetails), (err) => {

                    if(err) {
                        console.log(err);
                    }

                    // Vi sender en retur besked hvis alt er godt.
                    return callback(200, {'response' : 'Bruger er opdateret'})

                });
           

            })

        
        }


    });

}

// Delete User - Dette endpoint er til at slette brugeren.
users.deleteUser = (payload, callback) => {

    /* 
   
        Fra en form vil vi gerne kunne slette vores bruger.
        
        1. Brugeren skal slettes fra users.json
        2. Brugerens detalje fil (1221-1212-1221-2122.json) skal slettets.

   */
   
    const { username } = payload;

    // Vi læser vores brugerfil
    fs.readFile(userFile, 'utf8', (err, data) => {

        if(err)
        {
            return callback(503, {'response' : 'der opstod en fejl'})
        }

        // Her samler vi en ny liste af brugere og putter vores data fra filen i.
        let userList = [];
        userList = JSON.parse(data);

        //Vi undersøger først om der eksistere en bruger med det pågældende brugernavn,
        let user = userList.find((user) => user.username === username);
        let userIndex = userList.findIndex((user) => user.username === username);

        // Hvis brugeren eksistere så kan 
        if(user) {

            let userListLeffOver = userList.splice(userIndex, userIndex + 1); // eslint-disable-line no-unused-vars

            // Nu skriver vi vores brugerfil igen (users.json) med vores nye bruger.
            fs.writeFile(userFile, JSON.stringify(userList), (err) => {
    
                if(err) {
                    console.log(err)
                }
    
                // Vi sletter brugerens details fil, hvis alt er godt.
                fs.unlinkSync(usersFolder + user.id + '.json')
                return callback(200, {'response' : `Brugeren med brugernavn ${username} er slettet.`})
            })

        } else {

            // Vi har undersøgt og brugeren kan ikke oprettets.
            return callback(201, {'response' : 'Bruger kan ikke slettes, brugernavnet findes ikke.'})
        }

      


    });


 


}

module.exports = users;
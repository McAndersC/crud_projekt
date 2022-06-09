


// Metode til at sender vores nye bruger til vores endpoint.
const submitNewUser = (e) => {

    let form = document.querySelector('#userform');

    // Forhindre vorew event i at udføre default. (vi tager over herfra)
    e.preventDefault();

    // Samler vores input vir form.elements.
    let formInputs = form.elements;

    // Opretter et nyt user objekt
    let newUser =  {
        'username': formInputs['username'].value,
        'name' : formInputs['name'].value,
        'email' : formInputs['email'].value,
        'password' : formInputs['password'].value
    }

    // Benytter fetch til at POST(e) vores newUser objekt til vores endpoint (localhost:3000/users/register)
    fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    }).then((response) => response.json()).then((response) => {

        console.log(response);
        listUsers();

    })

}

// Metode til at logge ind.
const loginUser = (e) => {

  
    e.preventDefault();

    let userLoginForm = e.currentTarget;

    // Samler vores input vir form.elements.
    let userLoginFormInputs = userLoginForm.elements;

    let user =  {
        'username': userLoginFormInputs['username'].value,
        'password' : userLoginFormInputs['password'].value
    }

    // Benytter fetch til at POST(e) vores newUser objekt til vores endpoint (localhost:3000/users/register)
    fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)

    }).then((response) => response.json()).then((response) => {

        // Denne besked skal vi vise brugeren.
        console.log(response.response);
        
    })

}

const listUsers = () => {

    // Benytter fetch til at GET(e) alle vores "users" fra vores endpoint (localhost:3000/users/all).
    let usersContainer = document.querySelector('.list-users-container');
    if(usersContainer)
    {
        fetch('http://localhost:3000/users/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json()).then((response) => {
    
            let usersContainer = document.querySelector('.list-users-container');
            usersContainer.innerHTML = '';
        
            var unorderList = document.createElement('ul')
            let list = usersContainer.insertAdjacentElement('beforeend', unorderList);
            let users = response;
    
            users.forEach((user) => {
                list.insertAdjacentHTML('beforeend', `<li>${user.id} - ${user.username}</li>`)
            })
        })
    }


}


let client = {};

client.init = () => {

    // Benytter disse til at tjekke om vi skal lytter på den ene form eller den anden.
    // Hvis formen er tilstede så tilføjer vi en eventlistner

    let form = document.querySelector('#userform');
    let userLoginform = document.querySelector('#userLoginform');
    
    if(form)
    {
        form.addEventListener('submit', submitNewUser);
    }

    if(userLoginform) {
        userLoginform.addEventListener('submit', loginUser);
    }

    
    listUsers();
}

client.init()
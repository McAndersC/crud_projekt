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

        // Denne besked skal vi vise brugeren.
        showResponse(response.response);
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
        showResponse(response.response);
        
    })

}

// Metode til at opdatere bruger.
const updateUser = (e) => {
    e.preventDefault();

    let userUpdateForm = e.currentTarget;

    // Samler vores input vir form.elements.
    let userUpdateFormInputs = userUpdateForm.elements;

    let user =  {
        'username': userUpdateFormInputs['username'].value,
        'email' : userUpdateFormInputs['email'].value
    }

    // Benytter fetch til at POST(e) vores newUser objekt til vores endpoint (localhost:3000/users/register)
    fetch('http://localhost:3000/users/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)

    }).then((response) => response.json()).then((response) => {

        // Denne besked skal vi vise brugeren.
        showResponse(response.response);
        
    });

}

// Metode til at slette bruger.
const deleteUser = (e) => {
    e.preventDefault();

    let userUpdateForm = e.currentTarget;

    // Samler vores input vir form.elements.
    let userUpdateFormInputs = userUpdateForm.elements;

    let user =  {
        'username': userUpdateFormInputs['username'].value
    }

    // Benytter fetch til at POST(e) vores newUser objekt til vores endpoint (localhost:3000/users/register)
    fetch('http://localhost:3000/users/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)

    }).then((response) => response.json()).then((response) => {

        // Denne besked skal vi vise brugeren.
        showResponse(response.response);
        listUsers();
    });

}

// Metode til at vise response beskeden.
const showResponse = (response) => {

    let status = document.querySelector('.status-bar');
    status.textContent = response;
    status.classList.add('active');

    setTimeout(() => {
        status.classList.remove('active');
    }, 3000)

}

// Metode til at liste brugerer hvis der er en <div class="list-users-container"></div> på siden..
const listUsers = () => {

    // Benytter fetch til at GET(e) alle vores "users" fra vores endpoint (localhost:3000/users/all).
    let usersContainer = document.querySelector('.list-users-container');

    const listRowHeaderTmpl = `
        <div class="list-users-row">
            <div><strong>ID</strong></div>
            <div><strong>USERNAME</strong></div>
        </div>
    `;

    const listRowItemTmpl = (id, username) => `
        <div class="list-users-row">
            <div>${id}</div>
            <div>${username}</div>
        </div>
    `;

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
        
            var unorderList = document.createElement('div');
            let list = usersContainer.insertAdjacentElement('beforeend', unorderList);

            let users = response;
            list.insertAdjacentHTML('beforeend', listRowHeaderTmpl);

            users.forEach((user) => {
                list.insertAdjacentHTML('beforeend', listRowItemTmpl(user.id, user.username))
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
    let userUpdateform = document.querySelector('#userUpdateForm');
    let userDeleteform = document.querySelector('#userDeleteForm');

    let navBar = document.querySelector('.nav-bar');
    
    if(form)
    {
        form.addEventListener('submit', submitNewUser);
    }

    if(userLoginform) {
        userLoginform.addEventListener('submit', loginUser);
    }

    if(userUpdateform)
    {
        userUpdateform.addEventListener('submit', updateUser);
    }

    if(userDeleteform)
    {
        userDeleteform.addEventListener('submit', deleteUser);
    }
    
    if(navBar) 
    {
        navBar.insertAdjacentHTML('beforeend', `
            <a href="/">Forside</a>
            <a href="/Login">Login</a>

            <a href="/create">(C)reate</a>
            <a href="/read">(R)ead</a>
            <a href="/update">(U)pdate</a>
            <a href="/delete">(D)elete</a>
        `)
    }

    listUsers();
    
}

client.init()
let form = document.querySelector('#userform');
let userLoginform = document.querySelector('#userLoginform');


// Metode til at sender vores nye bruger til vores endpoint.
const submitNewUser = (e) => {

    // Forhindre vorew event i at udføre default. (vi tager over herfra)
    e.preventDefault();

    // Samler vores input vir form.elements.
    let formInputs = form.elements;

    // Opretter et nyt user objekt
    let newUser =  {
        'id' : 'fra clienten html',
        'username': formInputs['username'].value,
        'name' : formInputs['name'].value,
        'email' : formInputs['email'].value
    }

    // Benytter fetch til at POST(e) vores newUser objekt til vores endpoint (localhost:3000/users/register)
    fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    }).then((response) => response.json()).then((response) => console.log(response))

}

const loginUser = (e) => {
    e.preventDefault();
    let formLoginInputs = userLoginform.elements;

    console.log('ladidaaaa', formLoginInputs);
}

// Opretter en event listner der lytter på om vores form bliver submitted.
if(form)
{
    form.addEventListener('submit', submitNewUser);
}

if(userLoginform) {
    userLoginform.addEventListener('submit', loginUser);
}

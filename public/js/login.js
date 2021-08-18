
const login = async (email, password) => {
    console.log(email, password);
    try {    
        const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:8080/',
        data: {
            email,
            password,
        }
        });
        console.log(res);
    } catch (err) {
        console.log(err);
    }
};

document.querySelector('#login-form').addEventListener('submit', e => {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
    

});


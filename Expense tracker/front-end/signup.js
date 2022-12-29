const myform = document.getElementById('myform')
const username = document.getElementById('username');
const password = document.getElementById('password');
const email = document.getElementById('email');
const alert_div = document.getElementById('alert_div');

myform.addEventListener('submit', function (e) {
    e.preventDefault();

    if (username.value == '' || password.value == '' || email.value == '') {
        alert_div.style.display = 'block';
        setTimeout(() => {
            alert_div.style.display = 'none';
        }, 2000);
    }
    else {
        axios.post('http://localhost:4000/user-signup', { name: username.value, password: password.value, email: email.value })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => console.log(err));
    }

})
const myform = document.getElementById('myform')
const password = document.getElementById('password');
const email = document.getElementById('email');
const alert_div = document.getElementById('alert_div');

myform.addEventListener('submit', function (e) {
    e.preventDefault();

    if (password.value == '' || email.value == '') {
        alert_div.innerHTML = 'Please enter all the fields!'
        alert_div.classList.add('alert-danger');
        alert_div.style.display = 'block';
        setTimeout(() => {
            alert_div.style.display = 'none';
            alert_div.classList.remove('alert-danger');
        }, 3000);
    }
    else {
        axios.post('http://localhost:4000/user-login', { password: password.value, email: email.value })
            .then(res => {
                if(res.data == 'password success') {
                    alert_div.innerHTML = 'Authenticated successfully!'
                    alert_div.classList.add('alert-success');
                    alert_div.style.display = 'block';
                    setTimeout(() => {
                        alert_div.style.display = 'none';
                        alert_div.classList.remove('alert-success');
                    }, 2000);
                }
                else if(res.data == 'password fail'){
                    alert_div.innerHTML = 'Incorrect password!'
                    alert_div.classList.add('alert-danger');
                    alert_div.style.display = 'block';
                    setTimeout(() => {
                        alert_div.style.display = 'none';
                        alert_div.classList.remove('alert-danger');
                    }, 2000);
                }
                else{
                    alert_div.innerHTML = "User doesn't exist!"
                    alert_div.classList.add('alert-danger');
                    alert_div.style.display = 'block';
                    setTimeout(() => {
                        alert_div.style.display = 'none';
                        alert_div.classList.remove('alert-danger');
                    }, 2000);
                }
            })
            .catch(err => console.log(err));
    }

})
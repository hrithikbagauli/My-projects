const myform = document.getElementById('myform')
const username = document.getElementById('username');
const password = document.getElementById('password');
const email = document.getElementById('email');
const alert_div = document.getElementById('alert_div');

myform.addEventListener('submit', function (e) {
    e.preventDefault();
    if (username.value == '' || password.value == '' || email.value == '') {
        alert_div.innerHTML = 'Please enter all the fields!'
        alert_div.classList.add('alert-danger');
        alert_div.style.display = 'block';
        setTimeout(() => {
            alert_div.style.display = 'none';
            alert_div.classList.remove('alert-danger');
        }, 3000);
    }
    else {
        axios.post('http://localhost:4000/user-signup', { name: username.value, password: password.value, email: email.value })
            .then(res => {
                alert_div.innerHTML = 'Account created successfully!'
                alert_div.classList.add('alert-success');
                alert_div.style.display = 'block';
                setTimeout(() => {
                    alert_div.style.display = 'none';
                    alert_div.classList.remove('alert-success');
                    window.location.href = "../html/login.html";
                }, 1000);
            })
            .catch(err => {
                alert_div.innerHTML = 'This user already exists!'
                alert_div.classList.add('alert-danger');
                alert_div.style.display = 'block';
                setTimeout(() => {
                    alert_div.style.display = 'none';
                    alert_div.classList.remove('alert-danger');
                }, 3000);
            });
    }

})
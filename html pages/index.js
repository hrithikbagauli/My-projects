const myform = document.getElementById('myform');
const username = document.getElementById('name');
const phone = document.getElementById('contact');
const email = document.getElementById('email');
const ul = document.getElementById('items');

document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault();
    axios.get('http://localhost:4000')
        .then(res => {
            res.data.forEach(i => {
                showOnScreen(i.username, i.email, i.id);
            })
        })
        .catch(err => console.log(err));
})

myform.addEventListener('submit', function (e) {
    e.preventDefault();
    axios.post('http://localhost:4000', { username: username.value, phone: phone.value, email: email.value })
        .then(res => {
            showOnScreen(username.value, email.value, res.data.id);
        })
        .catch(err => console.log(err));
})

function showOnScreen(username, email, id) {
    const li = document.createElement('li');
    li.id = id;
    const editbtn = document.createElement('button');
    editbtn.appendChild(document.createTextNode('Edit'));
    const delbtn = document.createElement('button');
    delbtn.appendChild(document.createTextNode('Delete'));
    li.appendChild(document.createTextNode(`${username} - ${email} `));
    li.appendChild(delbtn);
    li.appendChild(editbtn);
    ul.appendChild(li);

    delbtn.addEventListener('click', function (e) {
        e.preventDefault();
        const item_id = e.target.parentElement.id;
        ul.removeChild(e.target.parentElement);
        axios.post('http://localhost:4000/deleteItem', {id: item_id})
        .catch(err => console.log(err));
    })
}


const myform = document.getElementById('myform');
const expenseamount = document.getElementById('expenseamount');
const description = document.getElementById('description');
const category = document.getElementById('category');
const ul = document.getElementById('items');

document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault();
    axios.get('http://localhost:4000')
        .then(res => {
            res.data.forEach(i => {
                showOnScreen(i.expenseamount, i.description, i.category, i.id);
            })
        })
        .catch(err => console.log(err));
})

myform.addEventListener('submit', function (e) {
    e.preventDefault();
    axios.post('http://localhost:4000', {expenseamount: expenseamount.value, description: description.value, category: category.value})
        .then(res => {
            showOnScreen(expenseamount.value, description.value, category.value, res.data.id);
        })
        .catch(err => console.log(err));
})

function showOnScreen(expenseamount, description, category, id) {
    const li = document.createElement('li');
    li.id = id;
    const editbtn = document.createElement('button');
    editbtn.appendChild(document.createTextNode('Edit'));
    const delbtn = document.createElement('button');
    delbtn.appendChild(document.createTextNode('Delete'));
    li.appendChild(document.createTextNode(`${expenseamount} - ${description} - ${category}`));
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


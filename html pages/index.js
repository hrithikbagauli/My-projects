const myform = document.getElementById('myform');
const expenseamount = document.getElementById('expenseamount');
const description = document.getElementById('description');
const category = document.getElementById('category');
const ul = document.getElementById('items');

document.addEventListener('DOMContentLoaded', async function (e) {
    e.preventDefault();
    const res = await axios.get('http://localhost:4000');
    res.data.forEach(i => {
        showOnScreen(i.expenseamount, i.description, i.category, i.id);
    })
})

myform.addEventListener('submit', function (e) {
    e.preventDefault();
    saveData();
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
        deleteItem(e.target.parentElement, item_id);
    })

    editbtn.addEventListener('click', function (e) {
        e.preventDefault();
        const item_id = e.target.parentElement.id;
        deleteItem(e.target.parentElement, item_id, 'edit');
    })
}

async function deleteItem(target, item_id, mode) {
    ul.removeChild(target);
    const res = await axios.post('http://localhost:4000/deleteItem', { id: item_id })
    if (mode === 'edit') {
        expenseamount.value = res.data.expenseamount;
        description.value = res.data.description;
        category.value = res.data.category;
    }
}

async function saveData() {
    const res = await axios.post('http://localhost:4000', { expenseamount: expenseamount.value, description: description.value, category: category.value })
    showOnScreen(expenseamount.value, description.value, category.value, res.data.id);
}

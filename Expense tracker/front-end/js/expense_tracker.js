const itemname = document.getElementById('itemname');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const myform = document.getElementById('myform');
const items = document.getElementById('items');
const total_spent = document.getElementById('total');
let src;
let isEmpty;

document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault();
    getData();
})

myform.addEventListener('submit', function (e) {
    e.preventDefault();
    if (itemname.value == '' || description.value == '' || amount == '') {
        alert('Please enter all the values');
    }
    else {
        findSource();
        saveData();
    }
})

function showOnScreen(itemname, description, amount, category, img_src, id, total) {
    const tr = document.createElement('tr');
    let rawcontent =
        `<td>
            <div class="d-flex align-items-center">
                <img src="${img_src}" class="rounded-circle"/>
                <div class="ms-3">
                    <p class="fw-bold mb-1">${itemname}</p>
                    <p class="text-muted mb-0">${description}</p>
                </div>
            </div>
        </td>
        <td><input type="text" value="${category}" disabled></td>
        <td><input type="number" value="${amount}" disabled></td>
        <td>
            <button type="button" id="${id}" class="deletebtn btn-danger fw-bold" style="border-radius: 4px;">
                DELETE
            </button>
        </td>`

    tr.innerHTML = rawcontent;
    items.append(tr);
    total_spent.innerHTML = total;
    tr.addEventListener('click', function(e){
        e.preventDefault();
        if(e.target.classList.contains('deletebtn')){
            axios.post('http://localhost:4000/delete-item', {id: e.target.id})
            .then(()=>{
                getData();
            })
            .catch(err=>console.log(err));
        }
    })
}

function saveData() {
    if (isEmpty) {
        items.replaceChildren();
    }
    axios.post('http://localhost:4000/add-expense', { itemname: itemname.value, description: description.value, amount: amount.value, category: category.value, img_src: src })
        .then((res) => {
            isEmpty = false;
            getData();
        })
        .catch(err => console.log(err));
}

function getData() {
    axios.get('http://localhost:4000/get-expenses')
        .then(res => {
            let total = 0;
            if (res.data.length > 0) {
                items.replaceChildren();
                isEmpty = false;
                for (let i = 0; i < res.data.length; i++) {
                    total = total + parseFloat(res.data[i].amount);
                    showOnScreen(res.data[i].name, res.data[i].description, res.data[i].amount, res.data[i].category, res.data[i].img_src, res.data[i].id, total);
                }
            }
            else {
                isEmpty = true;
                total_spent.innerHTML = "0.00"
                items.innerHTML = `<tr><td class="no_expenses_td">No expenses yet!</td></tr>`;
            }
        })
        .catch(err => console.log(err));
}

function findSource() {
    switch (category.value) {
        case "food":
            src = 'https://raw.githubusercontent.com/hrithikbagauli/Practice-repo/ee9743978abdf117ac0d7083783820962f2f217f/food.png';
            break;
        case "entertainment":
            src = 'https://raw.githubusercontent.com/hrithikbagauli/Practice-repo/ee9743978abdf117ac0d7083783820962f2f217f/entertainment.png';
            break;
        case "bills":
            src = 'https://raw.githubusercontent.com/hrithikbagauli/Practice-repo/ee9743978abdf117ac0d7083783820962f2f217f/bill.png';
            break;
        case "travel":
            src = 'https://raw.githubusercontent.com/hrithikbagauli/Practice-repo/ee9743978abdf117ac0d7083783820962f2f217f/travel.png';
            break;
        case "shop":
            src = 'https://raw.githubusercontent.com/hrithikbagauli/Practice-repo/ee9743978abdf117ac0d7083783820962f2f217f/shop.png';
            break;
        case "fuel":
            src = 'https://raw.githubusercontent.com/hrithikbagauli/Practice-repo/ee9743978abdf117ac0d7083783820962f2f217f/fuel.png';
            break;
    }
}

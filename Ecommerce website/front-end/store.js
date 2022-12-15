const maindiv = document.getElementById('main_div');
const show_cart1 = document.getElementById('show_cart1');
const show_cart2 = document.getElementById('show_cart2');
const close_btn = document.getElementById('close_btn');
const cart_div = document.getElementById('cart_div');
const ul = document.getElementById('items');
const notification = document.getElementById('notification');
const notification_span = document.getElementById('notification_span');
const purchase_btn = document.querySelector('.btn-purchase');
const cart_data = new Map();
const total_price = document.querySelector('.cart-total-price');
let total = 0;

document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault();
    axios.get('http://localhost:4000/products')
        .then(res => showOnScreen(res.data))
        .catch(err => console.log(err));

    axios.get('http://localhost:4000/cart')
        .then(res => showOnCart(res.data))
        .catch(err => console.log(err));
})

function showOnScreen(res) {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    div1.className = 'div_items';
    div2.className = 'div_items';
    maindiv.append(div1);
    maindiv.append();
    maindiv.append(div2);
    let rawcontent = '';
    let rawcontent1 = '';

    for (let i = 0; i < res.length; i++) {
        if (res[i].description == 'music') {
            rawcontent = rawcontent +
                `<div class="card">
                        <h1>${res[i].title}</h1>
                        <img class="music_img image" src="${res[i].imageUrl}"><br>
                        <span>$${res[i].price}</span>
                        <button class="card_btn" id="${res[i].id}" data-itemname="${res[i].title}" data-price=${res[i].price} data-img_address="${res[i].imageUrl}">ADD TO CART</button>
                </div>`
        }
        else {
            rawcontent1 = rawcontent1 +
                `<div class="card">
                        <h1>${res[i].title}</h1>
                        <img class="music_img image" src="${res[i].imageUrl}"><br>
                        <span>$${res[i].price}</span>
                        <button class="card_btn" id="${res[i].id}" data-itemname="${res[i].title}" data-price=${res[i].price} data-img_address="${res[i].imageUrl}">ADD TO CART</button>
                </div>`
        }
    }

    div1.innerHTML = rawcontent + '<h2>MERCH</h2>';
    div2.innerHTML = rawcontent1;
}

function showOnCart(res) {
    if (res.length > 0) {
        const cart_items = document.querySelector('.cart-items');
        let rawcontent;

        for (let i = 0; i < res.length; i++) {
            cart_data.set(res[i].title, { price: res[i].price, quantity: 1 });
            const cart_row = document.createElement('div');
            cart_items.append(cart_row);
            cart_row.classList.add('cart-row');
            rawcontent =
                `<div class="cart-item cart-column">
            <img src="${res[i].imageUrl}" width="100" height="100">
            <span class="cart-item-title">${res[i].title}</span>
            </div>
            <span class="cart-price cart-column">${res[i].price}</span>
            <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" value="1" type="text" data-price="${res[i].price}" disabled>
            <button class="deletebtn" id="${res[i].id}" data-itemname="${res[i].title}" data-price="${res[i].price}">REMOVE</button>
            </div><br>`

            total = total + parseFloat(res[i].price);
            total_price.innerHTML = '$' + parseFloat(total).toFixed(2);
            cart_row.innerHTML = cart_row.innerHTML + rawcontent;

            cart_row.addEventListener('click', function (e) {
                e.preventDefault();
                if (e.target.className == 'deletebtn') {
                    const remove_btn = e.target;
                    total = Math.abs(total - remove_btn.dataset.price);
                    total_price.innerHTML = '$' + parseFloat(total).toFixed(2);
                    cart_data.delete(remove_btn.dataset.itemname);
                    remove_btn.parentElement.parentElement.remove();
                    axios.post('http://localhost:4000/cart-delete-item', {productId: remove_btn.id})
                }
            })
        }

    }
    updateCartQuantity();
}

maindiv.addEventListener('click', function (e) {
    e.preventDefault();

    if (e.target.dataset.itemname && e.target.dataset.price && e.target.dataset.img_address) {
        if (!cart_data.has(e.target.dataset.itemname)) {
            axios.post('http://localhost:4000/cart', { productId: e.target.id })
                .catch(err => console.log(err));

            const cart_items = document.querySelector('.cart-items');
            const cart_row = document.createElement('div');
            cart_row.classList.add('cart-row');

            let rawcontent;
            cart_items.append(cart_row);
            cart_data.set(e.target.dataset.itemname, { price: e.target.dataset.price, quantity: 1 });

            rawcontent = `
            <div class="cart-item cart-column">
            <img src="${e.target.dataset.img_address}" width="100" height="100">
            <span class="cart-item-title">${e.target.dataset.itemname}</span>
            </div>
            <span class="cart-price cart-column">${e.target.dataset.price}</span>
            <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" value="1" type="text" data-price="${e.target.dataset.price}" disabled>
            <button class="deletebtn" id="${e.target.id}" data-itemname="${e.target.dataset.itemname}" data-price="${e.target.dataset.price}">REMOVE</button>
            </div>`

            cart_row.innerHTML = rawcontent;
            total = total + parseFloat(e.target.dataset.price);
            total_price.innerHTML = '$' + parseFloat(total).toFixed(2);
            updateCartQuantity();

            cart_row.addEventListener('click', function (e) {
                e.preventDefault();
                if (e.target.className == 'deletebtn') {
                    const remove_btn = e.target;
                    total = Math.abs(total - remove_btn.dataset.price);
                    total_price.innerHTML = '$' + parseFloat(total).toFixed(2);
                    cart_data.delete(remove_btn.dataset.itemname);
                    remove_btn.parentElement.parentElement.remove();
                    axios.post('http://localhost:4000/cart-delete-item', {productId: remove_btn.id})
                }
            })

            notification.style.display = "block";
            notification_span.innerHTML = e.target.dataset.itemname + " is added to cart!";
            setTimeout(() => {
                notification.style.display = "none";
            }, 2000);
        }
        else {
            alert('This item has already been added to the cart!')
        }
    }

})

purchase_btn.addEventListener('click', function (e) {
    e.preventDefault();
    const cart_items = document.querySelector('.cart-items');
    if (cart_items.hasChildNodes()) {
        cart_data.clear();
        cart_items.replaceChildren();
        total = 0;
        total_price.innerHTML = '$0.00';
        alert('Thank you for the purchase!');
        document.getElementById('cart_quantity').innerHTML = '0';
    }
    else {
        alert('Cart is empty!');
    }
})

function updateCartQuantity() {
    document.getElementById('cart_quantity').innerHTML = cart_data.size;
}

close_btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.target.parentElement.style.display = "none";
    updateCartQuantity();
})

show_cart1.addEventListener('click', showCart1);
show_cart2.addEventListener('click', showCart2);

function showCart1(e) {
    e.preventDefault();
    cart_div.style.display = "block";
}

function showCart2(e) {
    e.preventDefault();
    cart_div.style.display = "block";
}












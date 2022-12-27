const maindiv = document.getElementById('main_div');
const show_cart1 = document.getElementById('show_cart1');
const show_cart2 = document.getElementById('show_cart2');
const close_btn = document.getElementById('close_btn');
const cart_div = document.getElementById('cart_div');
const ul = document.getElementById('items');
const notification = document.getElementById('notification');
const notification_span = document.getElementById('notification_span');
const purchase_btn = document.querySelector('.btn-purchase');
const cart_data = new Set();
const total_price = document.querySelector('.cart-total-price');
const pagination_div_cart = document.querySelector('.pagination_div_cart');
const pagination_div = document.querySelector('.pagination_div');

showPaginationButtons(1);

document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault();
    axios.get('http://localhost:4000/products')
        .then(res => {
            showOnScreen(res.data.products);
        })
        .catch(err => console.log(err));

    getCartItems();
})

maindiv.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.dataset.itemname && e.target.dataset.price && e.target.dataset.img_address) {
        if (!cart_data.has(e.target.dataset.itemname)) {
            axios.post('http://localhost:4000/cart', { productId: e.target.id })
                .then(res => {
                    document.getElementById('cart_quantity').innerHTML = res.data.cart_quantity;
                    getCartItems();
                })
                .catch(err => console.log(err));

            const cart_items = document.querySelector('.cart-items');
            const cart_row = document.createElement('div');
            cart_row.classList.add('cart-row');

            let rawcontent;
            cart_items.append(cart_row);
            cart_data.add(e.target.dataset.itemname);

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

            cart_row.addEventListener('click', function (e) {
                e.preventDefault();
                if (e.target.className == 'deletebtn') {
                    const remove_btn = e.target;
                    cart_data.delete(remove_btn.dataset.itemname);
                    remove_btn.parentElement.parentElement.remove();
                    axios.post('http://localhost:4000/cart-delete-item', { productId: remove_btn.id })
                        .then(res => {
                            getCartItems();
                        })
                        .catch(err => console.log(err));
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
        axios.get('http://localhost:4000/create-order')
            .then(res => {
                if (res.data.success == true) {
                    alert(`Order successfully placed with order id - ${res.data.orderId}!`);
                    cart_data.clear();
                    cart_items.replaceChildren();
                    total_price.innerHTML = '$0.00';
                    document.getElementById('cart_quantity').innerHTML = '0';
                }
                getCartItems();
                // axios.get('http://localhost:4000/clear-cart')
                //     .then(res => {
                //         getCartItems();
                //     })
                //     .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }
    else {
        alert('Cart is empty!');
    }
})

close_btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.target.parentElement.style.display = "none";
    updateCartQuantity();
})

show_cart1.addEventListener('click', showCart1);
show_cart2.addEventListener('click', showCart2);

pagination_div.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.className == 'pagination_btn') {
        const page_no = parseInt(e.target.innerText);
        showPaginationButtons(page_no);
    }
})

pagination_div_cart.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.className == 'pagination_btn_cart') {
        const page_no = parseInt(e.target.innerText);
        showCartPaginationButtons(page_no);
    }
})




//functions :-
function getCartItems() {
    axios.get('http://localhost:4000/cart')
        .then(res => {
            document.getElementById('cart_quantity').innerHTML = res.data.cart_quantity;
            total_price.innerHTML = '$' + (res.data.total).toFixed(2);
            showCartPaginationButtons(1);
        })
        .catch(err => console.log(err));
}


function showOnScreen(res) {
    maindiv.replaceChildren();
    const div1 = document.createElement('div');
    div1.className = 'div_items';
    maindiv.append(div1);
    let rawcontent;

    for (let i = 0; i < res.length; i++) {
        const card_div = document.createElement('div');
        card_div.classList.add('card');
        rawcontent =
            `<h1>${res[i].title}</h1>
                <img class="music_img image" src="${res[i].imageUrl}"><br>
                <span>$${res[i].price}</span>
                <button class="card_btn" id="${res[i].id}" data-itemname="${res[i].title}" data-price=${res[i].price} data-img_address="${res[i].imageUrl}">ADD TO CART</button>`

        card_div.innerHTML = rawcontent;
        div1.append(card_div);
    }
}

function showOnCart(res) {
    if (res.length > 0) {
        const cart_items = document.querySelector('.cart-items');
        cart_items.replaceChildren();
        let rawcontent;
        let count = 0;
        total = 0;
        for (let i = 0; i < res.length; i++) {
            cart_data.add(res[i].title);
            const cart_row = document.createElement('div');
            cart_items.append(cart_row);
            cart_row.classList.add('cart-row');
            let item_quantity = 1;
            if(res[i].cartItem.quantity){
                item_quantity = res[i].cartItem.quantity;
            }
            rawcontent =
                `<div class="cart-item cart-column">
            <img src="${res[i].imageUrl}" width="100" height="100">
            <span class="cart-item-title">${res[i].title}</span>
            </div>
            <span class="cart-price cart-column">${res[i].price}</span>
            <div class="cart-quantity cart-column">
            <input type="number" value="${item_quantity}" class="cart-quantity-input" id="${res[i].id} data-price="${res[i].price}">
            <button class="deletebtn" id="${res[i].id}" data-itemname="${res[i].title}" data-price="${res[i].price}">REMOVE</button>
            </div><br>`
            cart_row.innerHTML = rawcontent;

            cart_row.addEventListener('click', function (e) {
                e.preventDefault();
                if (e.target.className == 'deletebtn') {
                    const remove_btn = e.target;
                    cart_data.delete(remove_btn.dataset.itemname);
                    remove_btn.parentElement.parentElement.remove();
                    axios.post('http://localhost:4000/cart-delete-item', { productId: remove_btn.id })
                        .then(res => {
                            getCartItems();
                        })
                        .catch(err => console.log(err));
                }
            })


            const quantity_input = document.getElementsByClassName('cart-quantity-input');
            quantity_input[count].addEventListener('change', function (e) {
                e.preventDefault();
                if (e.target.value > 0) {
                    axios.post('http://localhost:4000/cart', { productId: e.target.id, quantity: e.target.value })
                        .then(res => total_price.innerHTML = '$' + (res.data.total).toFixed(2))
                        .catch(err => console.log(err));
                }
                else{
                    e.target.value = 1;
                }
            })
            count++;
        }

    }
    updateCartQuantity();
}

function updateCartQuantity() {
    axios.get('http://localhost:4000/cart')
        .then(res => {
            document.getElementById('cart_quantity').innerHTML = res.data.cart_quantity;
        })
        .catch(err => console.log(err));
}

function showCart1(e) {
    e.preventDefault();
    getCartItems();
    cart_div.style.display = "block";
}

function showCart2(e) {
    e.preventDefault();
    getCartItems();
    cart_div.style.display = "block";
}

function showPaginationButtons(page_no) {
    axios.get(`http://localhost:4000/products?page=${page_no}`)
        .then(res => {
            const first_page = document.getElementById('first_page');
            const current_page = document.getElementById('current_page');
            const previous_page = document.getElementById('previous_page');
            const next_page = document.getElementById('next_page');
            const last_page = document.getElementById('last_page');
            showOnScreen(res.data.products);
            current_page.innerText = res.data.currentPage;
            if (res.data.currentPage != 1 && res.data.previousPage != 1) {
                first_page.style.display = "inline";
            }
            else {
                first_page.style.display = "none";
            }
            if (res.data.hasPreviousPage) {
                previous_page.innerText = res.data.previousPage;
                previous_page.style.display = "inline";
            }
            else {
                previous_page.style.display = "none";
            }
            if (res.data.hasNextPage) {
                next_page.innerText = res.data.nextPage;
                next_page.style.display = "inline";
            }
            else {
                next_page.style.display = "none";
            }

            if (res.data.lastPage != res.data.currentPage && res.data.lastPage != res.data.nextPage) {
                last_page.innerText = res.data.lastPage;
                last_page.style.display = "inline";
            }
            else {
                last_page.style.display = "none";
            }

        })
        .catch(err => console.log(err));
}

function showCartPaginationButtons(page_no) {
    axios.get(`http://localhost:4000/cart?page=${page_no}`)
        .then(res => {
            const first_page = document.getElementById('cart_first_page');
            const current_page = document.getElementById('cart_current_page');
            const previous_page = document.getElementById('cart_previous_page');
            const next_page = document.getElementById('cart_next_page');
            const last_page = document.getElementById('cart_last_page');
            current_page.innerText = res.data.currentPage;
            if (res.data.currentPage != 1 && res.data.previousPage != 1) {
                first_page.style.display = "inline";
            }
            else {
                first_page.style.display = "none";
            }
            if (res.data.hasPreviousPage) {
                previous_page.innerText = res.data.previousPage;
                previous_page.style.display = "inline";
            }
            else {
                previous_page.style.display = "none";
            }
            if (res.data.hasNextPage) {
                next_page.innerText = res.data.nextPage;
                next_page.style.display = "inline";
            }
            else {
                next_page.style.display = "none";
            }

            if (res.data.lastPage > 0 && res.data.lastPage != res.data.currentPage && res.data.lastPage != res.data.nextPage) {
                last_page.innerText = res.data.lastPage;
                last_page.style.display = "inline";
            }
            else {
                last_page.style.display = "none";
            }

            showOnCart(res.data.products);
        })
        .catch(err => console.log(err));
}
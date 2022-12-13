const maindiv = document.getElementById('main_div');
const show_cart1 = document.getElementById('show_cart1');
const show_cart2 = document.getElementById('show_cart2');
const close_btn = document.getElementById('close_btn');
const cart_div = document.getElementById('cart_div');
const ul = document.getElementById('items');
const notification = document.getElementById('notification');
const notification_span = document.getElementById('notification_span');
const purchase_btn = document.querySelector('.btn-purchase');
const cart_items = document.querySelector('.cart-items');
const cart_data = new Set();
const total_price = document.querySelector('.cart-total-price');
let total = 0;

purchase_btn.addEventListener('click', function (e) {
    alert('Thank you for the purchase!');
})

maindiv.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.dataset.itemname && e.target.dataset.price && e.target.dataset.img_address) {
        if (!cart_data.has(e.target.dataset.itemname)) {
            cart_data.add(e.target.dataset.itemname);
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            const span1 = document.createElement('span');
            const span2 = document.createElement('span');
            const div3 = document.createElement('div');
            const input1 = document.createElement('input');
            const remove_btn = document.createElement('button');
            const img1 = document.createElement('img');
            div1.className = 'cart-row';
            div2.className = 'cart-item cart-column';
            span1.className = 'cart-item-title';
            span2.className = 'cart-price cart-column';
            div3.className = 'cart-quantity cart-column';
            remove_btn.className = 'btn deletebtn';
            input1.className = 'cart-quantity-input';
            img1.src = e.target.dataset.img_address;
            img1.width = 100;
            img1.height = 100;
            span1.appendChild(document.createTextNode(e.target.dataset.itemname));
            span2.appendChild(document.createTextNode(e.target.dataset.price));
            input1.type = 'text';
            input1.value = '1';
            remove_btn.appendChild(document.createTextNode('REMOVE'));
            cart_items.appendChild(div1);
            div1.appendChild(div2);
            div1.appendChild(span2);
            div1.appendChild(div3);
            div2.appendChild(img1);
            div2.appendChild(span1);
            div3.appendChild(input1);
            div3.appendChild(remove_btn);

            input1.setAttribute('price', e.target.dataset.price);
            remove_btn.setAttribute('itemname', e.target.dataset.itemname);
            remove_btn.setAttribute('price', e.target.dataset.price);
            total = total + parseFloat(e.target.dataset.price);
            total_price.innerHTML = '$' + parseFloat(total).toFixed(2);

            remove_btn.addEventListener('click', function (e) {
                e.preventDefault();
                total = total - remove_btn.getAttribute('price');
                total_price.innerHTML = '$' + parseFloat(total).toFixed(2);
                cart_data.delete(remove_btn.getAttribute('itemname'));
                remove_btn.parentElement.parentElement.remove();

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

close_btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.target.parentElement.style.display = "none";
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










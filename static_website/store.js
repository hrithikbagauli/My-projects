const maindiv = document.getElementById('main_div');
const show_cart1 = document.getElementById('show_cart1');
const show_cart2 = document.getElementById('show_cart2');
const close_btn = document.getElementById('close_btn');
const cart_div = document.getElementById('cart_div');
const ul = document.getElementById('items');
const notification = document.getElementById('notification');
const notification_span = document.getElementById('notification_span');

maindiv.addEventListener('click', function(e){
    e.preventDefault();
    if(e.target.dataset.itemname && e.target.dataset.price){
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(e.target.dataset.itemname+" - "+e.target.dataset.price+" - "+1));
        li.style.listStyleType = "none";
        li.style.fontSize = 24;
        ul.appendChild(li);
        notification.style.display = "block";
        notification_span.innerHTML = e.target.dataset.itemname+" is added to cart!";
        setTimeout(() => {
            notification.style.display = "none";
        }, 2000);
    }

})

close_btn.addEventListener('click', function(e){
    e.preventDefault();
    e.target.parentElement.style.display = "none";
})

show_cart1.addEventListener('click', showCart1);
show_cart2.addEventListener('click', showCart2);

function showCart1(e){
    e.preventDefault();
    cart_div.style.display = "block";
}

function showCart2(e){
    e.preventDefault();
    cart_div.style.display = "block";
}










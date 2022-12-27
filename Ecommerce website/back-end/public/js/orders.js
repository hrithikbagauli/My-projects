const ul = document.getElementById('items');

document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault();
    axios.get('http://localhost:4000/orders')
        .then(res => {
            if (res.data.length > 0) {
                let rawcontent1 = '';
                for (let i = res.data.length - 1; i >= 0; i--) {
                    const li = document.createElement('li');
                    rawcontent1 =
                        `<div class="order_header">
                    <h3>
                        <span class="order_placed">Order placed on</span>
                        <span class="order_id">Order ID</span>
                        <br>
                        <span class="order_placed_data">${res.data[i].createdAt.slice(0, 10)}</span>
                        <span class="order_id_data">#${res.data[i].id}</span>
                    </h3>
                    </div>`
                    li.innerHTML = rawcontent1;
                    let rawcontent2 = '';
                    for (let j = 0; j < res.data[i].products.length; j++) {
                        rawcontent2 = rawcontent2 +
                            `<div class="order_item">
                        <img src=${res.data[i].products[j].imageUrl} height="70"
                            width="70">
                        <span class="item_name">${res.data[i].products[j].title}</span>
                        </div>`
                    }
                    li.innerHTML = li.innerHTML + rawcontent2;
                    ul.append(li);
                }
            }
            else {
                const li = document.createElement('li');
                li.innerHTML = '<p> NO ORDERS YET!</p>'
                ul.append(li);
            }
        })
        .catch(err => console.log(err));
})
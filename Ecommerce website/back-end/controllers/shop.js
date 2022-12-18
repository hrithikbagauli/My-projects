const Product = require('../models/product');
const Cart = require('../models/cart');

const items_per_page = 2;

exports.getProducts = (req, res, next) => {
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page);
  }

  Product.findAll()
    .then(products => {
      totalItems = products.length;
      return Product.findAll({ offset: (page - 1) * items_per_page, limit: items_per_page });
    })
    .then(products => {
      res.json({
        products: products,
        currentPage: page,
        hasNextPage: page * items_per_page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / items_per_page)
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  let page = 1;
  let cart_quantity=0;
  let total=0;
  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  
  req.user.getCart()
    .then(cart => {
      cart.getProducts()
      .then(products =>{
        cart_quantity = products.length;
        let sum = 0;
        for(let i=0; i<products.length; i++){
          sum = sum + products[i].price;
        }
        total = sum;
      })
      .then(()=>{
        return cart.getProducts({ offset: (page - 1) * items_per_page, limit: items_per_page})
        .then(products => {
          res.json({
            products: products,
            total: total,
            cart_quantity: cart_quantity,
            currentPage: page,
            hasNextPage: page * items_per_page < cart_quantity,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(cart_quantity / items_per_page)
          });
        }).catch(err => console.log(err));
      }).catch(err => console.log(err)); 
    }).catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.clearCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      return cart.getProducts();
    })
    .then(products => {
      for (let i = 0; i < products.length; i++) {
        products[i].cartItem.destroy();
      }
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};


const Product = require('../models/product');

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

// exports.getProduct = (req, res, next) => {
//   const prodId = req.params.productId;
//   // Product.findAll({ where: { id: prodId } })
//   //   .then(products => {
//   //     res.render('shop/product-detail', {
//   //       product: products[0],
//   //       pageTitle: products[0].title,
//   //       path: '/products'
//   //     });
//   //   })
//   //   .catch(err => console.log(err));
//   Product.findByPk(prodId)
//     .then(product => {
//       res.render('shop/product-detail', {
//         product: product,
//         pageTitle: product.title,
//         path: '/products'
//       });
//     })
//     .catch(err => console.log(err));
// };

// exports.getIndex = (req, res, next) => {
//   Product.findAll()
//     .then(products => {
//       res.render('shop/index', {
//         prods: products,
//         pageTitle: 'Shop',
//         path: '/'
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

exports.getCart = (req, res, next) => {
  let page = 1;
  let cart_quantity = 0;
  let total = 0;
  if (req.query.page) {
    page = parseInt(req.query.page);
  }

  req.user.getCart()
    .then(cart => {
      cart.getProducts()
        .then(products => {
          cart_quantity = products.length;
          let sum = 0;
          for (let i = 0; i < products.length; i++) {
            sum = sum + (products[i].dataValues.cartItem.quantity) * (products[i].price);
          }
          total = sum;
        })
        .then(() => {
          return cart.getProducts({ offset: (page - 1) * items_per_page, limit: items_per_page })
            .then(products => {
              // console.log(products[1].dataValues.cartItem);
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
  let total;
  let product;
  if(req.body.quantity){
    newQuantity = req.body.quantity;
  }
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      if (products.length > 0) {
        product = products[0];
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(() => {
      fetchedCart.getProducts()
      .then(products => {
        let sum = 0;
        for (let i = 0; i < products.length; i++) {
          sum = sum + (products[i].dataValues.cartItem.quantity) * (products[i].price);
        }
        total = sum;
        res.json({total: total});
      })
      .catch(err => console.log(err));
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

// exports.clearCart = (req, res, next) => {
//   req.user.getCart()
//     .then(cart => {
//       return cart.getProducts();
//     })
//     .then(products => {
//       for (let i = 0; i < products.length; i++) {
//         products[i].cartItem.destroy();
//       }
//       res.redirect('/cart');
//     })
//     .catch(err => console.log(err));
// }

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      req.user.createOrder()
        .then(order => {
          order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          }));

          for (let i = 0; i < products.length; i++) {
            products[i].cartItem.destroy();
          }
          res.json({ orderId: order.id, success: true });
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products'] })  //{include: ['products']} because we're telling sequelize that when you get the orders, also get the products associated with that order. Although the model's name is product but since sequelize automatically pluralizes names, hence we've used products here.
    .then(orders => {
      res.json(orders);
    })
    .catch(err => console.log(err))
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};


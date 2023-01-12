exports.postAddExpense = (req, res, next) => {
    req.user.createExpense({ name: req.body.itemname, description: req.body.description, amount: req.body.amount, category: req.body.category, img_src: req.body.img_src })
        .then((result) => {
            res.json(result);
        })
        .catch(err => console.log(err));
}

exports.getExpenses = async (req, res, next) => {
    let page = parseInt(req.query.page);
    let items_per_page = parseInt(req.query.items_per_page);
    let total = 0;
    const expenses = await req.user.getExpenses();
    for (let i = 0; i < expenses.length; i++) {
        total = total + expenses[i].amount;
    }
    let totalItems = expenses.length;
    const result = await req.user.getExpenses({ offset: (page - 1) * items_per_page, limit: items_per_page })
    res.json({
        result: result,
        isPremium: req.user.premiumUser,
        currentPage: page,
        hasNextPage: page * items_per_page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / items_per_page),
        total: total
    });
}

exports.postDeleteItem = (req, res, next) => {
    const id = req.body.id;
    req.user.getExpenses({ where: { id: id } })
        .then(expense => {
            expense[0].destroy()
                .then(() => {
                    res.json('successfully deleted!');
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

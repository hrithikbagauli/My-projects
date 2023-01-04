exports.postAddExpense = (req, res, next)=>{
    req.user.createExpense({name: req.body.itemname, description: req.body.description, amount: req.body.amount, category: req.body.category, img_src: req.body.img_src})
    .then((result)=>{
        res.json(result);
    })
    .catch(err=>console.log(err));
}

exports.getExpenses = (req, res, next)=>{
    req.user.getExpenses()
    .then(result=>{
        res.json({result: result, isPremium: req.user.premiumUser});
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.postDeleteItem = (req, res, next)=>{
    const id = req.body.id;
    req.user.getExpenses({where: {id: id}})
    .then(expense=>{
        expense[0].destroy()
        .then(()=>{
            res.json('successfully deleted!');
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
}

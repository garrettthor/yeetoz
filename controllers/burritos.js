const Burrito = require('../models/burrito');

module.exports.index = async (req, res) => {
    const burritos = await Burrito.find({});
    res.render('burritos/index', { burritos });
};

module.exports.renderNewForm = (req, res) => {
    res.render('burritos/new');
};

module.exports.createBurrito = async (req, res, next) => {
    // Rudimentary logic to detect if the body contains burrito at all
    // if(!req.body.burrito) throw new ExpressError('Invalid Burrito Data', 400);
    const burrito = new Burrito(req.body.burrito);
    burrito.author = req.user._id;
    await burrito.save();
    req.flash('success', 'Successfully made a new burrito!');
    res.redirect(`burritos/${burrito._id}`);
};

module.exports.showBurrito = async (req, res) => {
    const burrito = await (await Burrito.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'));
    if(!burrito){
        req.flash('error', 'Burrito doesn\'t exist...');
        return res.redirect('/burritos');
    }
    res.render('burritos/show', { burrito });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findById(id);
    if (!burrito) {
        req.flash('error', 'Cannot find that burrito');
        return res.redirect('/burritos');
    }
    res.render('burritos/edit', { burrito });
};

module.exports.updateBurrito = async (req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findByIdAndUpdate(id, { ...req.body.burrito }, { useFindAndModify: false });
    req.flash('success', 'Successfully updated burrito!')
    res.redirect(`${burrito._id}`);
};

module.exports.deleteBurrito = async (req, res) => {
    const { id } = req.params;
    await Burrito.findByIdAndDelete(id, { useFindAndModify: false });
    req.flash('success', 'Successfully YEETed the burrito!  Get outa here!');
    res.redirect('/burritos');
};
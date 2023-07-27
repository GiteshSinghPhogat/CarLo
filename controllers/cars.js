const Car = require('../models/car');
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res) => {
    const cars = await Car.find({});
    res.render('cars/index', { cars });
}

module.exports.renderNewForm = (req, res) => {
    res.render('cars/new')
}

module.exports.createCar = async (req, res) => {
    // if (!req.body.car) throw new ExpressError('Invalid Car data', 400);
    const car = new Car(req.body.car);
    car.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    car.author = req.user._id;
    await car.save();
    req.flash('success', 'Successfully added a new car');
    res.redirect(`/cars/${car._id}`);
}

module.exports.showCar = async (req, res) => {
    const cars = await Car.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');

    if (!cars) {
        req.flash('error', "Car don't exist.");
        return res.redirect('/cars');
    }
    res.render('cars/show', { cars });
}

module.exports.renderEditForm = async (req, res) => {
    const car = await Car.findById(req.params.id);
    if (!car) {
        req.flash('error', "Car don't exist.");
        return res.redirect('/cars');
    }
    res.render('cars/edit', { car });
}

module.exports.updateCar = async (req, res) => {
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));

    const ucar = await Car.findByIdAndUpdate(req.params.id, { ...req.body.car });
    ucar.images.push(...imgs);
    await ucar.save();
    if (req.body.deleteImg) {
        for (let filename of req.body.deleteImg) {
            await cloudinary.uploader.destroy(filename);
        }
        await ucar.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImg } } } });
        // console.log(ucar);
    }
    req.flash('success', 'Successfully Updated');
    res.redirect(`/cars/${req.params.id}`);
}

module.exports.deleteCar = async (req, res) => {
    const { id } = req.params;
    await Car.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted car');
    res.redirect('/cars');
}

module.exports.myCar = async (req, res) => {
    const cars = await Car.find({});
    res.render('cars/mycar', { cars });
}
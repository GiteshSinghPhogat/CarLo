const express = require('express');
const router = express.Router();
const catchAsync = require('../utilis/catchAsync')
const Car = require('../controllers/cars');
const { isLoggedIn, validateCar, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(Car.index))
    .post(isLoggedIn, upload.array('image'), validateCar, catchAsync(Car.createCar));
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("HEllo");
// })


router.get('/new', isLoggedIn, Car.renderNewForm);
router.get('/mycar', Car.myCar);

router.route('/:id')
    .get(catchAsync(Car.showCar))
    .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(Car.updateCar))
    .delete(catchAsync(Car.deleteCar));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(Car.renderEditForm));

module.exports = router;
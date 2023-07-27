const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilis/catchAsync')
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const Review = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, catchAsync(Review.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(Review.deleteReview));

module.exports = router;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const User = require('./user');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const carSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

carSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        console.log(doc.reviews)
        const car = await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
        console.log(car)
    }
})

module.exports = mongoose.model('Car', carSchema);
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
//credentials for our cloudinary accound
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET 
})
//storage specifications
const storage = new CloudinaryStorage({
    cloudinary, 
    params: {
        folder: 'YelpCamp',
        allowedFormats:['jpeg', 'png', 'jpg']
    }
})

module.exports = { 
    cloudinary, 
    storage
}
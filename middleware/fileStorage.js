//Core
const path = require('path');
//Middleware
const multer = require('multer');

//Declare storage for saving temp files
const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'temp');
	},

	filename(req, file, cb) {
		const ext = path.parse(file.originalname).ext;
		cb(null, Date.now() + ext);
	},
});

//Filter files mimetype
const fileFilter = (req, file, cb) => {
	const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

	allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

module.exports = multer({
	storage,
	fileFilter,
});

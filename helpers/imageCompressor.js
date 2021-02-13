//Core
const fsPromises = require('fs/promises');
//Middleware
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

async function imageCompressor(imageFile) {
	try {
		const sourceDir = process.env.SOURCE_DIR + imageFile;

		await imagemin([sourceDir], {
			destination: process.env.TARGET_DIR,
			plugins: [
				imageminJpegtran(),
				imageminPngquant({
					quality: [0.3, 0.5],
				}),
			],
		});

		await fsPromises.unlink(sourceDir);
	} catch (error) {
		next(error);
	}
}

module.exports = imageCompressor;

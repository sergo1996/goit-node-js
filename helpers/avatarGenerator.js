//Middleware
const AvatarGenerator = require('avatar-generator');

async function generateAvatar(next) {
	try {
		const avatar = new AvatarGenerator();

		const fileName = Date.now();
		const filePath = process.env.SOURCE_DIR + fileName + '.png';

		const image = await avatar.generate(null, 'male');
		await image.png().toFile(filePath);

		return `${fileName}.png`;
	} catch (error) {
		next(error);
	}
}

module.exports = generateAvatar;

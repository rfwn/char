require('dotenv').config();

export default {
	token: process.env.TOKEN,
	clientId: process.env.CLIENT_ID,
	ownerId: process.env.OWNER_ID,
	serverId: process.env.SERVER_ID,
	debug: false,
};
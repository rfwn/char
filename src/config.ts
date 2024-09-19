require('dotenv').config();

export default {
	token: process.env.TOKEN,
	clientId: process.env.CLIENT_ID,
    dbName: process.env.DATABASE_NAME,
    dbHost: process.env.DATABASE_HOST,
    dbPort: process.env.DATABASE_PORT,
	ownerId: process.env.OWNER_ID,
	serverId: process.env.SERVER_ID,
	debug: false,
};
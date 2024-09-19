import Client from './structures/Client'
import "reflect-metadata"

(async() => {
	const bot = new Client();
    await bot.database.init();
	bot.login(bot.config.token);
})()

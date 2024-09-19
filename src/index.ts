import Client from './structures/Client'
import "reflect-metadata"

(async() => {
	const bot = new Client();
	bot.login(bot.config.token);
})()

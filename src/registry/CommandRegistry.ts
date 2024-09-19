import Client from "../structures/Client";
import { promisify } from "util";
import fs from "fs";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
const readdir = promisify(fs.readdir);

export default class CommandRegistry {
	private client: Client;
	private _dir = "./dist/commands/";

	constructor(client: Client) {
		this.client = client;
	}

	public async loadCommands(): Promise<void> {
		try {
			const commandFolders = await readdir(this._dir);
			let commandsLoaded = 0;

			for (const folder of commandFolders) {
				const commandFiles = await readdir(`${this._dir}${folder}/`);
				for (const commandFile of commandFiles) {
					delete require.cache[require.resolve(`../commands/${folder}/${commandFile}`)];
					try {
						const commandClass = await import(`../commands/${folder}/${commandFile}`);
						const command = new commandClass.default(this.client, commandFile.split(".js")[0]);
						
						this.client.commands.set(command.name, command);
						commandsLoaded++;
						
						this.client.logger.info(`[${commandsLoaded}] command "${command.name}" loaded`);
					} catch (error) {
						this.client.logger.error(`failed to load command ${commandFile}: ${error.message}`, error);
					}
				}
			}

			this.client.logger.info(`[✓] loaded ${commandsLoaded} commands`);
		} catch (error) {
			this.client.logger.error(`error occurred while loading commands: ${error.message}`, error);
		}
	}

	public async registerCommands(commands: any): Promise<void> {
		const rest = new REST().setToken(this.client.config.token);

		try {
			this.client.logger.info('[/] started refreshing application commands.');

			await rest.put(
				Routes.applicationGuildCommands(this.client.config.clientId, this.client.config.serverId),
				{ body: commands }
			);

			this.client.logger.info('[/] successfully reloaded application commands.');
		} catch (error) {
			this.client.logger.error(`failed to register commands: ${error.message}`, error);
		}
	}
}

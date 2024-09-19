import Client from "../structures/Client";
import { promisify } from "util";
import fs from "fs";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
const readdir = promisify(fs.readdir);

export default class ContextMenuRegistry {
	private client: Client;
	private _dir = "./dist/contexts/";

	constructor(client: Client) {
		this.client = client;
	}

	/**
	 * Loads all context menu commands from the contexts directory and registers them in the client.
	 * @returns {Promise<void>}
	 */
	public async loadContexts(): Promise<void> {
		try {
			const contextFiles = await readdir(this._dir);
			let contextsLoaded = 0;

			for (const contextFile of contextFiles) {
				delete require.cache[require.resolve(`../contexts/${contextFile}`)];
				try {
					const contextClass = await import(`../contexts/${contextFile}`);
					const context = new contextClass.default(this.client, contextFile.split(".js")[0]);

					this.client.contexts.set(context.name, context);
					contextsLoaded++;
					this.client.logger.info(`[${contextsLoaded}] context Menu "${context.name}" loaded`);
				} catch (error) {
					this.client.logger.error(`failed to load context menu ${contextFile}: ${error.message}`, error);
				}
			}

			this.client.logger.info(`[✓] loaded ${contextsLoaded} context menus`);
		} catch (error) {
			this.client.logger.error(`error occurred while loading context menus: ${error.message}`, error);
		}
	}
}

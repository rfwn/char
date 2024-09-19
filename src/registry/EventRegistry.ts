import Client from "../structures/Client";
import { promisify } from "util";
import fs from "fs";

const readdir = promisify(fs.readdir);

export default class EventRegistry {
	private client: Client;
	private _dir = "./dist/events/";

	constructor(client: Client) {
		this.client = client;
	}

	public async loadEvents(): Promise<void> {
		try {
			const eventFolders = await readdir(this._dir);
			let eventsLoaded = 0;

			for (const folder of eventFolders) {
				const eventFiles = await readdir(`${this._dir}${folder}/`);
				for (const eventFile of eventFiles) {
					delete require.cache[require.resolve(`../events/${folder}/${eventFile}`)];
					try {
						const eventClass = await import(`../events/${folder}/${eventFile}`);
						const event = new eventClass.default(this.client, eventFile.split(".js")[0]);
						event.listen();
						eventsLoaded++;
						this.client.logger.info(`[${eventsLoaded}] event "${eventFile.split(".js")[0]}" loaded`);
						this.client.events.set(event.name, event);
					} catch (error) {
						this.client.logger.error(`failed to load event "${eventFile}": ${error.message}`, error);
					}
				}
			}

			this.client.logger.info(`[✓] loaded ${eventsLoaded} events`);
		} catch (error) {
			this.client.logger.error(`error occurred while loading events: ${error.message}`, error);
		}
	}

	public unloadEvents(): void {
		this.client.events.forEach(event => event.turnOff());
		this.client.logger.info(`[✓] all events have been unloaded`);
	}

	public async reloadEvents(): Promise<void> {
		this.unloadEvents();
		await this.loadEvents();
		this.client.logger.info(`[✓] all events have been reloaded`);
	}
}

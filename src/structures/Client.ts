import { ActivityType, Client, Partials } from 'discord.js';
import Logger from '../util/Logger';
import config from '../config';
import EventRegistry from '../registry/EventRegistry';
import Event from './Event';
import Command from './Command';
import CommandRegistry from '../registry/CommandRegistry';
import ContextMenuRegistry from '../registry/ContextMenuRegistry';
import ContextMenu from './Context';
import { validateConfig } from '../util';

class Char extends Client {
	public readonly logger: typeof Logger;
	public readonly config: any;
	public readonly eventRegistry: EventRegistry;
	public readonly commandRegistry: CommandRegistry;
	public readonly contextRegistry: ContextMenuRegistry;
	public events: Map<string, Event>;
	public commands: Map<string, Command>;
	public contexts: Map<string, ContextMenu>;
	constructor() {

		super({
			partials: [
				Partials.Message, Partials.User, Partials.Channel, Partials.Reaction, Partials.GuildScheduledEvent
			],
			intents: 53575679, // ! this number will always represent the same set of intents, and will not include new ones (all 20 intents for now)
			presence: {
				status: 'online',
				activities: [{
					name: 'things going on fire',
					type: ActivityType.Watching,
				}],
			},
			allowedMentions: { parse: ["users"] },
		});
		this.config = config;
		this.logger = Logger;
		try {
			validateConfig(config)
		} catch (error) {
			this.logger.error('Missing config values', error);
			process.exit(1);
		}
		this.events = new Map();
		this.eventRegistry = new EventRegistry(this);
		this.commands = new Map();
		this.commandRegistry = new CommandRegistry(this);
		this.contexts = new Map();
		this.contextRegistry = new ContextMenuRegistry(this);
		this.eventRegistry.loadEvents().then(() => {
			this.commandRegistry.loadCommands().then(() => {
				this.contextRegistry.loadContexts()
			})

		})
	}
}

export default Char;
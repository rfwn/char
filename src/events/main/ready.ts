import { ContextMenuCommandType, ToAPIApplicationCommandOptions } from 'discord.js';
import Event from '../../structures/Event';

export default class Ready extends Event {
	override async run() {
		const commands = this.collectCommands();

		try {
			await this.client.commandRegistry.registerCommands(commands);
			this.client.logger.info(
				`[✓] ready to serve ${this.client.users.cache.size} users across ${this.client.guilds.cache.size} server${this.client.guilds.cache.size > 1 ? 's' : ''}.`
			);
		} catch (error) {
			this.client.logger.error(`failed to register commands: ${error.message}`, error);
			if (this.client.config.debug) {
				console.error(error);
			}
		}
	}

	private collectCommands() {
		const commands: ({
			name: string;
			description: string;
			options: ToAPIApplicationCommandOptions[];
			default_permission: boolean | undefined;
			default_member_permissions: string | null | undefined;
			dm_permission: boolean | undefined;
		} | {
			name: string,
			type: ContextMenuCommandType,
			default_permission: boolean | undefined;
			default_member_permissions: string | null | undefined;
			dm_permission: boolean | undefined;
		})[] = [];

		this.client.commands.forEach(command => {
			commands.push(command.formatAPI());
		});
		this.client.contexts.forEach(context => commands.push(context.formatAPI()));

		return commands;
	}
}

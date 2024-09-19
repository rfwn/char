import { Interaction } from 'discord.js';
import Event from '../../structures/Event';

export default class InteractionCreate extends Event {
	override async run(interaction: Interaction) {
		if (!interaction.isContextMenuCommand() && !interaction.isChatInputCommand()) return
		try {
			if (interaction.isChatInputCommand()) {
				const command = this.client.commands.get(interaction.commandName);
				if (command) {
					await command.run(interaction);
				} else {
					this.client.logger.warn(`received unknown command: ${interaction.commandName}`);
					await interaction.reply({ content: 'unknown command', ephemeral: true });
				}
			} else if (interaction.isContextMenuCommand()) {
				const contextCommand = this.client.contexts.get(interaction.commandName);
				if (contextCommand) {
					await contextCommand.run(interaction);
				} else {
					this.client.logger.warn(`received unknown context menu command: ${interaction.commandName}`);
					await interaction.reply({ content: 'unknown context menu command', ephemeral: true });
				}
			}
		} catch (error) {
			this.client.logger.error(`error executing ${interaction.commandName}: ${error.message}`, error);

			if (this.client.config.debug) {
				console.error(error);
			}

			await interaction.reply({
				content: 'an unexpected error occurred while executing this command',
				ephemeral: true
			});
		}
	}
}

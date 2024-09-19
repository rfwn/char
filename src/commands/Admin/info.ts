import { CommandInteraction, EmbedBuilder } from 'discord.js';
import Client from "../../structures/Client";
import Command from "../../structures/Command";
import { SlashCommandBuilder } from 'discord.js'
import { formatDuration } from '../../util';
export default class InfoCommand extends Command {
    constructor(
        client: Client,
    ) {
        super(
            new SlashCommandBuilder()
                .setName('info')
                .setDescription('bot process info'),
            client
        );
    }

    override async run(interaction: CommandInteraction) {
        const dstart = performance.now();
        await interaction.user.fetchFlags(true);
        const dend = performance.now();
        const embed = new EmbedBuilder()
            .addFields(
                { name: 'latency', value: `> \`${Math.round(dend - dstart)}ms\``, inline: true },
                { name: 'uptime', value: `> \`${formatDuration(Math.round(process.uptime()))}\``, inline: true },
            );
        await interaction.reply({ embeds: [embed] });
    }
}
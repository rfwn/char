import {
    CommandInteraction,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    ToAPIApplicationCommandOptions
} from "discord.js";
import Client from "./Client";

class Commamd {
    public readonly name: string;
    public readonly description: string;
    public readonly options: ToAPIApplicationCommandOptions[];
    public readonly client: Client;
    private readonly _command;

    default_permission: boolean | undefined;
    default_member_permissions: string | null | undefined;
    dm_permission: boolean | undefined;

    constructor(
        options: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder,
        client: Client,
    ) {
        this.name = options.name;
        this.client = client;
        this.description = options.description;
        this.options = options.options;
        this.default_permission = options.default_permission;
        this.default_member_permissions = options.default_member_permissions;
        this.dm_permission = options.dm_permission;
        this._command = this.safeRun.bind(this);
    }

    private async safeRun(interaction: CommandInteraction): Promise<any> {
        try {
            return await this.run(interaction);
        } catch (error) {
            this.client.logger.error(`event ${this.name} failed to execute`, error)
        }
    }

    public async run(_interaction: CommandInteraction): Promise<any> { }

    public formatAPI() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            default_permission: this.default_permission,
            default_member_permissions: this.default_member_permissions,
            dm_permission: this.dm_permission
        }
    }

}

export default Commamd;
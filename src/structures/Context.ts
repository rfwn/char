import {
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    ContextMenuCommandType,
} from "discord.js";
import Client from "./Client";

class ContextMenu {
    public readonly name: string;
    public readonly type: ContextMenuCommandType;
    public readonly default_permission: boolean | undefined;
    public readonly default_member_permissions: string | null | undefined;
    public readonly dm_permission: boolean | undefined;
    public readonly client: Client;

    private readonly _context;
    constructor(
        options: ContextMenuCommandBuilder,
        client: Client
    ) {
        this.name = options.name;
        this.client = client;
        this.type = options.type
        this.default_permission = options.default_permission;
        this.default_member_permissions = options.default_member_permissions;
        this.dm_permission = options.dm_permission;
        this._context = this.safeRun.bind(this);
    }

    private async safeRun(interaction: ContextMenuCommandInteraction): Promise<any> {
        try {
            return await this.run(interaction);
        } catch (error) {
            this.client.logger.error(`event ${this.name} failed to execute.`, error)
        }
    }

    public async run(_interaction: ContextMenuCommandInteraction): Promise<any> { }

    public formatAPI() {
        return {
            name: this.name,
            type: this.type,
            default_permission: this.default_permission,
            default_member_permissions: this.default_member_permissions,
            dm_permission: this.dm_permission
        }
    }

}

export default ContextMenu;
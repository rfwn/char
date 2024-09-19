import { ILogObj, ILogObjMeta, IMeta } from "tslog";
import { WebhookClient, EmbedBuilder, codeBlock } from "discord.js";
const WEBHOOK_URL = "https://discord.com/api/webhooks/1282753778268766288/Lj1KDcV81XCJjNNiZwRzTzVAFYMOEuCVNM9tyURVqI1yh7AvptOgEFR-0he2kNjOJfS1";

class ErrorTransmitter {

	constructor() { }

	public async _sendWebhook(webhookUrl: string, embed: EmbedBuilder): Promise<any> {
		const webhookClient = new WebhookClient({ url: webhookUrl });
		return webhookClient.send({
			embeds: [embed]
		});
	}

	public async handleLog(logObj: ILogObj & ILogObjMeta) {
		if (logObj._meta.logLevelName == 'ERROR') {
			return this.handleError(logObj)
		}
	}

	public async handleWarn(log: ILogObj & ILogObjMeta): Promise<any> {
		const meta = log._meta;
		const error = {
			date: meta.date,
			filePath: meta.path?.filePath?.replace('\dist\\', ''),
			columnNumber: meta.path?.fileColumn,
			lineNumber: meta.path?.fileLine,
			argumentsArray: [log[1] as any],
			method: meta.path?.method
		}
		const embed = new EmbedBuilder()
			.setTitle("Warning on " + error.filePath + " " + error.lineNumber + ":" + error.columnNumber)
			.setColor(0xFFD700)
			.setDescription(`\`\`\`${error.argumentsArray.join("\n")}\`\`\``)
			.setTimestamp(error.date);
		await this._sendWebhook(WEBHOOK_URL, embed);
	}
	public async handleError(log: ILogObj & ILogObjMeta): Promise<any> {

		const meta = log._meta;
		const error = {
			date: meta.date,
			filePath: meta.path?.filePath?.replace('\dist\\', ''),
			columnNumber: meta.path?.fileColumn,
			lineNumber: meta.path?.fileLine,
			argumentsArray: [log[1] as any],
			method: meta.path?.method
		}
		const embed = new EmbedBuilder()
			.setTitle(`${error.argumentsArray[0].name}`)
			.setAuthor({ name: error.filePath + " " + error.lineNumber + ":" + error.columnNumber })
			.setColor(0xFF0000)
			.setTimestamp(error.date);
		if (error.argumentsArray instanceof Array) {
			if (error.argumentsArray[0].stack) {
				error.argumentsArray[0].stack.reverse().slice(0, 10).forEach((stackItem: { method: string | undefined; filePathWithLine: string; fileColumn: string; }) => {
					return embed.addFields({ name: stackItem.method ? stackItem.method : '<anonymous>', value: `\`\t(${stackItem.filePathWithLine}:${stackItem.fileColumn})\`` });
				});
			}
			embed.setDescription(`\`\`\`\n${error.argumentsArray[0].message}\`\`\``)
		} else {
			embed.setDescription(`\`\`\`\n${error.argumentsArray[0]}\`\`\``)
		}
		await this._sendWebhook(WEBHOOK_URL, embed);
	}
}



export default new ErrorTransmitter();
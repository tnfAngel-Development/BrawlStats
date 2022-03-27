import { BrawlStatsClient } from '../../../client';
import { Message } from 'discord.js';

interface ICommandContext {
	client: BrawlStatsClient;
	message: Message;
	args: string[];
}

export class CommandContext {
	client: BrawlStatsClient;
	message: Message;
	args: string[];
	constructor(commandContext: ICommandContext) {
		this.client = commandContext.client;
		this.message = commandContext.message;
		this.args = commandContext.args;
	}
}

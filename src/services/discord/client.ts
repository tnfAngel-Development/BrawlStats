export {};

// External Imports
import { Client, Intents, MessageEmbed, MessageAttachment } from 'discord.js';
import { readdirSync } from 'fs';

// External Typings Imports
import type { ClientOptions } from 'discord.js';

// Local Imports
import { DiscordClientConfig } from './config';
import { CommandManager } from './extensions/commandManager';
import { DiscordClientUtil } from './util';

// Local Typings Imports
import type { BrawlStatsClient } from '../../client';

// Client
export class DiscordClient extends Client {
	client: BrawlStatsClient;
	MessageEmbed: typeof MessageEmbed;
	MessageAttachment: typeof MessageAttachment;
	config: DiscordClientConfig;
	util: DiscordClientUtil;
	extensions: { commandManager: CommandManager };
	log: {
		error: (message: string) => void;
		warn: (message: string) => void;
		info: (message: string) => void;
		debug: (message: string) => void;
	};
	loadHandlers: (eventsPath: string) => Promise<void>;
	constructor(client: BrawlStatsClient, options: ClientOptions) {
		super(options);

		// Client
		this.client = client;

		// Classes
		this.MessageEmbed = MessageEmbed;
		this.MessageAttachment = MessageAttachment;

		// Config
		this.config = new DiscordClientConfig();

		// Util
		this.util = new DiscordClientUtil(this.client);

		// Extensions
		this.extensions = {
			commandManager: new CommandManager(),
		};

		// Logs
		this.log = {
			error: (message: string): void =>
				this.client.log.error(
					`[ ${this.client.logColors.magenta('DISCORD')} ] ${message}`
				),
			warn: (message: string): void =>
				this.client.log.warn(
					`[ ${this.client.logColors.magenta('DISCORD')} ] ${message}`
				),
			info: (message: string): void =>
				this.client.log.info(
					`[ ${this.client.logColors.magenta('DISCORD')} ] ${message}`
				),
			debug: (message: string): void =>
				this.client.log.debug(
					`[ ${this.client.logColors.magenta('DISCORD')} ] ${message}`
				),
		};

		// Handlers loader
		this.loadHandlers = async (eventsPath: string): Promise<void> => {
			const eventFiles = readdirSync(
				eventsPath.replace('./', './src/services/discord/')
			);

			const startDate = new Date();

			for (const file of eventFiles) {
				if (file.endsWith('.ts')) {
					const name = file.substring(0, file.length - 3);
					const content = require(`${eventsPath}${file}`);

					this.on(name, content.bind(null, this.client));

					const loadDate = new Date();

					this.log.info(
						`Event ${this.client.logColors.cyan(
							name
						)} loaded (${this.client.logColors.magenta(
							`${loadDate.getTime() - startDate.getTime()}`
						)} ms)`
					);

					delete require.cache[
						require.resolve(`${eventsPath}${file}`)
					];
				}
			}
		};
	}

	async start(): Promise<void> {
		this.log.info(
			`Starting ${this.client.logColors.cyan('Discord Client')}...`
		);
		await this.loadHandlers('./events/');
		await this.login(this.config.bot.token);
	}
}

module.exports = (client: BrawlStatsClient): DiscordClient =>
	new DiscordClient(client, {
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_MEMBERS,
		],
		partials: ['MESSAGE', 'CHANNEL'],
	});

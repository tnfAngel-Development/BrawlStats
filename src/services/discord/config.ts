// Local Imports
import { BrawlStatsClient } from '../../client';

const discordBotID = process.env.DISCORD_ID;

export class DiscordClientConfig {
	bot: { readonly token: string; prefix: string; id: string };
	buttonColors: { blurple: string; red: string };
	settings: { rateLimit: boolean; debug: boolean };
	links: { invite: string };
	constructor(client: BrawlStatsClient) {
		this.bot = {
			get token() {
				return process.env.DISCORD_TOKEN;
			},
			prefix: '!',
			id: discordBotID,
		};
		this.buttonColors = {
			blurple: 'blurple',
			red: 'danger',
		};
		this.settings = {
			rateLimit: true,
			debug: false,
		};
		this.links = {
			invite: `https://discord.com/oauth2/authorize?client_id=${discordBotID}&permissions=8&scope=bot%20guilds%20applications.commands`,
		};
	}
}

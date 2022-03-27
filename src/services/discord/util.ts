// Local Imports
import { BrawlStatsClient } from '../../client';

// External Imports
import { GuildMember, GuildResolvable, Snowflake, User } from 'discord.js';

export class DiscordClientUtil {
	toCodeBlock: (code: string, text: string) => string;
	toCode: (text: string) => string;
	clearMentions: (text: string) => string;
	matchGuildMember: (
		guildResolvable: GuildResolvable,
		member: string
	) => GuildMember | undefined;
	matchUser: (user: string) => User | undefined;
	constructor(client: BrawlStatsClient) {
		this.matchGuildMember = (
			guildResolvable: GuildResolvable,
			member: string
		): GuildMember | undefined => {
			const guild = client.discord.guilds.resolve(guildResolvable);

			return guild.members.cache.find(
				(findMember: GuildMember): boolean =>
					this.clearMentions(member) === findMember.user.id ||
					member.toLowerCase() ===
						findMember.user.tag.toLowerCase() ||
					member.toLowerCase() ===
						findMember.user.username.toLowerCase() ||
					member === findMember.nickname?.toLowerCase()
			);
		};
		this.matchUser = (user: string): User | undefined => {
			return client.discord.users.cache.find(
				(findUser: User): boolean =>
					this.clearMentions(user) === findUser.id ||
					user.toLowerCase() === findUser.tag.toLowerCase() ||
					user.toLowerCase() === findUser.username.toLowerCase()
			);
		};
		this.toCodeBlock = (code: string, text: string): string => {
			return `\`\`\`${code}\n${text}\n\`\`\``;
		};
		this.toCode = (text: string): string => {
			return `\`${text
				.toString()
				.replace(/`/g, '')
				.replace(/[\n\r]/g, '')}\``;
		};
		this.clearMentions = (text: string): Snowflake | string => {
			return text
				.replace(/</g, '')
				.replace(/!/g, '')
				.replace(/@/g, '')
				.replace(/#/g, '')
				.replace(/&/g, '')
				.replace(/>/g, '');
		};
	}
}
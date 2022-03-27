// Local Imports
import { BrawlStatsClient } from '../../../client';

module.exports = async (client: BrawlStatsClient): Promise<void> => {
	client.discord.user.setActivity({
		name: `${client.discord.config.bot.prefix}help | Developed by tnfAngel`,
		type: 'WATCHING',
	});

	client.discord.log.info(
		`Discord Client ready as ${client.logColors.cyan(
			client.discord.user.username
		)}${client.logColors.magenta(`#${client.discord.user.discriminator}`)}`
	);
};

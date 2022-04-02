// Local Typings Imports
import type { BrawlStatsClient } from '../../../client';

// External Typings Imports
import type { ClientUser } from 'discord.js';

module.exports = async (client: BrawlStatsClient): Promise<void> => {
	const clientUser = client.discord.user as ClientUser;

	clientUser.setActivity({
		name: `${client.discord.config.bot.prefix}help | by tnfAngel`,
		type: 'WATCHING',
	});

	client.discord.log.info(
		`Discord Client ready as ${client.logColors.cyan(
			clientUser.username
		)}${client.logColors.magenta(`#${clientUser.discriminator}`)}`
	);
};

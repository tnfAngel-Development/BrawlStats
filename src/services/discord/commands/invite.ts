// Local Imports
import { BaseCommand } from '../classes/BaseCommand';
import { CommandContext } from '../classes/CommandContext';

// External Imports
import { MessageActionRow, MessageButton } from 'discord.js';

module.exports = new BaseCommand({
	name: 'invite',
	alias: ['invitacion', 'invitación'],
	description: 'Invita al bot a tu servidor',
	permissions: {
		user: [],
		bot: [],
	},
	run: async (ctx: CommandContext): Promise<void> => {
		const { message, client } = ctx;

		await message.reply({
			content: '¡Invita al bot a tu servidor!',
			components: [
				new MessageActionRow().addComponents(
					new MessageButton()
						.setURL(client.discord.config.links.invite)
						.setLabel('Invitarlo')
						.setStyle('LINK')
				),
			],
		});
	},
});

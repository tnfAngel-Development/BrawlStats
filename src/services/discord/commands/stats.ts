// Local Imports
import { BaseCommand } from '../classes/BaseCommand';

// Local Typings Imports
import type { CommandContext } from '../classes/CommandContext';

module.exports = new BaseCommand({
	name: 'stats',
	alias: ['estadísticas', 'estadisticas', 'perfil', 'profile'],
	description: 'Mira el perfil de un usuario y sus stats.',
	permissions: {
		user: [],
		bot: [],
	},
	run: async (ctx: CommandContext): Promise<void> => {
		const { message } = ctx;

		await message.reply({
			content: 'Pruba',
		});
	},
});

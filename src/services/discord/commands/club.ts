// Local Imports
import { BaseCommand } from '../classes/BaseCommand';

// Local Typings Imports
import type { CommandContext } from '../classes/CommandContext';

module.exports = new BaseCommand({
	name: 'club',
	alias: ['grupo', 'group'],
	description: 'Mira las estadísticas de un club.',
	permissions: {
		user: [],
		bot: [],
	},
	run: async (ctx: CommandContext): Promise<any> => {
		const { client, message, args } = ctx;

		const noClubEmbed = new client.discord.MessageEmbed()
			.setDescription(':warning: Debes introducir el tag del grupo')
			.setColor(client.intColors.error);

		if (!args[0]) return message.channel.send({ embeds: [noClubEmbed] });

		const clubTag = `#${args[0].replace('#', '')}`;

		const loadEmbed = new client.discord.MessageEmbed()
			.setDescription(':stopwatch: Obteniendo información...')
			.setColor(client.intColors.blurple);

		const msg = await message.channel.send({ embeds: [loadEmbed] });

		const club = await client.bs.getClub(clubTag).catch(() => null);

		const invalidClubEmbed = new client.discord.MessageEmbed()
			.setDescription(
				':warning: El tag del club introducido es invalido.'
			)
			.setColor(client.intColors.error);

		if (!club)
			return msg.edit({
				embeds: [invalidClubEmbed],
			});

		const clubIcon = `https://brawlace.com/assets/images/icons-clubs/${club.badgeId}.png`;

		const clubEmbed = new client.discord.MessageEmbed()
			.setAuthor({
				name: `${club.name} - ${club.tag}`,
				iconURL: clubIcon,
			})
			.setColor(client.intColors.blurple)
			.setDescription(club.description)
			.addField(
				'<:trophies:957733558934466620> Trofeos',
				client.util.localeString(club.trophies),
				true
			)
			.addField(
				'<:highesttrophies:957733559274197062> Trofeos requeridos',
				client.util.localeString(club.requiredTrophies),
				true
			)
			.addField(
				'<:showdown:957733558888329276>  Tipo',
				club.type === 'open' ? 'Abierto' : 'Cerrado',
				true
			);

		await msg.edit({ embeds: [clubEmbed] });
	},
});

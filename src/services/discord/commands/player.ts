// Local Imports
import { BaseCommand } from '../classes/BaseCommand';

// Local Typings Imports
import type { CommandContext } from '../classes/CommandContext';

module.exports = new BaseCommand({
	name: 'player',
	alias: [
		'estadísticas',
		'estadisticas',
		'perfil',
		'stats',
		'user',
		'jugador',
	],
	description: 'Mira las estadísticas del perfil de un usuario.',
	permissions: {
		user: [],
		bot: [],
	},
	run: async (ctx: CommandContext): Promise<any> => {
		const { client, message, args } = ctx;

		const noPlayerEmbed = new client.discord.MessageEmbed()
			.setDescription(':warning: Debes introducir el tag de un jugador.')
			.setColor(client.intColors.error);

		if (!args[0]) return message.channel.send({ embeds: [noPlayerEmbed] });

		const playerTag = `#${args[0].replace('#', '')}`;

		const loadEmbed = new client.discord.MessageEmbed()
			.setDescription(':stopwatch: Obteniendo información...')
			.setColor(client.intColors.blurple);

		const msg = await message.channel.send({ embeds: [loadEmbed] });

		const player = await client.bs.getPlayer(playerTag).catch(() => null);

		const invalidPlayerEmbed = new client.discord.MessageEmbed()
			.setDescription(
				':warning: El tag del jugador introducido es invalido.'
			)
			.setColor(client.intColors.error);

		if (!player)
			return msg.edit({
				embeds: [invalidPlayerEmbed],
			});

		const brawlers = await client.bs
			.getBrawlers()
			.then((brawlersMap) => [...brawlersMap.values()])
			.catch(() => null);

		const noBrawlersEmbed = new client.discord.MessageEmbed()
			.setDescription(
				':warning: Error interno al obtener los brawlers del juego, intentalo de nuevo mas tarde.'
			)
			.setColor(client.intColors.error);

		if (!brawlers)
			return msg.edit({
				embeds: [noBrawlersEmbed],
			});

		const playerIcon = `https://brawlace.com/assets/images/icons-players/${player.icon.id}.png`;

		const profileEmbed = new client.discord.MessageEmbed()
			.setAuthor({
				name: `${player.name}${
					player.club ? ` - ${player.club.name}` : ''
				}`,
				iconURL: playerIcon,
			})
			.setColor(parseInt(`0x${player.nameColor.slice(4)}`))
			.addField(
				'<:playerlevel:957733558905094215> Nivel',
				client.util.localeString(player.expLevel),
				true
			)
			.addField(
				'<:trophies:957733558934466620> Trofeos',
				client.util.localeString(player.trophies),
				true
			)
			.addField(
				'<:highesttrophies:957733559274197062> Récord de Trofeos',
				client.util.localeString(player.highestTrophies),
				true
			)
			.addField(
				'<:3v3:957733559349698610> Victorias 3 VS 3',
				client.util.localeString(player.trioVictories),
				true
			)
			.addField(
				'<:duoshowdown:957733558879920148> Victorias Duo',
				client.util.localeString(player.duoVictories),
				true
			)
			.addField(
				'<:showdown:957733558888329276> Victorias Solo',
				client.util.localeString(player.soloVictories),
				true
			)
			.addField(
				'<:brawlers:957738593756000277> Brawlers',
				`${client.util.localeString(
					player.brawlers ? player.brawlers.length : 0
				)}/${brawlers.length}`,
				true
			)
			.addField(
				'<:gadget:957738593730826360> Gadgets',
				`${client.util.localeString(
					player.brawlers
						? player.brawlers
								.map((brawler) => brawler.gadgets)
								.flat().length
						: 0
				)}/${brawlers.map((brawler) => brawler.gadgets).flat().length}`,
				true
			)
			.addField(
				'<:starpower:957738593747615804> Poderes Estelares',
				`${client.util.localeString(
					player.brawlers
						? player.brawlers
								.map((brawler) => brawler.starPowers)
								.flat().length
						: 0
				)}/${
					brawlers.map((brawler) => brawler.starPowers).flat().length
				}`,
				true
			);

		await msg.edit({ embeds: [profileEmbed] });
	},
});

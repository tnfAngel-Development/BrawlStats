// Local Typings Imports
import type { BaseCommand } from '../classes/BaseCommand';

// External Imports
import { readdirSync } from 'fs';

export class CommandManager {
	getCommands(): BaseCommand[] {
		const path = '../commands/';
		const commands = [];

		function addCommand(commandPath: string) {
			const command = require(commandPath);

			commands.push(command);
		}

		for (const filePath of readdirSync(
			path.replace('../', './src/services/discord/')
		)) {
			if (filePath.endsWith('.ts')) {
				addCommand(`${path}${filePath}`);
			}
		}

		return commands;
	}

	getCommand(findFN: any): BaseCommand | undefined {
		return this.getCommands().find(findFN);
	}

	matchCommand(command: string): BaseCommand | undefined {
		return this.getCommand(
			(cmdObj: BaseCommand): boolean =>
				cmdObj.name.toLowerCase() == command.toLowerCase() ||
				cmdObj.alias.includes(command.toLowerCase())
		);
	}
}

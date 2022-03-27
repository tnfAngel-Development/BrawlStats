/* eslint-disable @typescript-eslint/ban-ts-comment */
export {};

// External Typings Imports
import type { Client as BSClient } from 'brawlstats';

// Local Imports
import { BrawlStatsClientConfig } from './config';
import { BrawlStatsClientLogger } from './logger';
import { BrawlStatsClientUtil } from './util';

// Local Typings Imports
import type { DiscordClient } from './services/discord/client';
import type { BrawlStatsClientLoggerColors } from './logger';

// Client
export class BrawlStatsClient {
	config: BrawlStatsClientConfig;
	util: BrawlStatsClientUtil;
	loggerClient: BrawlStatsClientLogger;
	log: any;
	logColors: BrawlStatsClientLoggerColors;
	colors: {
		blurple: string;
		error: string;
		success: string;
		mute: string;
		warn: string;
	};
	intColors: {
		blurple: number;
		error: number;
		success: number;
		mute: number;
		warn: number;
	};
	array: {
		addElement: (targetArray: any[], ...arrayArgs: any[]) => any[];
		removeIndex: (targetArray: any[], index: number) => any[];
		removeElement: (targetArray: any[], findFN: any) => false | any[];
		chunk: (targetArray: any[], chunkSize: number) => any[];
		seedShuffle: (targetArray: any[], seed?: number) => any[];
	};
	// @ts-ignore
	discord: DiscordClient;
	// @ts-ignore
	bs: BSClient;
	constructor() {
		// Logger
		this.loggerClient = new BrawlStatsClientLogger();
		this.log = this.loggerClient.logger;
		this.logColors = this.loggerClient.logColors;

		// Config
		this.config = new BrawlStatsClientConfig();
		this.colors = this.config.colors;
		this.intColors = this.config.intColors;

		// Services
		for (const service of this.config.services) {
			// @ts-ignore
			this[service] = require(`./services/${service}/client`)(this);
		}

		// Other
		this.util = new BrawlStatsClientUtil();

		// Array util
		this.array = {
			addElement: (targetArray: any[], ...arrayArgs): any[] => {
				targetArray.push(...arrayArgs);

				return targetArray;
			},
			removeIndex: (targetArray: any[], index: number): any[] => {
				targetArray.splice(index, 1);

				return targetArray;
			},
			removeElement: (targetArray: any[], findFN: any): any => {
				const index = targetArray.findIndex(findFN);

				if (index === -1) return false;

				targetArray.splice(index, 1);

				return targetArray;
			},
			chunk: (targetArray: any[], chunkSize: number): any[][] => {
				const result = [];
				const arrayLength = targetArray.length;

				for (let i = 0; i < arrayLength; i += chunkSize) {
					result.push(targetArray.slice(i, i + chunkSize));
				}

				return result;
			},
			seedShuffle: (targetArray: any[], seed = 1): any[] => {
				let currentIndex = targetArray.length;

				const random = () => {
					seed = seed + 1;
					const x = Math.sin(seed) * 10000;
					return x - Math.floor(x);
				};

				while (0 !== currentIndex) {
					const randomIndex = Math.floor(random() * currentIndex);

					currentIndex -= 1;

					const temporaryValue = targetArray[currentIndex];

					targetArray[currentIndex] = targetArray[randomIndex];
					targetArray[randomIndex] = temporaryValue;
				}

				return targetArray;
			},
		};
	}

	async start(): Promise<void> {
		const services = this.config.services;
		this.log.info(
			`Starting Services [ ${services
				.map((service) => this.logColors.cyan(service.toUpperCase()))
				.join(', ')} ]...`
		);
		for (const service of services) {
			// @ts-ignore
			await this[service].start();
		}
	}
}

export {};

// External Imports
import { config as dotenvConfig } from 'dotenv';

// Local Imports
import { BrawlStatsClient } from './client';

// Dotenv
dotenvConfig();

// Client
const client = new BrawlStatsClient();

client.start();

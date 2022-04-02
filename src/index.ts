export {};

// External Imports
import 'dotenv/config';

// Local Imports
import { BrawlStatsClient } from './client';

// Client
const client = new BrawlStatsClient();

client.start();

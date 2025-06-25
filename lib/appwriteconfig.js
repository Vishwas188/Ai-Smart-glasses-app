// lib/appwriteConfig.js
import { Client, Storage, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')  // your endpoint
  .setProject('6846cddd002d4fdc3eb3');                // your project ID

const storage = new Storage(client);

export { client, storage, ID };
// lib/appwriteconfig.ts
export const PROJECT_ID = '6846cddd002d4fdc3eb3';


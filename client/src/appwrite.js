import { Client, Account, Storage} from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('672e6f73001596098233');

export const account = new Account(client);

export const storage_appwrite = new Storage(client);




// export { ID } from 'appwrite';

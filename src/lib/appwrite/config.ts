import {Client, Account, Databases, Storage, Avatars} from 'appwrite';

export const appwriteConfig = {
    projectId: '65686c5c23b1c0d3ee67',
    url: 'https://cloud.appwrite.io/v1',
    databaseId: '657201a66a57ac0130ac',
    storageId: '657201778236a43a40da',
    userCollectionId: '65720b9ea46c4a2069b7',
    postCollectionId: '657201e2b010f018ee00',
    saveCollectionId: '65720bf73bed3cfaf47c',


}

export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
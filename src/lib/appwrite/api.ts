import {ID, Query} from 'appwrite';
import {account, appwriteConfig, avatars, databases} from "@/lib/appwrite/config";
import {INewUser} from "@/types";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount =  await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            username: user.username,
            email: newAccount.email,
            imageUrl: avatarUrl,
        });

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    name: string;
    email: string;
    username?: string;
    imageUrl: URL;
}) {
    try {
        // similar to: "const newUser (or some variable name by choice) = await databases etc"
        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user);
    } catch(error) {
        console.log(error);
    }
}

export async function signInAccount(user: {email: string, password: string}) {
    try {
        return account.createEmailSession(user.email, user.password);
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if(!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
        // this is provided by appwrite, and it allows me to delete the session and return the session
        return await account.deleteSession("current ");
    } catch (error) {
        console.log(error)
    }
}
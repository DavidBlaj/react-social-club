import {ID, Query} from 'appwrite';
import {account, appwriteConfig, avatars, databases, storage} from "@/lib/appwrite/config";
import {INewPost, INewUser} from "@/types";

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


// =================================================
// POSTS
// ================================================


export async function createPost(post: INewPost) {
    try {
        // Upload image to appwrite storage
        const uploadedFile = await uploadFile(post.file[0]);

        if(!uploadedFile) throw Error;

        // Get the file url
        const fileUrl = getFilePreview(uploadedFile.$id);

        if(!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        // Convert the tags into an array
        // globally we are looking for all the spaces and replace it with an empty space,
        // and then I split them by a comma
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        // Save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags
            }
        )

        if(!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }
        return newPost;
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile =  await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile;
    } catch(error) {
        console.log(error);
    }
}

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100
        )
        if (!fileUrl) throw Error;
        return fileUrl;
    } catch (e) {
        console.log(e)
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(
            appwriteConfig.storageId,
            fileId);
        return {status: 'ok'}
    } catch (e) {
        console.log(e);
    }
}
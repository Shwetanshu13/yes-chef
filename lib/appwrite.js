"use client";

import { Account, Avatars, Client, Databases, ID, Permission, Query, Role } from "appwrite";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "");

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const recipeCollection = process.env.NEXT_PUBLIC_APPWRITE_RECIPE_COLLECTION_ID || "";
const profileCollection = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID || "";
const friendCollection = process.env.NEXT_PUBLIC_APPWRITE_FRIEND_COLLECTION_ID || "";

export async function ensureSession() {
    try {
        const user = await account.get();
        return user;
    } catch (error) {
        return null;
    }
}

export async function signup({ name, email, password }) {
    await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);
    await databases.createDocument(databaseId, profileCollection, ID.unique(), {
        name,
        email,
        userId: (await account.get()).$id,
    });
    return account.get();
}

export async function login({ email, password }) {
    await account.createEmailPasswordSession(email, password);
    return account.get();
}

export async function logout() {
    try {
        await account.deleteSession("current");
    } catch (error) {
        console.error("Logout failed", error);
    }
}

export async function createRecipe(payload) {
    const user = await account.get();
    const doc = await databases.createDocument(
        databaseId,
        recipeCollection,
        ID.unique(),
        {
            ...payload,
            ownerId: user.$id,
        },
        [
            Permission.read(Role.users()),
            Permission.read(Role.user(user.$id)),
            Permission.update(Role.user(user.$id)),
            Permission.delete(Role.user(user.$id)),
        ]
    );
    return doc;
}

export async function listRecipes({ ownerId, friendIds = [], filters = {} }) {
    const queries = [];
    if (ownerId || friendIds.length) {
        queries.push(
            Query.or([
                ...(ownerId ? [Query.equal("ownerId", ownerId)] : []),
                ...(friendIds.length ? [Query.equal("ownerId", friendIds)] : []),
            ])
        );
    }
    if (filters.cuisine?.length) queries.push(Query.equal("cuisine", filters.cuisine));
    if (filters.course?.length) queries.push(Query.equal("course", filters.course));
    if (filters.type?.length) queries.push(Query.equal("type", filters.type));
    if (filters.search?.length) queries.push(Query.search("title", filters.search));
    return databases.listDocuments(databaseId, recipeCollection, queries);
}

export async function upsertFriendByEmail(friendEmail) {
    const user = await account.get();
    const profileRes = await databases.listDocuments(databaseId, profileCollection, [
        Query.equal("email", friendEmail.toLowerCase()),
    ]);
    if (!profileRes.total) throw new Error("No user found with that email");
    const friendProfile = profileRes.documents[0];
    const existing = await databases.listDocuments(databaseId, friendCollection, [
        Query.equal("ownerId", user.$id),
        Query.equal("friendId", friendProfile.userId),
    ]);
    if (existing.total) return existing.documents[0];
    return databases.createDocument(databaseId, friendCollection, ID.unique(), {
        ownerId: user.$id,
        friendId: friendProfile.userId,
        friendName: friendProfile.name,
        friendEmail: friendProfile.email,
    });
}

export async function listFriends() {
    const user = await account.get();
    const res = await databases.listDocuments(databaseId, friendCollection, [
        Query.equal("ownerId", user.$id),
    ]);
    return res.documents;
}

export async function getProfile() {
    const user = await account.get();
    const res = await databases.listDocuments(databaseId, profileCollection, [
        Query.equal("userId", user.$id),
    ]);
    return res.documents[0];
}

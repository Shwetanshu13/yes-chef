import { createRecipe, listRecipes, upsertFriendByEmail, listFriends } from "@/lib/appwrite";

export async function saveManualRecipe(data) {
    return createRecipe(data);
}

export async function saveStructuredRecipe(data) {
    return createRecipe(data);
}

export async function addFriend(email) {
    return upsertFriendByEmail(email);
}

export async function fetchFriends() {
    return listFriends();
}

export async function fetchRecipes({ ownerId, friendIds, filters }) {
    return listRecipes({ ownerId, friendIds, filters });
}

import { db } from './firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';

const TIMEOUT_MS = 10000;

async function withTimeout<T>(promise: Promise<T>, operationName: string): Promise<T> {
  const timeout = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error(`${operationName} timed out after ${TIMEOUT_MS}ms`)), TIMEOUT_MS)
  );
  return Promise.race([promise, timeout]);
}

export async function toggleFavorite(userId: string, toolId: string) {
  console.log(`[toggleFavorite] Starting for user ${userId}, tool ${toolId}`);
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await withTimeout(getDoc(userRef), 'getDoc userRef');

    if (!userSnap.exists()) {
      console.log('[toggleFavorite] User profile missing, creating new one');
      await withTimeout(setDoc(userRef, {
        uid: userId,
        favorites: [toolId],
      }), 'setDoc userRef');
      return true;
    }

    const userData = userSnap.data();
    const isFavorite = userData.favorites?.includes(toolId);

    if (isFavorite) {
      console.log('[toggleFavorite] Removing from favorites');
      await withTimeout(updateDoc(userRef, {
        favorites: arrayRemove(toolId)
      }), 'updateDoc remove');
      return false;
    } else {
      console.log('[toggleFavorite] Adding to favorites');
      await withTimeout(updateDoc(userRef, {
        favorites: arrayUnion(toolId)
      }), 'updateDoc add');
      return true;
    }
  } catch (error) {
    console.error('[toggleFavorite] Error:', error);
    throw error;
  }
}

export async function getUserFavorites(userId: string) {
  console.log(`[getUserFavorites] Fetching for user ${userId}`);
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await withTimeout(getDoc(userRef), 'getDoc userRef');
    
    if (userSnap.exists()) {
      const favs = userSnap.data().favorites || [];
      console.log(`[getUserFavorites] Found ${favs.length} favorites`);
      return favs;
    }
    console.log('[getUserFavorites] No user profile found');
    return [];
  } catch (error) {
    console.error('[getUserFavorites] Error:', error);
    return []; // Return empty array on error to prevent UI crash
  }
}

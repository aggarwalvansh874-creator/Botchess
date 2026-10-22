import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from './firebase';
import { StoredGame } from '../types/chess';

const LOCAL_STORAGE_KEY = 'botchess_guest_games';

export async function saveGameToDb(game: StoredGame, userId?: string | null): Promise<void> {
  // Always save to localStorage for instant client cache
  try {
    const existingStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existing: StoredGame[] = existingStr ? JSON.parse(existingStr) : [];
    const updated = [game, ...existing.filter((g) => g.id !== game.id)].slice(0, 100);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }

  // If user is authenticated with Firebase, save directly to Firestore
  if (userId) {
    try {
      const userGameDoc = doc(db, 'users', userId, 'games', game.id);
      await setDoc(userGameDoc, {
        ...game,
        userId,
      });
    } catch (err) {
      console.error('Firestore save failed:', err);
    }
  }
}

export async function loadUserGames(userId?: string | null): Promise<StoredGame[]> {
  // Load local cache first
  let localGames: StoredGame[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) localGames = JSON.parse(raw);
  } catch {
    //
  }

  if (!userId) {
    return localGames;
  }

  try {
    const gamesRef = collection(db, 'users', userId, 'games');
    const q = query(gamesRef, orderBy('timestamp', 'desc'), limit(100));
    const querySnapshot = await getDocs(q);
    const firestoreGames: StoredGame[] = [];

    querySnapshot.forEach((docSnap) => {
      firestoreGames.push(docSnap.data() as StoredGame);
    });

    if (firestoreGames.length > 0) {
      // Merge unique games
      const idMap = new Map<string, StoredGame>();
      firestoreGames.forEach((g) => idMap.set(g.id, g));
      localGames.forEach((g) => {
        if (!idMap.has(g.id)) idMap.set(g.id, g);
      });
      return Array.from(idMap.values()).sort((a, b) => b.timestamp - a.timestamp);
    }
  } catch (err) {
    console.warn('Failed to fetch from Firestore, returning local cache:', err);
  }

  return localGames;
}

export async function deleteGameFromDb(gameId: string, userId?: string | null): Promise<void> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed: StoredGame[] = JSON.parse(raw);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed.filter((g) => g.id !== gameId)));
    }
  } catch {
    //
  }

  if (userId) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'games', gameId));
    } catch (err) {
      console.error('Error deleting from Firestore:', err);
    }
  }
}

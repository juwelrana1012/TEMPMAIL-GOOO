import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  runTransaction,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface CountryStat {
  countryId: string;
  gender: 'male' | 'female';
  usedCount: number;
  remainingCount: number;
  totalCount: number;
  lastGeneratedName?: string;
  updatedAt?: number;
}

const TOTAL_COUNT = 5000;

// Test Firestore connection on boot as mandated by skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline, fallback local cache active.');
    }
  }
}
testConnection();

function getLocalKey(countryId: string, gender: 'male' | 'female'): string {
  return `tempmail_stat_${countryId.toLowerCase().trim()}_${gender}`;
}

export function getCachedStat(countryId: string, gender: 'male' | 'female'): CountryStat {
  try {
    const raw = localStorage.getItem(getLocalKey(countryId, gender));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.usedCount === 'number') {
        return {
          countryId,
          gender,
          usedCount: parsed.usedCount,
          remainingCount: TOTAL_COUNT - parsed.usedCount,
          totalCount: TOTAL_COUNT,
          lastGeneratedName: parsed.lastGeneratedName || '',
          updatedAt: parsed.updatedAt || Date.now()
        };
      }
    }
  } catch {}
  return {
    countryId,
    gender,
    usedCount: 0,
    remainingCount: TOTAL_COUNT,
    totalCount: TOTAL_COUNT,
    lastGeneratedName: ''
  };
}

export function saveCachedStat(stat: CountryStat): void {
  try {
    localStorage.setItem(getLocalKey(stat.countryId, stat.gender), JSON.stringify(stat));
  } catch {}
}

export async function fetchCountryStat(
  countryId: string,
  gender: 'male' | 'female'
): Promise<CountryStat> {
  const normCountry = countryId.toLowerCase().trim();
  const docId = `${normCountry}_${gender}`;
  const docRef = doc(db, 'nameGeneratorStats', docId);

  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const used = typeof data.usedCount === 'number' ? data.usedCount : 0;
      const stat: CountryStat = {
        countryId: normCountry,
        gender,
        usedCount: used,
        remainingCount: TOTAL_COUNT - used,
        totalCount: TOTAL_COUNT,
        lastGeneratedName: data.lastGeneratedName || '',
        updatedAt: data.updatedAt || Date.now()
      };
      saveCachedStat(stat);
      return stat;
    }
  } catch (err) {
    console.warn('Error fetching stats from Firebase, using cache fallback:', err);
  }

  return getCachedStat(normCountry, gender);
}

export async function incrementCountryStat(
  countryId: string,
  gender: 'male' | 'female',
  generatedName: string
): Promise<CountryStat> {
  const normCountry = countryId.toLowerCase().trim();
  const docId = `${normCountry}_${gender}`;
  const docRef = doc(db, 'nameGeneratorStats', docId);

  // Local calculation first for zero-lag response
  const prevStat = getCachedStat(normCountry, gender);
  let nextUsed = prevStat.usedCount + 1;
  if (nextUsed > TOTAL_COUNT) {
    nextUsed = 1; // restarts from 1 when 5,000 reached
  }
  const nextRemaining = TOTAL_COUNT - nextUsed;

  const optimisticStat: CountryStat = {
    countryId: normCountry,
    gender,
    usedCount: nextUsed,
    remainingCount: nextRemaining,
    totalCount: TOTAL_COUNT,
    lastGeneratedName: generatedName,
    updatedAt: Date.now()
  };
  saveCachedStat(optimisticStat);

  // Firestore transaction for concurrent reliability across users
  try {
    const finalStat = await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(docRef);
      let currentUsed = 0;
      if (sfDoc.exists()) {
        const d = sfDoc.data();
        if (typeof d.usedCount === 'number') {
          currentUsed = d.usedCount;
        }
      }

      let updatedUsed = currentUsed + 1;
      if (updatedUsed > TOTAL_COUNT) {
        updatedUsed = 1;
      }
      const updatedRemaining = TOTAL_COUNT - updatedUsed;

      const payload = {
        countryId: normCountry,
        gender,
        usedCount: updatedUsed,
        remainingCount: updatedRemaining,
        totalCount: TOTAL_COUNT,
        lastGeneratedName: generatedName,
        updatedAt: Date.now()
      };

      transaction.set(docRef, payload, { merge: true });
      return payload as CountryStat;
    });

    saveCachedStat(finalStat);
    return finalStat;
  } catch (err) {
    console.warn('Firebase transaction error, persisted optimistic count:', err);
    return optimisticStat;
  }
}

export function subscribeToCountryStat(
  countryId: string,
  gender: 'male' | 'female',
  callback: (stat: CountryStat) => void
): () => void {
  const normCountry = countryId.toLowerCase().trim();
  const docId = `${normCountry}_${gender}`;
  const docRef = doc(db, 'nameGeneratorStats', docId);

  // Trigger with local cache immediately
  callback(getCachedStat(normCountry, gender));

  const unsubscribe = onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const used = typeof data.usedCount === 'number' ? data.usedCount : 0;
        const stat: CountryStat = {
          countryId: normCountry,
          gender,
          usedCount: used,
          remainingCount: TOTAL_COUNT - used,
          totalCount: TOTAL_COUNT,
          lastGeneratedName: data.lastGeneratedName || '',
          updatedAt: data.updatedAt || Date.now()
        };
        saveCachedStat(stat);
        callback(stat);
      }
    },
    (err) => {
      console.warn('Firebase subscription error:', err);
    }
  );

  return unsubscribe;
}

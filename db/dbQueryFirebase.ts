import {
  setDoc,
  doc,
  orderBy,
  addDoc,
  // getFirestore,
  onSnapshot,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  increment,
  updateDoc,
  deleteDoc,
  limit,
  arrayUnion,
  deleteField,
  QuerySnapshot,
  DocumentData,
  FirestoreError,
  SnapshotListenOptions,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { v4 as uuidv4 } from 'uuid';


export const createEvent = async (data: any) => {
  const uid1 = uuidv4()
  data.uId = uid1;
  try {
    const userRef = doc(db, `pride_event`, data.uId)
    const docSnap = await getDoc(userRef)
    if (!docSnap.exists()) {
      await setDoc(userRef, data, { merge: true })
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!')
      return null
    }
  } catch (error) {
    console.log('error in db', error, data)
  }
}
export const createStall = async (data: any) => {
  const uid1 = uuidv4()
  data.uId = uid1;
  try {
    const userRef = doc(db, `pride_stall`, data.uId)
    const docSnap = await getDoc(userRef)
    if (!docSnap.exists()) {
      await setDoc(userRef, data, { merge: true })
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!')
      return null
    }
  } catch (error) {
    console.log('error in db', error, data)
  }
}
export const addTransaction = async (data: any) => {
  const uid1 = uuidv4()
  data.uId = uid1;
  try {
    const userRef = doc(db, `pride_transactions`, data.uId)
    const docSnap = await getDoc(userRef)
    if (!docSnap.exists()) {
      await setDoc(userRef, data, { merge: true })
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!')
      return null
    }
  } catch (error) {
    console.log('error in db', error, data)
  }
}

export const fetchPrideStalls = () => {
  return new Promise<DocumentData[]>((resolve, reject) => {
    const prideStallsRef = collection(db, "pride_stall");
    
    const unsubscribe = onSnapshot(prideStallsRef, 
      (snapshot: any) => {
        const stalls = snapshot.docs.map((doc: { uId: any; data: () => any; }) => ({
          id: doc.uId,
          ...doc.data()
        }));
        console.log('check it ', doc)
        resolve(stalls);
      },
      (error) => {
        reject(new Error("Failed to fetch pride stalls"));
      }
    );

    // Return the unsubscribe function
    return unsubscribe;
  });
};

export const steamStallsList = (orgId: unknown, snapshot: SnapshotListenOptions, error: { next?: ((snapshot: QuerySnapshot<DocumentData, DocumentData>) => void) | undefined; error?: (error: FirestoreError) => void; complete?: () => void; }) => {
  const itemsQuery = query(
    collection(db, 'pride_stall'),
    // where('orgId', '==', orgId),
    // where('userStatus', '==', 'active')
  )
  console.log('orgname is ====>', orgId)
  return onSnapshot(itemsQuery, snapshot, error)
}
export const steamTransactionsList = (orgId: unknown, snapshot: SnapshotListenOptions, error: { next?: ((snapshot: QuerySnapshot<DocumentData, DocumentData>) => void) | undefined; error?: (error: FirestoreError) => void; complete?: () => void; }) => {
  const itemsQuery = query(
    collection(db, 'pride_transactions'),
    // where('orgId', '==', orgId),
    // where('userStatus', '==', 'active')
  )
  console.log('orgname is ====>', orgId)
  return onSnapshot(itemsQuery, snapshot, error)
}


export const steamTransactionsListNew = async (orgId: unknown) => {
  try {
    const itemsQuery = query(
      collection(db, 'pride_transactions')
      // You can uncomment and use the following filters if needed
      // where('orgId', '==', orgId),
      // where('userStatus', '==', 'active')
    );

    console.log('orgname is ====>', orgId);

    // Fetch the documents using getDocs
    const querySnapshot = await getDocs(itemsQuery);
    const docs = querySnapshot.docs.map((docSnapshot) => docSnapshot.data());

    return docs;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};


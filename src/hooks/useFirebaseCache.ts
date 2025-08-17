import { db } from '@/firebase';
import { addDoc, collection, CollectionReference, doc, DocumentReference, updateDoc } from 'firebase/firestore';
import { useCollection as useCollectionX, useDocument as useDocumentX } from 'react-firebase-hooks/firestore';

export type UseDocResult<T> = {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
  ref: DocumentReference;
};

export type UseColResult<T> = {
  data: T[];
  loading: boolean;
  error: Error | undefined;
  ref: CollectionReference;
};

export function useFirestoreCache() {
  function useDocument<T = any>(path: string): UseDocResult<T> {
    const ref = doc(db, path);
    const [querySnapshot, loading, error] = useDocumentX<T>(ref as any);

    const documentData = querySnapshot
      ? { id: ref.id, ...(querySnapshot?.data() as T) }
      : undefined;

    return { data: documentData, loading, error: error as Error | undefined, ref };
  }

  function useCollection<T = any>(path: string): UseColResult<T> {
    const ref = collection(db, path);
    const [querySnapshot, loading, error] = useCollectionX<T>(ref as any);

    const data = querySnapshot
      ? querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[]
      : [];

    return { data, loading, error: error as Error | undefined, ref };
  }

  async function addDocument(collectionPath: string, data: any): Promise<{ id: string }> {
    const ref = await addDoc(collection(db, collectionPath), data);
    return { id: ref.id };
  }

  async function updateDocument(docPath: string, data: any): Promise<void> {
    await updateDoc(doc(db, docPath), data);
  }

  return { useDocument, useCollection, addDocument, updateDocument } as const;
}

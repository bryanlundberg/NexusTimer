import { db } from '@/firebase';
import { addDoc, collection, CollectionReference, doc, DocumentReference, getDoc, query as buildQuery, orderBy as orderByClause, limit as limitClause, updateDoc, where as whereClause, WhereFilterOp, runTransaction as firestoreRunTransaction, Transaction } from 'firebase/firestore';
import { useCollection as useCollectionX, useDocument as useDocumentX } from 'react-firebase-hooks/firestore';
import { useEffect, useMemo, useState } from 'react';

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

export type UseCollectionOptions = {
  where?: { field: string; operator: WhereFilterOp | string; value: any }[];
  orderBy?: { field: string; direction?: 'asc' | 'desc' | string }[];
  limit?: number;
};

export function useFirestoreCache() {
  function useDocument<T = any>(path: string): UseDocResult<T> {
    const ref = useMemo(() => doc(db, path), [path]);
    const [querySnapshot, loading, error] = useDocumentX<T>(ref as any);

    useEffect(() => {
      if (error) {
        console.error('[useFirestoreCache.useDocument] Error while subscribing to document', { path, error });
      }
    }, [error, path]);

    const documentData = querySnapshot
      ? { id: ref.id, ...(querySnapshot?.data() as T) }
      : undefined;

    return { data: documentData, loading, error: error as Error | undefined, ref };
  }

  function useDocumentOnce<T = any>(path: string): UseDocResult<T> {
    const ref = useMemo(() => doc(db, path), [path]);
    const [state, setState] = useState<UseDocResult<T>>({
      data: undefined,
      loading: true,
      error: undefined,
      ref,
    });

    useEffect(() => {
      let canceled = false;
      setState(prev => ({ ...prev, loading: true, error: undefined }));
      getDoc(ref)
        .then((snap) => {
          if (canceled) return;
          const documentData = snap.exists() ? ({ id: ref.id, ...(snap.data() as T) } as T) : undefined;
          setState({ data: documentData, loading: false, error: undefined, ref });
        })
        .catch((err: any) => {
          if (canceled) return;
          console.error('[useFirestoreCache.useDocumentOnce] Error while fetching document once', { path, error: err });
          setState({ data: undefined, loading: false, error: err as Error, ref });
        });
      return () => {
        canceled = true;
      };
    }, [ref, path]);

    useEffect(() => {
      if (state.error) {
        console.error('[useFirestoreCache.useDocumentOnce] State error', { path, error: state.error });
      }
    }, [state.error, path]);

    return state;
  }

  function useCollection<T = any>(path: string, options?: UseCollectionOptions): UseColResult<T> {
    const ref = useMemo(() => collection(db, path), [path]);

    const q = useMemo(() => {
      const clauses: any[] = [];
      if (options?.where) {
        for (const w of options.where) {
          clauses.push(whereClause(w.field as any, w.operator as any, w.value));
        }
      }
      if (options?.orderBy) {
        for (const ob of options.orderBy) {
          clauses.push(orderByClause(ob.field as any, (ob.direction || 'asc') as any));
        }
      }
      if (typeof options?.limit === 'number') {
        clauses.push(limitClause(options.limit));
      }
      return clauses.length > 0 ? buildQuery(ref, ...clauses) : ref;
    }, [ref, options]);

    const [querySnapshot, loading, error] = useCollectionX<T>(q as any);

    useEffect(() => {
      if (error) {
        console.error('[useFirestoreCache.useCollection] Error while subscribing to collection', { path, options, error });
      }
    }, [error, options, path]);

    const data = querySnapshot
      ? (querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as T[])
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

  async function runTransaction<T>(updateFunction: (txn: Transaction) => Promise<T> | T): Promise<T> {
    return await firestoreRunTransaction(db, async (txn) => updateFunction(txn));
  }

  return { useDocument, useDocumentOnce, useCollection, addDocument, updateDocument, runTransaction } as const;
}

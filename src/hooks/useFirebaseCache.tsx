"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  addDoc,
  collection as collectionRef,
  type CollectionReference,
  doc as docRef,
  type DocumentReference,
  type Firestore,
  getDoc,
  limit as fwLimit,
  onSnapshot,
  orderBy as fwOrderBy,
  query as buildQuery,
  type QueryConstraint,
  setDoc,
  type Unsubscribe,
  updateDoc as fwUpdateDoc,
  where as fwWhere,
} from 'firebase/firestore';
import { db } from '@/firebase';

// ---------------------------
// Types and helpers
// ---------------------------

export type WithIdPath<T> = T & { id: string; path: string };

export type WhereFilterOp =
  | "<"
  | "<="
  | "=="
  | "!="
  | ">="
  | ">"
  | "array-contains"
  | "in"
  | "array-contains-any"
  | "not-in";

export type OrderByDirection = "asc" | "desc";

export type CollectionQuerySpec = {
  path: string; // e.g. "users" or nested like "companies/123/users"
  where?: Array<[field: string, op: WhereFilterOp, value: any]>;
  orderBy?: Array<[field: string, dir?: OrderByDirection]>;
  limit?: number;
};

export type DocPath = string; // e.g. "users/abc"

type ListenerRecord<T> = {
  unsubscribe: Unsubscribe;
  subscribers: number;
  // simple even emitter: keep a set of notify functions
  notifiers: Set<() => void>;
  lastData?: T;
  lastError?: any;
};

// Module-level caches and registries
const docCache = new Map<string, unknown>();
const collectionCache = new Map<string, unknown[]>();
const listeners = new Map<string, ListenerRecord<any>>();

// Ensure stable keys
function docKey(path: string) {
  return `d:${path}`;
}

function serializeQuerySpec(spec: CollectionQuerySpec): string {
  const parts: string[] = [spec.path];
  if (spec.where?.length) {
    parts.push(
      "w:" +
        spec.where
          .map(([f, op, v]) => `${f}~${op}~${stableJson(v)}`)
          .join("|")
    );
  }
  if (spec.orderBy?.length) {
    parts.push(
      "o:" + spec.orderBy.map(([f, d]) => `${f}~${d ?? "asc"}`).join("|")
    );
  }
  if (spec.limit) parts.push(`l:${spec.limit}`);
  return `c:${parts.join("::")}`;
}

function stableJson(v: any): string {
  try {
    return JSON.stringify(v, Object.keys(v || {}).sort());
  } catch {
    // Fallback for unserializable values
    return String(v);
  }
}

function buildQueryFromSpec(dbRef: Firestore, spec: CollectionQuerySpec) {
  const base = collectionRef(dbRef, spec.path);
  const constraints: QueryConstraint[] = [];
  if (spec.where) {
    for (const [field, op, value] of spec.where) {
      constraints.push(fwWhere(field as any, op as any, value));
    }
  }
  if (spec.orderBy) {
    for (const [field, dir] of spec.orderBy) {
      constraints.push(fwOrderBy(field, dir));
    }
  }
  if (spec.limit) constraints.push(fwLimit(spec.limit));
  return constraints.length ? buildQuery(base, ...constraints) : base;
}

function isBrowser() {
  return typeof window !== "undefined";
}

// ---------------------------
// Public hook API
// ---------------------------

export function useFirestoreCache() {
  // 1) Read a document once
  async function readDocument<T = Record<string, unknown>>(pathOrRef: DocPath | DocumentReference): Promise<WithIdPath<T> | null> {
    const ref = typeof pathOrRef === "string" ? docRef(db, pathOrRef) : pathOrRef;
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = { id: snap.id, path: ref.path, ...(snap.data() as T) } as WithIdPath<T>;
    // Update local cache for quick subsequent reads
    docCache.set(docKey(ref.path), data);
    return data;
  }

  // 2) Add a document to a collection (auto-id by default, optional custom id)
  async function addDocument<T extends object>(
    collectionPathOrRef: string | CollectionReference,
    data: T,
    opts?: { id?: string; merge?: boolean }
  ): Promise<WithIdPath<T>> {
    const col = typeof collectionPathOrRef === "string" ? collectionRef(db, collectionPathOrRef) : collectionPathOrRef;
    const merge = opts?.merge ?? false;

    let ref: DocumentReference;
    if (opts?.id) {
      // Create or overwrite specific id
      ref = docRef(col, opts.id);
      await setDoc(ref, data as any, { merge });
    } else {
      // Auto-id
      const res = await addDoc(col as any, data as any);
      ref = res as any;
    }

    // Do not update caches here; let Firestore snapshots refresh caches after write confirmation.
    return { id: ref.id, path: ref.path, ...(data) } as WithIdPath<T>;
  }

  // 3) Update a document (merge by default)
  async function updateDocument<T extends object>(
    pathOrRef: DocPath | DocumentReference,
    data: Partial<T>,
    opts?: { merge?: boolean }
  ): Promise<WithIdPath<Partial<T>>> {
    const ref = typeof pathOrRef === "string" ? docRef(db, pathOrRef) : pathOrRef;
    const merge = opts?.merge ?? true;
    if (merge) await setDoc(ref, data as any, { merge: true });
    else await fwUpdateDoc(ref, data as any);

    // Do not optimistically update caches; let snapshots update caches after Firestore confirms the write.
    return { id: ref.id, path: ref.path, ...(data) } as WithIdPath<Partial<T>>;
  }

  // 3) Subscribe to a single document and share listener/data
  function useDocument<T = Record<string, unknown>>(pathOrRef: DocPath | DocumentReference) {
    const ref = useMemo(
      () => (typeof pathOrRef === "string" ? docRef(db, pathOrRef) : pathOrRef),
      [pathOrRef]
    );
    const k = useMemo(() => docKey(ref.path), [ref.path]);

    const [, forceRender] = useState(0);
    const [error, setError] = useState<any>(undefined);
    const mounted = useRef(true);

    useEffect(() => {
      mounted.current = true;
      if (!isBrowser()) return;

      let rec = listeners.get(k)
      if (!rec) {
        // Create shared listener
        const unsubscribe = onSnapshot(
          ref,
          (snap) => {
            if (!snap.exists()) {
              docCache.set(k, null);
            } else {
              docCache.set(k, { id: snap.id, path: ref.path, ...(snap.data() as T) } as WithIdPath<T>);
            }
            notify(k);
          },
          (err) => {
            const r = listeners.get(k);
            if (r) r.lastError = err;
            setError(err);
            notify(k);
          }
        );
        rec = {
          unsubscribe,
          subscribers: 0,
          notifiers: new Set(),
        };
        listeners.set(k, rec);
      }

      // Register this component as a subscriber
      const notifyThis = () => mounted.current && forceRender((n) => n + 1);
      rec.subscribers += 1;
      rec.notifiers.add(notifyThis);

      // Initial error propagation if any
      if (rec.lastError) setError(rec.lastError);

      return () => {
        mounted.current = false;
        const r = listeners.get(k);
        if (!r) return;
        r.notifiers.delete(notifyThis);
        r.subscribers -= 1;
        if (r.subscribers <= 0) {
          // Tear down shared listener
          try {
            r.unsubscribe();
          } catch {}
          listeners.delete(k);
        }
      };
    }, [k, ref]);

    const data = docCache.get(k) as WithIdPath<T> | null | undefined;
    const loading = typeof data === "undefined" && !error;

    return { data, loading, error } as const;
  }

  // 4) Subscribe to a collection (with query spec) and share listener/data
  function useCollection<T = Record<string, unknown>>(spec: CollectionQuerySpec) {
    const key = useMemo(() => serializeQuerySpec(spec), [JSON.stringify(spec)]);

    const [, forceRender] = useState(0);
    const [error, setError] = useState<any>(undefined);
    const mounted = useRef(true);

    useEffect(() => {
      mounted.current = true;
      if (!isBrowser()) return;

      let rec = listeners.get(key) as ListenerRecord<any[]> | undefined;
      if (!rec) {
        const q = buildQueryFromSpec(db, spec);
        const unsubscribe = onSnapshot(
          q as any,
          (snap) => {
            const list = snap.docs.map((d) => ({ id: d.id, path: `${spec.path}/${d.id}`, ...(d.data() as T) })) as Array<WithIdPath<T>>;
            collectionCache.set(key, list);
            notify(key);
          },
          (err) => {
            const r = listeners.get(key);
            if (r) r.lastError = err;
            setError(err);
            notify(key);
          }
        );
        rec = {
          unsubscribe,
          subscribers: 0,
          notifiers: new Set(),
        } as ListenerRecord<any[]>;
        listeners.set(key, rec);
      }

      const notifyThis = () => mounted.current && forceRender((n) => n + 1);
      rec.subscribers += 1;
      rec.notifiers.add(notifyThis);
      if (rec.lastError) setError(rec.lastError);

      return () => {
        mounted.current = false;
        const r = listeners.get(key);
        if (!r) return;
        r.notifiers.delete(notifyThis);
        r.subscribers -= 1;
        if (r.subscribers <= 0) {
          try {
            r.unsubscribe();
          } catch {}
          listeners.delete(key);
        }
      };
    }, [key, JSON.stringify(spec)]);

    const data = collectionCache.get(key) as Array<WithIdPath<T>> | undefined;
    const loading = typeof data === "undefined" && !error;

    return { data, loading, error } as const;
  }

  return {
    // one-off utilities
    readDocument,
    addDocument,
    updateDocument,
    // hook-based listeners (shared/cached)
    useDocument,
    useCollection,
  } as const;
}

// Notify helpers
function notify(key: string) {
  const rec = listeners.get(key);
  if (!rec) return;
  // Clone to avoid mutation during iteration
  [...rec.notifiers].forEach((n) => {
    try {
      n();
    } catch {}
  });
}

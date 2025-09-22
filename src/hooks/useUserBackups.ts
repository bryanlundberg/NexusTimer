import { useEffect, useState } from 'react';
import _ from 'lodash';
import { decompressSync, strFromU8 } from 'fflate';
import { Cube } from '@/interfaces/Cube';

interface User {
  _id: string;
  backup?: { url?: string } | null;
}

export type UserCubes = Record<string, Record<string, Cube[] | null> | null>;

export function useUserBackups(users: User[]) {
  const [userCubes, setUserCubes] = useState<UserCubes>({});

  useEffect(() => {
    let isMounted = true;

    async function loadBackups() {
      const entries = await Promise.all(
        users.map(async (user) => {
          try {
            if (user.backup?.url) {
              const response = await fetch(user.backup.url);
              if (!response.ok) throw new Error('Network response was not ok');
              const compressed = new Uint8Array(await response.arrayBuffer());
              const decompressed = decompressSync(compressed);
              const data = strFromU8(decompressed);
              const cubeData = JSON.parse(data) as Cube[];
              const merged = _.groupBy(cubeData, 'category');
              return [user._id, merged] as const;
            }
          } catch (e) {
            console.error('Error loading backup for user', user._id, e);
          }
          return [user._id, null] as const;
        })
      );

      if (!isMounted) return;
      setUserCubes(Object.fromEntries(entries));
    }

    if (users.length) loadBackups();
    return () => {
      isMounted = false;
    };
  }, [users]);

  return userCubes;
}

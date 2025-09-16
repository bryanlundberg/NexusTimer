"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import EmptyCubes from '@/components/cubes/EmptyCubes';
import DialogImportBackup from '@/components/dialogs/dialog-import-backup/dialog-import-backup';
import { useTimerStore } from '@/store/timerStore';
import { useRouter } from 'next/navigation';

export default function DialogFirstRunNoCubes() {
  const cubes = useTimerStore(store => store.cubes);
  const setIsOpenDrawerNewCollection = useTimerStore(store => store.setIsOpenDrawerNewCollection);
  const [showImport, setShowImport] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const noCubes = useMemo(() => Array.isArray(cubes) && cubes.length === 0, [cubes]);

  useEffect(() => {
    if (noCubes) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [noCubes]);

  if (!noCubes) return null;

  const handleCreate = () => {
    setIsOpenDrawerNewCollection(true);
    router.push('/cubes');
    setIsOpen(false);
    setShowImport(false);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setShowImport(false);
        }
      }}
    >
      {showImport ? (
        <DialogImportBackup />
      ) : (
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bienvenido a NexusTimer</DialogTitle>
            <DialogDescription>
              Aún no tienes colecciones creadas. Puedes crear tu primera colección o importar un respaldo para comenzar.
            </DialogDescription>
          </DialogHeader>

          <EmptyCubes hideDescription hideTitle className="min-h-[320px] border rounded-lg" onCreate={handleCreate} />
        </DialogContent>
      )}
    </Dialog>
  );
}

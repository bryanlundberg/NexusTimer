'use client'
import { motion } from 'framer-motion';
import { GitCompareIcon } from 'lucide-react';
import { useCompareUsersStore } from '@/store/CompareUsers';

export default function FloatButton() {
  const users = useCompareUsersStore(state => state.users);
  return (
    <motion.div
      className={'size-16 bg-primary bottom-5 right-5 rounded-full text-primary-foreground border cursor-pointer fixed'}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={'relative flex items-center justify-center w-full h-full'}>
        <GitCompareIcon className={'size-8'} strokeWidth={1.5}/>
        <div className={'size-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs absolute -top-1 right-0'}>{users.length}</div>
      </div>
    </motion.div>
  )
}

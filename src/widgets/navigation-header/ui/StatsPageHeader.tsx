import DateRangeSelect from '@/features/date-range-select/ui/DateRangeSelect'
import MainCubeSelector from '@/features/select-cube/ui/MainCubeSelector'
import { motion } from 'framer-motion'

export default function StatsPageHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between items-center gap-3 w-full mb-4"
    >
      <MainCubeSelector />
      <DateRangeSelect />
    </motion.div>
  )
}

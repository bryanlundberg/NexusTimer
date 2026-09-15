'use client'

import { useParams } from 'next/navigation'
import { ConversationView } from '@/widgets/chat/ui/ConversationView'

export default function ConversationPage() {
  const { userId } = useParams<{ userId: string }>()

  return <ConversationView key={userId} userId={userId} />
}

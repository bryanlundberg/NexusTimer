import brevo from '@/shared/lib/brevo'
import User from '@/entities/user/model/user'
import { getMutualFriendIds } from '@/entities/friendship/server/friends'
import FriendRequestEmailLog from '@/entities/friendship/model/friend-request-email-log'
import { isDuplicateKeyError } from '@/shared/api/mongo-errors'
import { pairKeyOf } from '@/shared/lib/pair-key'
import { resolvePrivacy, type PrivacySettings } from '@/entities/privacy/model/types'
import { getFriendRequestEmailSubject, renderFriendRequestEmail } from './friend-request-email-template'

type EmailUser = {
  name: string
  email?: string
  image?: string
  wcaId?: string
  privacy?: Partial<PrivacySettings>
}

const appUrl = () =>
  process.env.NEXTAUTH_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://nexustimer.com' : 'http://localhost:3000')

async function claimFirstEmail(senderId: string, recipientId: string): Promise<boolean> {
  try {
    await FriendRequestEmailLog.create({ pairKey: pairKeyOf(senderId, recipientId) })
    return true
  } catch (error) {
    if (isDuplicateKeyError(error)) return false
    throw error
  }
}

export async function sendFriendRequestEmail(senderId: string, recipientId: string) {
  const [sender, recipient, mutualIds] = await Promise.all([
    User.findById(senderId).select('name image wcaId').lean<EmailUser>(),
    User.findById(recipientId).select('name email privacy').lean<EmailUser>(),
    getMutualFriendIds(senderId, recipientId)
  ])
  if (!sender || !recipient?.email || !resolvePrivacy(recipient.privacy).friendRequestEmails) return
  if (!(await claimFirstEmail(senderId, recipientId))) return

  await brevo.transactionalEmails.sendTransacEmail({
    to: [{ email: recipient.email, name: recipient.name }],
    sender: { name: 'Nexus Timer', email: 'noreply@nexustimer.com' },
    subject: getFriendRequestEmailSubject(sender.name),
    htmlContent: renderFriendRequestEmail({
      sender: { id: senderId, name: sender.name, image: sender.image, wcaId: sender.wcaId },
      mutualCount: mutualIds.length,
      appUrl: appUrl()
    })
  })
}

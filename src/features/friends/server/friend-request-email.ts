import brevo from '@/shared/lib/brevo'
import User from '@/entities/user/model/user'
import { getMutualFriendIds } from '@/entities/friendship/server/friends'
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

export async function sendFriendRequestEmail(senderId: string, recipientId: string) {
  const [sender, recipient, mutualIds] = await Promise.all([
    User.findById(senderId).select('name image wcaId').lean<EmailUser>(),
    User.findById(recipientId).select('name email privacy').lean<EmailUser>(),
    getMutualFriendIds(senderId, recipientId)
  ])
  if (!sender || !recipient?.email || !resolvePrivacy(recipient.privacy).friendRequestEmails) return

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

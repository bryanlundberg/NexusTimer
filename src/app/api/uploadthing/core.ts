import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { auth } from '@/shared/config/auth/auth'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: '32MB',
      maxFileCount: 1
    }
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await auth()

      console.log(session)
      // If you throw, the user will not be able to upload
      if (!session) throw new UploadThingError('Unauthorized')

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId)

      console.log('file url', file.ufsUrl)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId }
    }),
  backupUploader: f({
    blob: {
      maxFileSize: '32MB',
      maxFileCount: 1
    }
  })
    .middleware(async () => {
      const session = await auth()
      if (!session) throw new UploadThingError('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await connectDB()

      const user = await User.findById(metadata.userId)
      if (!user) throw new UploadThingError('User not found')

      if (user?.backup?.url) {
        try {
          await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/uploadthing`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: user.backup.url })
          })
        } catch (error) {
          console.log('Error deleting previous backup:', error)
        }
      }

      await User.findByIdAndUpdate(metadata.userId, { backup: { url: file.ufsUrl, updatedAt: Date.now() } })

      return { uploadedBy: metadata.userId, url: file.ufsUrl }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

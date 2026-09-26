import { defineMiddleware } from 'astro:middleware'
import { readSession } from '@/features/auth/model/session'

const AUTH_PAGE = '/auth'

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url

  if (pathname.startsWith('/api/auth/')) return next()

  const user = await readSession(context.cookies)
  context.locals.user = user

  if (!user && pathname !== AUTH_PAGE) return context.redirect(AUTH_PAGE)
  if (user && pathname === AUTH_PAGE) return context.redirect('/')

  return next()
})

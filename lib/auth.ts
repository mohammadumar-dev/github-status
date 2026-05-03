import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: { params: { scope: 'read:user user:email' } },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
  events: {
    async signIn({ user, profile }) {
      // events.signIn fires after the adapter has created/linked the user record
      if (profile?.login && user.id) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { githubUsername: profile.login as string },
          })
        } catch {
          // Non-fatal
        }
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
})

// lib/auth.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import { db } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        
        // Find user in the database
        const user = await db.user.findUnique({
          where: {
            username: credentials.username
          }
        });
        
        if (user) {
          // Check if password matches
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (isPasswordValid) {
            // Return user object without password
            return {
              id: user.id,
              username: user.username
            };
          }
        }
        
        // Return null if credentials are invalid
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'default_secret',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  }
};
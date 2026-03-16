import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname.startsWith('/login');
      
      // Proteger todas as rotas
      if (!isLoggedIn && !isLoginPage) {
        return false; // Redireciona para login
      }
      
      // Se logado e no login, vai para dashboard
      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL('/', nextUrl));
      }
      
      return true;
    },
  },
  providers: [], // Configurado em auth.ts
} satisfies NextAuthConfig;

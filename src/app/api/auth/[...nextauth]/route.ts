// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                try {
                    const response = await axios.post('https://api.digitalmarke.bdic.ng/api/auth/login', {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const loginData = response.data.data;

                    console.log("Login response: ",response.data.data)
                    if (loginData) {

                        return {
                            id: credentials.email, // Use email as ID
                            email: credentials.email,
                            accessToken: loginData.token, // Store backend token
                            roles: loginData.roles,
                        };
                    }
                    return null;
                } catch (error) {
                    throw new Error(
                        axios.isAxiosError(error)
                            ? error.response?.data?.message || 'Invalid email or password'
                            : 'An unexpected error occurred'
                    );
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                token.accessToken = user.accessToken; // Backend token
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                token.roles = user.roles;
            }

            return token;
        },
        async session({ session, token }) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            session.user.id = token.id as string;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            session.user.email = token.email as string;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            session.accessToken = token.accessToken as string; // Backend token
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            session.user.roles = token.roles as string[];
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET, // Required for NextAuth session security
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
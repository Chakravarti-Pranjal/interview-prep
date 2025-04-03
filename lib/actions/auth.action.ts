'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7 ;

export const signUp = async (params: SignUpParams) => {
    const {uid, name, email} = params;
    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return{
                success: false,
                message: 'User already esists. Please sign in instead.'
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'Accout created successfully. Please sign in.'
        }

    } catch (e: any) {
        console.error('Error creating a user', e);

        if(e.code === 'auth/email-already-exists'){
            return {
                success: false,
                message: 'This email is already exists.'
            }
        }

        return {
            success: false,
            message: 'Failed to create an account'
        }
    }
}

export const signIn = async (params: SignInParams) => {
    const {email, idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if(!userRecord){
            return {
                success: false,
                message: 'User does not exist. Create an account instead.'
            }
        }

        await setSessionCookie(idToken);
    } catch (error:any) {
        console.log(error);

        return {
            success: false,
            message: 'Failed to log into an account.'
        }
    }
}

export const setSessionCookie = async (idToken: string) => {
    const cookieStore = await cookies()
    console.log("ID Token:", idToken);
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000 
    });
    console.log("Session Cookie Created:", sessionCookie);

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });

    console.log("Session Cookie Set in Store");
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    
    const sessionCookie = cookieStore.get('session')?.value;
    console.log("Session Cookie:", sessionCookie);
    if(!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        console.log("Decoded Claims:", decodedClaims);

        const userRecord = await db.collection('users')
                                   .doc(decodedClaims.uid)
                                   .get();
        console.log("User Record Exists:", userRecord.exists);
        if(!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User ;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const isAuthenticated = async() => {
    const user = await getCurrentUser();
    return !!user; 
}
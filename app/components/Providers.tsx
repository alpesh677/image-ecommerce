'use client'

import { SessionProvider } from "next-auth/react"
import { ImageKitProvider } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

export default function Providers({ children }: { children: React.ReactNode }) {

    const authenticator = async () => {
        try {
            const res = await fetch("/api/imagekit-auth");
            if(!res.ok){
                throw new Error("Failed to authenticate with Imagekit");
            }

            return res.json();
        } catch (error) {
            console.error("Error authenticating with Imagekit:", error);
            throw error;
        }
    }

    return (
        <SessionProvider>
            <ImageKitProvider urlEndpoint={urlEndpoint} publicKey={publicKey} authenticator={authenticator}>
                {children}
            </ImageKitProvider>
        </SessionProvider>
    );
}
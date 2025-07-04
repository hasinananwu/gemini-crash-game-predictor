import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from './useTelegram';

export const useApiKey = () => {
    const { tg } = useTelegram();
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Use the official method to check for version support.
    // This is safer than just checking for tg.CloudStorage existence.
    const isCloudStorageSupported = tg?.isVersionAtLeast?.('6.1');

    useEffect(() => {
        setIsLoading(true);
        if (isCloudStorageSupported) {
            tg.CloudStorage.getItem('gemini_api_key', (error: any, value: string | null) => {
                if (error) {
                    console.error('Failed to load API key from CloudStorage:', error);
                    // Fallback to local storage if there's a runtime error with cloud storage
                    const localKey = localStorage.getItem('gemini_api_key');
                    setApiKey(localKey);
                } else {
                    setApiKey(value);
                }
                setIsLoading(false);
            });
        } else {
            // Fallback for non-telegram or old telegram clients
            const localKey = localStorage.getItem('gemini_api_key');
            setApiKey(localKey);
            setIsLoading(false);
        }
    }, [isCloudStorageSupported, tg]);

    const saveApiKey = useCallback(async (key: string): Promise<void> => {
        const sanitizedKey = key.trim();
        setApiKey(sanitizedKey);
        return new Promise((resolve, reject) => {
            if (isCloudStorageSupported) {
                tg.CloudStorage.setItem('gemini_api_key', sanitizedKey, (error: any) => {
                    if (error) {
                        console.error('Failed to save API key to CloudStorage:', error);
                        // Try to save to localStorage as a fallback on error
                        localStorage.setItem('gemini_api_key', sanitizedKey);
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            } else {
                // Fallback for non-telegram or old telegram clients
                try {
                    localStorage.setItem('gemini_api_key', sanitizedKey);
                    resolve();
                } catch (e) {
                    console.error("Failed to save API key to localStorage:", e);
                    reject(e);
                }
            }
        });
    }, [isCloudStorageSupported, tg]);

    // The component using this hook can decide what to do based on support status.
    return { apiKey, saveApiKey, isLoading, isCloudStorageSupported: !!isCloudStorageSupported };
};

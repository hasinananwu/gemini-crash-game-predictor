
import { useEffect, useMemo, useCallback } from 'react';

// Make Telegram's WebApp type available globally
declare global {
    interface Window {
        Telegram: any;
    }
}

/**
 * A custom hook to interact with the Telegram Mini App API.
 * Provides access to the WebApp object, user data, and theme parameters.
 * @returns An object with the Telegram WebApp instance, ready function, user data, and theme parameters.
 */
export const useTelegram = () => {
    const tg = useMemo(() => {
        if (typeof window !== 'undefined') {
            return window.Telegram?.WebApp;
        }
        return null;
    }, []);

    const ready = useCallback(() => {
        if (tg) {
            tg.ready();
            tg.expand();
        }
    }, [tg]);

    return {
        tg,
        ready,
        user: tg?.initDataUnsafe?.user,
        themeParams: tg?.themeParams,
    };
};

import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export const useSessionTimeout = (timeoutMinutes: number = 5) => {
    const appState = useRef(AppState.currentState);
    const backgroundTime = useRef<number | null>(null);

    useEffect(() => {
        if (__DEV__) {
            return;
        }

        const Updates = require('expo-updates');

        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                if (backgroundTime.current) {
                    const timeElapsed = Date.now() - backgroundTime.current;
                    const timeoutMs = timeoutMinutes * 60 * 1000;

                    if (timeElapsed > timeoutMs) {
                        console.log('Час сесії вийшов. Перезавантаження...');
                        Updates.reloadAsync();
                    }
                }
            }
            else if (nextAppState === 'background') {
                backgroundTime.current = Date.now();
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [timeoutMinutes]);
};
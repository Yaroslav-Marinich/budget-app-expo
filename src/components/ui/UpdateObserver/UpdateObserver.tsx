import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const UpdateObserverContent = () => {
    const Updates = require('expo-updates');

    const { isUpdatePending, isDownloading } = Updates.useUpdates();

    if (!isDownloading && !isUpdatePending) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.toast}>

                {isDownloading && (
                    <View style={styles.row}>
                        <ActivityIndicator size="small" color="#4CAF50" />
                        <Text style={styles.text}>Завантаження оновлення...</Text>
                    </View>
                )}

                {isUpdatePending && (
                    <View style={styles.row}>
                        <Text style={styles.successText}>🚀 Оновлення готове</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => Updates.reloadAsync()}
                        >
                            <Text style={styles.buttonText}>Перезапустити</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>
        </View>
    );
};

export const UpdateObserver = () => {
    if (__DEV__) {
        return null;
    }

    return <UpdateObserverContent />;
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        zIndex: 9999,
    },
    toast: {
        backgroundColor: '#2A2A2A',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    text: {
        color: '#E0E0E0',
        fontSize: 14,
        fontWeight: '500'
    },
    successText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 13
    },
});
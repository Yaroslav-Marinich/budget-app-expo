import * as Updates from 'expo-updates';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const UpdateObserver = () => {
    const { isUpdatePending, isDownloading } = Updates.useUpdates();

    if (!isDownloading && !isUpdatePending) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {isDownloading && (
                    <View style={styles.row}>
                        <ActivityIndicator size="small" color="#4CAF50" />
                        <Text style={styles.text}>Завантаження оновлення...</Text>
                    </View>
                )}

                {isUpdatePending && (
                    <View>
                        <Text style={styles.successText}>✨ Нова версія додатка готова!</Text>
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

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        zIndex: 9999,
    },
    card: {
        backgroundColor: '#1E1E1E',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        alignItems: 'center',
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    text: { color: '#bbb', fontSize: 14, fontWeight: '500' },
    successText: { color: '#4CAF50', fontWeight: 'bold', fontSize: 15, textAlign: 'center', marginBottom: 10 },
    button: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
import * as Updates from 'expo-updates';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const UpdateObserver = () => {
    // Витягуємо лише ті властивості, які реально існують в UseUpdatesReturnType
    const {
        isUpdateAvailable,
        isUpdatePending,
        isChecking,
        isDownloading,
        checkError,
        downloadError,
    } = Updates.useUpdates();

    // Об'єднуємо можливі помилки для зручного відображення
    const error = checkError || downloadError;

    // Якщо нічого не відбувається і немає помилок — ховаємо віджет
    if (!isChecking && !isDownloading && !isUpdateAvailable && !isUpdatePending && !error) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>🚀 EAS Update Manager</Text>

                {isChecking && (
                    <View style={styles.row}>
                        <ActivityIndicator size="small" color="#2196F3" />
                        <Text style={styles.text}>Перевіряю наявність оновлень...</Text>
                    </View>
                )}

                {isDownloading && (
                    <View style={styles.row}>
                        <ActivityIndicator size="small" color="#4CAF50" />
                        <Text style={styles.text}>Завантажую нову версію...</Text>
                    </View>
                )}

                {isUpdateAvailable && !isUpdatePending && !isDownloading && (
                    <Text style={styles.text}>✅ Оновлення знайдено на сервері!</Text>
                )}

                {isUpdatePending && (
                    <View>
                        <Text style={styles.successText}>✨ Нова версія готова до запуску!</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => Updates.reloadAsync()}
                        >
                            <Text style={styles.buttonText}>Перезавантажити зараз</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {error && (
                    <Text style={styles.errorText}>❌ Помилка: {error.message}</Text>
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
    },
    title: { color: '#fff', fontWeight: 'bold', marginBottom: 10, fontSize: 14 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    text: { color: '#bbb', fontSize: 13 },
    successText: { color: '#4CAF50', fontWeight: 'bold', marginVertical: 10 },
    errorText: { color: '#FF5252', fontSize: 12, marginTop: 5 },
    button: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 5,
    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
});
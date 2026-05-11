import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DefaultModal } from '@/src/components/ui/DefaultModal/DefaultModal';
import { auth } from '@/src/config/firebase';
import { Colors } from '@/src/constants/Colors';
import { useLoader } from '@/src/context/LoaderContext';
import { appAlert } from '@/src/services/alert';
import {
    cancelMeterNotifications,
    requestNotificationPermissions,
    scheduleMeterNotification
} from '@/src/services/notifications';
import {
    deleteMeterSettingsFromDB,
    getNotificationSettings,
    saveNotificationSettings
} from '@/src/services/setup';
import { styles } from './NotificationsScreen.styles';

export const NotificationsScreen = () => {
  const userId = auth.currentUser?.uid;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  const [isMetersEnabled, setIsMetersEnabled] = useState(false);
  const [isMetersModalVisible, setMetersModalVisible] = useState(false);
  const [dayOption, setDayOption] = useState<'first' | 'second_last' | 'last'>('last');
  const [meterTime, setMeterTime] = useState('12:00');

  useEffect(() => {
    const loadSettings = async () => {
      if (!userId) return;

      showLoader();
      const settings = await getNotificationSettings(userId);
      if (settings) {
        setIsMetersEnabled(settings.enabled);
        setDayOption(settings.dayOption);
        setMeterTime(settings.time);
      }
      hideLoader();
    };

    loadSettings();
  }, [userId]);

const handleToggleMeters = async (value: boolean) => {
    if (!userId) return;

    if (value) {
      setIsMetersEnabled(true); 
      setMetersModalVisible(true);
    } else {
      try {
        showLoader();
        await cancelMeterNotifications();
        await deleteMeterSettingsFromDB(userId);
        
        setIsMetersEnabled(false);
        appAlert('Вимкнено', 'Нагадування та ваші налаштування повністю видалені.');
      } catch (error) {
        appAlert('Помилка', 'Не вдалося повністю вимкнути сповіщення.');
      } finally {
        hideLoader();
      }
    }
  };

const saveMetersSettings = async () => {
  if (!userId) return;

  const timeParts = meterTime.split(':');
  if (timeParts.length !== 2) {
    appAlert('Помилка', 'Формат часу ГГ:ХХ');
    return;
  }
  const hour = parseInt(timeParts[0]);
  const minute = parseInt(timeParts[1]);

  if (isNaN(hour) || hour < 0 || hour > 23 || isNaN(minute) || minute < 0 || minute > 59) {
    appAlert('Помилка', 'Некоректний час');
    return;
  }

  try {
    showLoader();

    const granted = await requestNotificationPermissions();
    if (!granted) {
      appAlert('Увага', 'Ви не надали дозвіл на сповіщення. Будь ласка, увімкніть їх у налаштуваннях телефону.');
      hideLoader();
      return;
    }
    
    await scheduleMeterNotification(dayOption, hour, minute);
    
    await saveNotificationSettings(userId, {
      enabled: true,
      dayOption,
      time: meterTime
    });

    setIsMetersEnabled(true);
    
    appAlert('Збережено', 'Нагадування активовано!');
    setMetersModalVisible(false);
  } catch (error) {
    console.error(error);
    appAlert('Помилка', 'Не вдалося зберегти налаштування.');
  } finally {
    hideLoader();
  }
    };
    
    // Обробник закриття модалки без збереження
  const handleCloseModal = async () => {
    setMetersModalVisible(false);

    if (userId) {
      const settings = await getNotificationSettings(userId);
      if (!settings?.enabled) {
        setIsMetersEnabled(false); 
      }
    }
  };

  const testNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏳ Час передати показники!',
        body: 'Не забудьте зайти в додаток і внести актуальні показники лічильників.',
        sound: true,
        data: { url: '/meters' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
      },
    });

    appAlert('Тест запущено', 'Швидше згортай додаток! Справжнє сповіщення прилетить через 10 секунд.');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={28} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Сповіщення</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        <View style={styles.card}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Показники лічильників</Text>
            <Text style={styles.cardDesc}>
              {isMetersEnabled
                ? `Нагадувати о ${meterTime} ${
                    dayOption === 'first' ? 'першого' :
                    dayOption === 'second_last' ? 'передостаннього' : 'останнього'
                  } дня`
                : 'Нагадування вимкнено'}
            </Text>
          </View>
          <View style={styles.cardActions}>
            {isMetersEnabled && (
              <TouchableOpacity
                style={styles.settingsBtn}
                onPress={() => setMetersModalVisible(true)}
              >
                <Ionicons name="options-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
            )}
            <Switch
              value={isMetersEnabled}
              onValueChange={handleToggleMeters}
              trackColor={{ false: Colors.surfaceMuted, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <View style={[styles.card, { opacity: 0.5 }]}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Ліміт бюджету</Text>
            <Text style={styles.cardDesc}>Повідомляти при перевищенні ліміту витрат</Text>
          </View>
          <Switch value={false} disabled />
        </View>

        <View style={[styles.card, { opacity: 0.5 }]}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Сімейний бюджет</Text>
            <Text style={styles.cardDesc}>Нові транзакції від членів сім&apos;ї</Text>
          </View>
          <Switch value={false} disabled />
        </View>
      </ScrollView>

      <DefaultModal visible={isMetersModalVisible} onClose={handleCloseModal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Налаштування нагадування</Text>
          <TouchableOpacity onPress={handleCloseModal} style={{ padding: 5 }}>
            <Ionicons name="close" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Коли нагадувати?</Text>
        <View style={styles.chipContainer}>
          <TouchableOpacity
            style={[styles.chip, dayOption === 'first' && styles.chipActive]}
            onPress={() => setDayOption('first')}
          >
            <Text style={[styles.chipText, dayOption === 'first' && styles.chipTextActive]}>1-й день</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, dayOption === 'second_last' && styles.chipActive]}
            onPress={() => setDayOption('second_last')}
          >
            <Text style={[styles.chipText, dayOption === 'second_last' && styles.chipTextActive]}>Передостанній</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, dayOption === 'last' && styles.chipActive]}
            onPress={() => setDayOption('last')}
          >
            <Text style={[styles.chipText, dayOption === 'last' && styles.chipTextActive]}>Останній</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Точний час (ГГ:ХХ)</Text>
        <TextInput
          style={styles.input}
          value={meterTime}
          onChangeText={setMeterTime}
          placeholder="Наприклад: 12:00"
          maxLength={5}
          placeholderTextColor={Colors.textSecondary}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={saveMetersSettings}>
          <Text style={styles.saveBtnText}>Зберегти</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: Colors.accent, marginTop: 0, padding: 12 }]}
          onPress={testNotification}
        >
          <Text style={styles.saveBtnText}>Перевірити зараз (10 сек)</Text>
        </TouchableOpacity>
      </DefaultModal>
    </View>
  );
};
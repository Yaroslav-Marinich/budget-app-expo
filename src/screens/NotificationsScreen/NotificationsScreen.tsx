import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { auth } from '@/src/config/firebase';
import { useLoader } from '@/src/context/LoaderContext';
import { useTheme } from '@/src/context/ThemeContext';
import { appAlert } from '@/src/services/alert';

import {
  cancelMeterNotifications,
  cancelSubscriptionNotifications,
  requestNotificationPermissions,
  scheduleMeterNotification,
  scheduleSubscriptionNotifications
} from '@/src/services/notifications';
import {
  deleteMeterSettingsFromDB,
  deleteSubSettingsFromDB,
  getNotificationSettings,
  getSubNotificationSettings,
  saveNotificationSettings,
  saveSubNotificationSettings
} from '@/src/services/setup';
import { getSubscriptions } from '@/src/services/subscriptions';

import { getStyles } from './NotificationsScreen.styles';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';

export const NotificationsScreen = () => {
  const userId = auth.currentUser?.uid;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  // ==========================================
  // СТЕЙТИ: ЛІЧИЛЬНИКИ
  // ==========================================
  const [isMetersEnabled, setIsMetersEnabled] = useState(false);
  const [isMetersModalVisible, setMetersModalVisible] = useState(false);
  const [dayOption, setDayOption] = useState<'first' | 'second_last' | 'last'>('last');
  const [meterTime, setMeterTime] = useState('12:00');

  // ==========================================
  // СТЕЙТИ: ПІДПИСКИ
  // ==========================================
  const [isSubsEnabled, setIsSubsEnabled] = useState(false);
  const [isSubsModalVisible, setSubsModalVisible] = useState(false);
  const [subDayOption, setSubDayOption] = useState<number>(1);
  const [subTime, setSubTime] = useState('10:00');

  useEffect(() => {
    const loadSettings = async () => {
      if (!userId) return;
      showLoader();

      // Лічильники
      const meterSettings = await getNotificationSettings(userId);
      if (meterSettings) {
        setIsMetersEnabled(meterSettings.enabled);
        setDayOption(meterSettings.dayOption);
        setMeterTime(meterSettings.time);
      }

      // Підписки
      const subSettings = await getSubNotificationSettings(userId);
      if (subSettings) {
        setIsSubsEnabled(subSettings.enabled);
        setSubDayOption(subSettings.offsetDays);
        setSubTime(subSettings.time);
      }

      hideLoader();
    };

    loadSettings();
  }, [userId]);

  // ==========================================
  // ЛОГІКА ДЛЯ ЛІЧИЛЬНИКІВ
  // ==========================================
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
        appAlert('Вимкнено', 'Нагадування про лічильники видалені.');
      } catch (error) {
        appAlert('Помилка', 'Не вдалося вимкнути сповіщення.');
      } finally {
        hideLoader();
      }
    }
  };

  const saveMetersSettings = async () => {
    if (!userId) return;
    const timeParts = meterTime.split(':');
    if (timeParts.length !== 2) return appAlert('Помилка', 'Формат часу ГГ:ХХ');
    const hour = parseInt(timeParts[0]);
    const minute = parseInt(timeParts[1]);

    if (isNaN(hour) || hour < 0 || hour > 23 || isNaN(minute) || minute < 0 || minute > 59) {
      return appAlert('Помилка', 'Некоректний час');
    }

    try {
      showLoader();
      const granted = await requestNotificationPermissions();
      if (!granted) {
        appAlert('Увага', 'Надайте дозвіл на сповіщення в налаштуваннях телефону.');
        hideLoader();
        return;
      }

      await scheduleMeterNotification(dayOption, hour, minute);
      await saveNotificationSettings(userId, { enabled: true, dayOption, time: meterTime });

      setIsMetersEnabled(true);
      appAlert('Збережено', 'Нагадування про лічильники активовано!');
      setMetersModalVisible(false);
    } catch (error) {
      appAlert('Помилка', 'Не вдалося зберегти налаштування.');
    } finally {
      hideLoader();
    }
  };

  const handleCloseMeterModal = async () => {
    setMetersModalVisible(false);
    if (userId) {
      const settings = await getNotificationSettings(userId);
      if (!settings?.enabled) setIsMetersEnabled(false);
    }
  };

  // ==========================================
  // ЛОГІКА ДЛЯ ПІДПИСОК
  // ==========================================
  const handleToggleSubs = async (value: boolean) => {
    if (!userId) return;
    if (value) {
      setIsSubsEnabled(true);
      setSubsModalVisible(true);
    } else {
      try {
        showLoader();
        await cancelSubscriptionNotifications();
        await deleteSubSettingsFromDB(userId);
        setIsSubsEnabled(false);
        appAlert('Вимкнено', 'Нагадування про підписки видалені.');
      } catch (error) {
        appAlert('Помилка', 'Не вдалося вимкнути сповіщення підписок.');
      } finally {
        hideLoader();
      }
    }
  };

  const saveSubsSettings = async () => {
    if (!userId) return;
    const timeParts = subTime.split(':');
    if (timeParts.length !== 2) return appAlert('Помилка', 'Формат часу ГГ:ХХ');
    const hour = parseInt(timeParts[0]);
    const minute = parseInt(timeParts[1]);

    if (isNaN(hour) || hour < 0 || hour > 23 || isNaN(minute) || minute < 0 || minute > 59) {
      return appAlert('Помилка', 'Некоректний час');
    }

    try {
      showLoader();
      const granted = await requestNotificationPermissions();
      if (!granted) {
        appAlert('Увага', 'Надайте дозвіл на сповіщення в налаштуваннях телефону.');
        hideLoader();
        return;
      }

      const allSubscriptions = await getSubscriptions(userId);

      if (allSubscriptions.length === 0) {
        appAlert('Увага', 'У вас немає активних підписок для нагадування.');
        setSubsModalVisible(false);
        setIsSubsEnabled(false);
        hideLoader();
        return;
      }

      await scheduleSubscriptionNotifications(allSubscriptions, subDayOption, hour, minute);

      await saveSubNotificationSettings(userId, {
        enabled: true,
        offsetDays: subDayOption,
        time: subTime
      });

      setIsSubsEnabled(true);
      appAlert('Збережено', 'Нагадування про підписки активовано!');
      setSubsModalVisible(false);
    } catch (error) {
      console.error(error);
      appAlert('Помилка', 'Не вдалося зберегти налаштування підписок.');
    } finally {
      hideLoader();
    }
  };

  const handleCloseSubsModal = async () => {
    setSubsModalVisible(false);
    if (userId) {
      const settings = await getSubNotificationSettings(userId);
      if (!settings?.enabled) setIsSubsEnabled(false);
    }
  };

  const getSubOptionText = (val: number) => {
    if (val === 7) return 'За тиждень';
    if (val === 3) return 'За 3 дні';
    if (val === 1) return 'За день';
    return 'В день оплати';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={28} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Сповіщення</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {/* КАРТКА ЛІЧИЛЬНИКІВ */}
        <View style={styles.card}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Показники лічильників</Text>
            <Text style={styles.cardDesc}>
              {isMetersEnabled
                ? `Нагадувати о ${meterTime} ${dayOption === 'first' ? 'першого' :
                  dayOption === 'second_last' ? 'передостаннього' : 'останнього'
                } дня`
                : 'Нагадування вимкнено'}
            </Text>
          </View>
          <View style={styles.cardActions}>
            {isMetersEnabled && (
              <TouchableOpacity style={styles.settingsBtn} onPress={() => setMetersModalVisible(true)}>
                <Ionicons name="options-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
            <Switch
              value={isMetersEnabled}
              onValueChange={handleToggleMeters}
              trackColor={{ false: colors.surfaceMuted, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* КАРТКА ПІДПИСОК */}
        <View style={styles.card}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Мої підписки</Text>
            <Text style={styles.cardDesc}>
              {isSubsEnabled
                ? `Нагадувати о ${subTime} ${getSubOptionText(subDayOption).toLowerCase()}`
                : 'Нагадування вимкнено'}
            </Text>
          </View>
          <View style={styles.cardActions}>
            {isSubsEnabled && (
              <TouchableOpacity style={styles.settingsBtn} onPress={() => setSubsModalVisible(true)}>
                <Ionicons name="options-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
            <Switch
              value={isSubsEnabled}
              onValueChange={handleToggleSubs}
              trackColor={{ false: colors.surfaceMuted, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* ЗАГЛУШКА */}
        {/* <View style={[styles.card, { opacity: 0.5 }]}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Ліміт бюджету</Text>
            <Text style={styles.cardDesc}>Повідомляти при перевищенні ліміту витрат</Text>
          </View>
          <Switch value={false} disabled />
        </View> */}
      </ScrollView>

      {/* МОДАЛКА ЛІЧИЛЬНИКІВ */}
      <NotificationSettingsModal
        visible={isMetersModalVisible}
        onClose={handleCloseMeterModal}
        title="Налаштування лічильників"
        options={[
          { label: '1-й день', value: 'first' },
          { label: 'Передостанній', value: 'second_last' },
          { label: 'Останній', value: 'last' },
        ]}
        selectedOption={dayOption}
        onSelectOption={setDayOption}
        timeValue={meterTime}
        onChangeTime={setMeterTime}
        onSave={saveMetersSettings}
      />

      {/* МОДАЛКА ПІДПИСОК */}
      <NotificationSettingsModal
        visible={isSubsModalVisible}
        onClose={handleCloseSubsModal}
        title="Налаштування підписок"
        options={[
          { label: 'За тиждень', value: 7 },
          { label: 'За 3 дні', value: 3 },
          { label: 'За день', value: 1 },
          { label: 'В той же день', value: 0 },
        ]}
        selectedOption={subDayOption}
        onSelectOption={setSubDayOption}
        timeValue={subTime}
        onChangeTime={setSubTime}
        onSave={saveSubsSettings}
      />
    </View>
  );
};
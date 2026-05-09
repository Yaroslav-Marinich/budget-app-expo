import { Ionicons } from '@expo/vector-icons';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/src/constants/Colors';
import { styles } from '@/src/screens/MetersScreen/MetersScreen.styles';
import { getMeterColor, Meter, MeterReading, subscribeToMeterReadings, subscribeToMeters } from '@/src/services/meters';
import { getSyncQueue } from '@/src/services/syncManager';
import { shareReadingsAsPDF } from '@/src/utils/exportReadings';

const formatMonthYear = (dateStr: string) => {
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  const monthName = date.toLocaleString('uk-UA', { month: 'long' });
  return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
};

type UIMeterReading = MeterReading & { isPending?: boolean };

export const MetersScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [meters, setMeters] = useState<Meter[]>([]);
  const [readings, setReadings] = useState<UIMeterReading[]>([]);
  const [pendingReadings, setPendingReadings] = useState<UIMeterReading[]>([]);

  useEffect(() => {
    const unsubMeters = subscribeToMeters(setMeters);
    const unsubReadings = subscribeToMeterReadings(setReadings);

    return () => {
      unsubMeters();
      unsubReadings();
    };
  }, []);

  const fetchPendingQueue = async () => {
    const queue = await getSyncQueue();
    const pendingMeters = queue
      .filter((task) => task.type === 'METER_READING' && (task.status === 'PENDING' || task.status === 'SYNCING'))
      .map((task) => ({
        ...task.payload,
        id: task.id, 
        isPending: true, 
      }))
      .filter((reading) => !!reading?.date && !!reading?.meterId);
    setPendingReadings(pendingMeters);
  };

  useFocusEffect(
    useCallback(() => {
      fetchPendingQueue();
    }, [])
  );

  useEffect(() => {
    fetchPendingQueue();
  }, [readings]);

 const groupedMonths = useMemo(() => {
    const groups: { [date: string]: UIMeterReading[] } = {};
   const existingMeterIds = new Set(meters.map((meter) => meter.id));

    // Крок 1: Додаємо всі "офіційні" дані з Firebase
    readings.forEach((reading) => {
      if (!groups[reading.date]) {
        groups[reading.date] = [];
      }
      groups[reading.date].push(reading);
    });

    // Крок 2: Додаємо "офлайн" дані ТІЛЬКИ якщо їх ще немає в базі
    pendingReadings.forEach((pendingReading) => {
      if (!groups[pendingReading.date]) {
        groups[pendingReading.date] = [];
      }

      // Перевіряємо, чи є вже такий офіційний запис (по meterId)
      const isAlreadyInFirebase = groups[pendingReading.date].some(
        (r) => r.meterId === pendingReading.meterId && !r.isPending
      );

      // Якщо Firebase ще не знає про нього - показуємо напівпрозорим
      if (!isAlreadyInFirebase) {
        groups[pendingReading.date].push(pendingReading);
      }
    });

    return Object.keys(groups)
    .map((date) => {
      const visibleItems = groups[date].filter((reading) => existingMeterIds.has(reading.meterId));
      return { date, visibleItems };
    })
    .filter(({ visibleItems }) => visibleItems.length > 0)
      .sort((left, right) => right.date.localeCompare(left.date))
      .map(({ date, visibleItems }) => {
        const hasPending = visibleItems.some((r) => r.isPending);

        return {
          id: date,
          date,
          title: formatMonthYear(date),
          items: visibleItems,
          hasPending,
        };
      });
 }, [readings, pendingReadings, meters]);
  
  const handleShareAll = (e: any, item: any) => {
  e.stopPropagation(); 
  shareReadingsAsPDF(item.title, item.items, meters);
};

  const renderMonthCard = ({ item }: { item: (typeof groupedMonths)[0] }) => (
    <TouchableOpacity
      style={styles.monthCard}
      activeOpacity={0.8}
      onPress={() => router.push(`/meters/${item.date}` as Href)}
    >
      <View style={styles.monthHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.monthTitle}>{item.title}</Text>
          {/* 🕒 Показуємо іконку годинника, якщо дані ще не в хмарі */}
          {item.hasPending && (
            <Ionicons name="time-outline" size={18} color={Colors.warning} />
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </View>

      <View style={styles.readingsPreview}>
        {item.items.map((reading, index) => {
          const meter = meters.find((entry) => entry.id === reading.meterId);
          if (!meter) {
            return null;
          }

          return (
            <View 
              key={index} 
              // Робимо офлайн-показники трохи прозорими
              style={[styles.readingItem, reading.isPending && { opacity: 0.6, borderColor: Colors.warning, borderWidth: 1 }]}
            >
              <Ionicons name={meter.icon as any} size={16} color={getMeterColor(meter.icon)} />
              <Text style={styles.readingValue}>{reading.consumedValue}</Text>
            </View>
          );
        })}
      </View>
      <TouchableOpacity 
      onPress={(e) => handleShareAll(e, item)}
      style={{
        position: 'absolute',
        right: 15,
        bottom: 15,
        backgroundColor: Colors.surfaceSoft,
        padding: 8,
        borderRadius: 10,
      }}
    >
      <Ionicons name="share-outline" size={22} color={Colors.textSecondary} />
    </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={28} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Показники</Text>
      </View>

      <FlatList
        data={groupedMonths}
        keyExtractor={(item) => item.id}
        renderItem={renderMonthCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: Colors.textSecondary, marginTop: 40 }}>
            Ви ще не вносили показники.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => router.push('/meters/submit')}
      >
        <Ionicons name="add" size={24} color={Colors.white} />
        <Text style={styles.fabText}>Внести показники</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.bottomMenu, { paddingBottom: insets.bottom || 20 }]}
        activeOpacity={0.9}
        onPress={() => router.push('/meters/manage')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="settings-outline" size={24} color={Colors.textSecondary} />
          <Text style={styles.bottomMenuText}>Управління лічильниками</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};
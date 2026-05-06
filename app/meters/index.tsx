import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/src/constants/Colors';
import { getMeterColor, Meter, MeterReading, subscribeToMeterReadings, subscribeToMeters } from '@/src/services/meters';
import { styles } from '../../src/styles/meters.styles';

// Допоміжна функція для форматування дати ("2024-03" -> "Березень 2024")
const formatMonthYear = (dateStr: string) => {
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  const monthName = date.toLocaleString('uk-UA', { month: 'long' });
  return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
};

export default function MetersMainScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [meters, setMeters] = useState<Meter[]>([]);
  const [readings, setReadings] = useState<MeterReading[]>([]);

  useEffect(() => {
    const unsubMeters = subscribeToMeters("manual-test-id", setMeters);
    const unsubReadings = subscribeToMeterReadings("manual-test-id", setReadings);

    return () => {
      unsubMeters();
      unsubReadings();
    };
  }, []);

  // Групуємо показники по місяцях
  const groupedMonths = useMemo(() => {
    const groups: { [date: string]: MeterReading[] } = {};
    
    readings.forEach(r => {
      if (!groups[r.date]) groups[r.date] = [];
      groups[r.date].push(r);
    });

    // Перетворюємо об'єкт у масив і сортуємо від найновіших до найстаріших
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map(date => ({
        id: date,
        date: date,
        title: formatMonthYear(date),
        items: groups[date]
      }));
  }, [readings]);

  const renderMonthCard = ({ item }: { item: typeof groupedMonths[0] }) => (
    <TouchableOpacity 
      style={styles.monthCard}
      activeOpacity={0.8}
      onPress={() => router.push(`/meters/${item.date}` as Href)}
    >
      <View style={styles.monthHeader}>
        <Text style={styles.monthTitle}>{item.title}</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </View>
      
      <View style={styles.readingsPreview}>
        {item.items.map((reading, index) => {
          const meter = meters.find(m => m.id === reading.meterId);
          if (!meter) return null;

          return (
            <View key={index} style={styles.readingItem}>
  <Ionicons name={meter.icon as any} size={16} color={getMeterColor(meter.icon)} />
  <Text style={styles.readingValue}>{reading.consumedValue}</Text>
</View>
          );
        })}
      </View>
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
        keyExtractor={item => item.id}
        renderItem={renderMonthCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', color: Colors.textSecondary, marginTop: 40}}>
            Ви ще не вносили показники.
          </Text>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => router.push('/meters/submit')}
      >
        <Ionicons name="add" size={24} color="white" />
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
}
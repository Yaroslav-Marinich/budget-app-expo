import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native'; // 👈 Додали Image та Modal
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLoader } from '@/src/context/LoaderContext';
import { useTheme } from '@/src/context/ThemeContext';
import { appAlert } from '@/src/services/alert';
import { deleteMeterReading, getMeterColor, Meter, MeterReading, subscribeToMeters, subscribeToReadingsByDate } from '@/src/services/meters';
import { shareReadingsAsPDF } from '@/src/utils/exportReadings';
import { EditReadingModal } from '../EditReadingModal/EditReadingModal';
import { getStyles } from './MonthDetailsScreen.styles';

const formatMonthYear = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  const monthName = date.toLocaleString('uk-UA', { month: 'long' });
  return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
};

export const MonthDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>(); 
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const [meters, setMeters] = useState<Meter[]>([]);
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [editingReading, setEditingReading] = useState<MeterReading | null>(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  
  const [fullScreenPhoto, setFullScreenPhoto] = useState<string | null>(null);

  useEffect(() => {
    const unsubMeters = subscribeToMeters(setMeters);
    const unsubReadings = subscribeToReadingsByDate(id as string, setReadings);

    return () => {
      unsubMeters();
      unsubReadings();
    };
  }, [id]);

  const handleDelete = (readingId: string, meterName: string) => {
    appAlert(
      "Видалення показника",
      `Видалити показники для "${meterName}" за цей місяць?`,
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Видалити", 
          style: "destructive",
          onPress: async () => {
            showLoader();
            await deleteMeterReading(readingId);
            hideLoader();
            if (readings.length <= 1) {
              router.back();
            }
          }
        }
      ]
    );
  };

  const handleEdit = (reading: MeterReading) => {
    setEditingReading(reading);
    setEditModalVisible(true);
  };

  const shareOne = (reading: MeterReading) => {
  const meter = meters.find(m => m.id === reading.meterId);
  const title = `${meter?.name} - ${reading.date}`;
  shareReadingsAsPDF(title, [reading], meters); // Передаємо масив з одним елементом
};

  const renderReadingCard = ({ item }: { item: MeterReading }) => {
    const meter = meters.find(m => m.id === item.meterId);
    if (!meter) return null;

    return (
      <View style={styles.detailCard}>
        {/* ХЕДЕР */}
<View style={styles.detailHeader}>
          <View style={styles.detailMeterInfo}>
            <Ionicons name={meter.icon as any} size={28} color={getMeterColor(meter.icon)} />
            <Text style={styles.detailMeterName}>{meter.name}</Text>
          </View>
          
          <View style={[styles.detailActions, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
            <TouchableOpacity onPress={() => shareOne(item)} style={{ padding: 6 }}>
              <Ionicons name="share-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleEdit(item)} style={{ padding: 6 }}>
              <Ionicons name="pencil" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleDelete(item.id!, meter.name)} style={{ padding: 6 }}>
              <Ionicons name="trash-outline" size={22} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ПОКАЗНИКИ */}
        {meter.calcType === 'readings' && (
          <View style={styles.readingsFlowBox}>
            <View style={styles.readingCardItem}>
              <Text style={styles.readingLabel}>Минулий</Text>
              <Text style={styles.readingCardValue}>{item.prevValue}</Text>
            </View>
            
            <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
            
            <View style={styles.readingCardItem}>
              <Text style={styles.readingLabel}>Новий</Text>
              <Text style={styles.readingCardValue}>{item.currentValue}</Text>
            </View>
          </View>
        )}

        {/* ГОЛОВНИЙ РЕЗУЛЬТАТ: СПОЖИТО */}
        <View style={styles.consumedHighlightBox}>
          <Text style={styles.consumedHighlightLabel}>Разом спожито:</Text>
          <Text style={styles.consumedHighlightValue}>{item.consumedValue}</Text>
        </View>

        {/* КОМЕНТАР */}
        {item.comment && (
          <View style={styles.commentBubble}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.textSecondary} style={{ marginTop: 2 }} />
            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        )}

        {/* 📸 ПРЕВ'Ю ФОТОГРАФІЇ */}
        {item.photoUrl && (
          <TouchableOpacity 
            style={styles.thumbnailContainer}
            activeOpacity={0.9}
            onPress={() => setFullScreenPhoto(item.photoUrl!)}
          >
            <Image source={{ uri: item.photoUrl }} style={styles.thumbnailImage} />
            <View style={styles.thumbnailOverlay}>
              <Ionicons name="expand-outline" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={28} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>{formatMonthYear(id as string)}</Text>
      </View>

      <FlatList
        data={readings}
        keyExtractor={item => item.id!}
        renderItem={renderReadingCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>У цьому місяці ще немає показників.</Text>
        }
      />
          
      {/* МОДАЛКА РЕДАГУВАННЯ */}
      <EditReadingModal 
        visible={isEditModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setEditingReading(null);
        }}
        reading={editingReading}
        meter={meters.find(m => m.id === editingReading?.meterId) || null}
      />

      {/* 📸 МОДАЛКА ПОВНОЕКРАННОГО ФОТО */}
      <Modal
        visible={!!fullScreenPhoto}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullScreenPhoto(null)}
      >
        <View style={styles.fullScreenModalBg}>
          <TouchableOpacity 
            style={[styles.fullScreenCloseBtn, { top: insets.top + 10 }]} 
            onPress={() => setFullScreenPhoto(null)}
          >
            <Ionicons name="close-circle" size={36} color="white" />
          </TouchableOpacity>
          {fullScreenPhoto && (
            <Image 
              source={{ uri: fullScreenPhoto }} 
              style={styles.fullScreenImage} 
              resizeMode="contain" 
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
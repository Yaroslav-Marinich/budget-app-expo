import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/src/constants/Colors';
import { useLoader } from '@/src/context/LoaderContext';
import { styles } from '@/src/screens/MetersScreen/components/ManageMeterScreen/ManageMetersScreen.styles';
import { AddMeterModal } from '@/src/screens/ServicesScreen/components/AddMeterModal';
import { deleteMeter, getMeterColor, Meter, subscribeToMeters } from '@/src/services/meters';

export const ManageMetersScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { showLoader, hideLoader } = useLoader();
  const [meters, setMeters] = useState<Meter[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMeters('manual-test-id', (data) => {
      setMeters(data.sort((left, right) => (left.order || 0) - (right.order || 0)));
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (meter: Meter) => {
    Alert.alert(
      'Видалення лічильника',
      `Ви впевнені, що хочете видалити лічильник "${meter.name}"? \n\nУВАГА: Це назавжди видалить всю історію його показників без можливості відновлення!`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: async () => {
            showLoader();
            try {
              await deleteMeter(meter.id);
            } catch (error) {
              console.error(error);
              Alert.alert('Помилка', 'Не вдалося видалити лічильник.');
            } finally {
              hideLoader();
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: Meter }) => (
    <View style={styles.manageCard}>
      <View style={[styles.manageIconBox, { backgroundColor: `${getMeterColor(item.icon)}15` }]}>
        <Ionicons name={item.icon as any} size={24} color={getMeterColor(item.icon)} />
      </View>

      <View style={styles.manageInfoBox}>
        <Text style={styles.manageName}>{item.name}</Text>
        <Text style={styles.manageType}>{item.calcType === 'readings' ? 'За показами' : "За об'ємом"}</Text>
      </View>

      <View style={styles.manageActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            setSelectedMeter(item);
            setModalVisible(true);
          }}
        >
          <Ionicons name="pencil" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item)}>
          <Ionicons name="trash-outline" size={22} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
          <Ionicons name="arrow-back" size={28} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Лічильники</Text>
      </View>

      <FlatList
        data={meters}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>У вас ще немає жодного лічильника.</Text>}
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => {
          setSelectedMeter(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.fabText}>Новий лічильник</Text>
      </TouchableOpacity>

      <AddMeterModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        meterToEdit={selectedMeter}
      />
    </View>
  );
};
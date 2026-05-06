import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MonthPickerModal } from '@/src/components/ui/MonthPickerModal/MonthPickerModal';
import { Colors } from '@/src/constants/Colors';
import { useLoader } from '@/src/context/LoaderContext';
import { addMeterReading, getMeterColor, getPreviousMeterReading, Meter, MeterReading, subscribeToMeters } from '@/src/services/meters';
import { styles } from '../../src/styles/meters.styles';

export default function SubmitReadingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  
  const [meters, setMeters] = useState<Meter[]>([]);
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);

  const [prevValue, setPrevValue] = useState("");
  const [currValue, setCurrValue] = useState("");
  const [consumed, setConsumed] = useState("");
  const [comment, setComment] = useState("");

  const monthName = currentDate.toLocaleString('uk-UA', { month: 'long' });
  const year = currentDate.getFullYear();
  const dateKey = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    const unsubscribe = subscribeToMeters("manual-test-id", (data) => {
      setMeters(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPreviousReading = async () => {
      if (step === 'form' && selectedMeter?.calcType === 'readings') {
        showLoader();
        const prevReading = await getPreviousMeterReading(selectedMeter.id, dateKey);
        hideLoader();

        if (prevReading && prevReading.currentValue !== undefined) {
          setPrevValue(prevReading.currentValue.toString());
        } else {
          setPrevValue("");
        }
      }
    };
    fetchPreviousReading();
  }, [currentDate, selectedMeter, step]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const handleSelectMeter = (meter: Meter) => {
    setSelectedMeter(meter);
    setCurrValue("");
    setConsumed("");
    setComment("");
    setStep('form');
  };

 const handleSave = async () => {
    if (!selectedMeter) return;

    let consumedValue = 0;
    let finalPrev: number | undefined = undefined;
    let finalCurr: number | undefined = undefined;

    if (selectedMeter.calcType === 'readings') {
      if (!prevValue || !currValue) {
        Alert.alert("Помилка", "Заповніть обидва поля показників.");
        return;
      }
      finalPrev = parseFloat(prevValue);
      finalCurr = parseFloat(currValue);
      consumedValue = finalCurr - finalPrev;
      
      if (consumedValue < 0) {
        Alert.alert("Помилка", "Теперішній показник не може бути меншим за попередній.");
        return;
      }
    } else {
      if (!consumed) {
        Alert.alert("Помилка", "Заповніть об'єм споживання.");
        return;
      }
      consumedValue = parseFloat(consumed);
    }

    const readingData: Omit<MeterReading, "id"> = {
      meterId: selectedMeter.id,
      userId: "manual-test-id", 
      date: dateKey,
      consumedValue,
    };

    if (finalPrev !== undefined) readingData.prevValue = finalPrev;
    if (finalCurr !== undefined) readingData.currentValue = finalCurr;
    if (comment.trim()) readingData.comment = comment.trim();

    showLoader();
    const success = await addMeterReading(readingData);
    hideLoader();

    if (success) {
      router.back();
    } else {
      Alert.alert("Помилка", "Не вдалося зберегти показники.");
    }
  };

  const sanitizeNumber = (val: string) => val.replace(/[^0-9.]/g, '');

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} 
    >
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        
        {/* ХЕДЕР */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step === 'form' ? setStep('select') : router.back()} style={{ padding: 5 }}>
            <Ionicons name="arrow-back" size={28} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {step === 'select' ? 'Виберіть лічильник' : 'Внесення даних'}
          </Text>
        </View>

        {/* ЕКРАН ВИБОРУ ЛІЧИЛЬНИКА */}
        {step === 'select' && (
          <FlatList
            data={meters}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>Додайте лічильники в меню.</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.manageCard} activeOpacity={0.8} onPress={() => handleSelectMeter(item)}>
                <View style={[styles.manageIconBox, { backgroundColor: `${getMeterColor(item.icon)}15` }]}>
                  <Ionicons name={item.icon as any} size={24} color={getMeterColor(item.icon)} />
                </View>
                <View style={styles.manageInfoBox}>
                  <Text style={styles.manageName}>{item.name}</Text>
                  <Text style={styles.manageType}>
                    {item.calcType === 'readings' ? 'За показами' : "За об'ємом"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          />
        )}

        {/* ЕКРАН ФОРМИ */}
        {step === 'form' && selectedMeter && (
          <ScrollView 
            contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 150 }]} 
            showsVerticalScrollIndicator={false} 
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag" 
          >
            
            <View style={styles.dateSelectorContainer}>
              <TouchableOpacity style={styles.dateSelectorBtn} onPress={() => changeMonth(-1)}>
                <Ionicons name="chevron-back" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
              
              {/* === ТЕПЕР ЦЕ КНОПКА ВИКЛИКУ МОДАЛКИ === */}
              <TouchableOpacity 
                style={styles.dateSelectorTextContainer}
                onPress={() => setMonthPickerVisible(true)}
              >
                <Text style={styles.dateSelectorText}>
                  {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.dateSelectorBtn} onPress={() => changeMonth(1)}>
                <Ionicons name="chevron-forward" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.submitCard}>
              <View style={styles.submitHeader}>
                <View style={[styles.manageIconBox, { backgroundColor: `${getMeterColor(selectedMeter.icon)}15` }]}>
                  <Ionicons name={selectedMeter.icon as any} size={24} color={getMeterColor(selectedMeter.icon)} />
                </View>
                <Text style={styles.manageName}>{selectedMeter.name}</Text>
              </View>

              <View style={styles.submitInputsRow}>
                {selectedMeter.calcType === 'readings' ? (
                  <>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Попередній</Text>
                      <TextInput 
                        style={styles.meterInput}
                        keyboardType="numeric"
                        placeholder="0.0"
                        placeholderTextColor={Colors.textSecondary}
                        value={prevValue}
                        onChangeText={(val) => setPrevValue(sanitizeNumber(val))}
                      />
                    </View>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Теперішній</Text>
                      <TextInput 
                        style={styles.meterInput}
                        keyboardType="numeric"
                        placeholder="0.0"
                        placeholderTextColor={Colors.textSecondary}
                        value={currValue}
                        onChangeText={(val) => setCurrValue(sanitizeNumber(val))}
                      />
                    </View>
                  </>
                ) : (
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Об&apos;єм споживання</Text>
                    <TextInput 
                      style={styles.meterInput}
                      keyboardType="numeric"
                      placeholder="0.0"
                      placeholderTextColor={Colors.textSecondary}
                      value={consumed}
                      onChangeText={(val) => setConsumed(sanitizeNumber(val))}
                    />
                  </View>
                )}
              </View>

              <Text style={[styles.inputLabel, { marginTop: 15 }]}>Коментар (необов&apos;язково)</Text>
              <TextInput 
                style={styles.commentInput}
                placeholder="Введіть коментар..."
                placeholderTextColor={Colors.textSecondary}
                value={comment}
                onChangeText={setComment}
                multiline
              />
            </View>

            {/* === НОВА КНОПКА ЗБЕРЕЖЕННЯ === */}
            <TouchableOpacity style={styles.formSubmitBtn} onPress={handleSave}>
              <Ionicons name="checkmark-circle-outline" size={24} color="white" />
              <Text style={styles.formSubmitBtnText}>Зберегти показники</Text>
            </TouchableOpacity>

          </ScrollView>
        )}

      </View>

      {/* МОДАЛКА ВИБОРУ МІСЯЦЯ */}
      <MonthPickerModal 
        visible={isMonthPickerVisible}
        onClose={() => setMonthPickerVisible(false)}
        currentDate={currentDate}
        onSelect={setCurrentDate}
      />
    </KeyboardAvoidingView>
  );
}
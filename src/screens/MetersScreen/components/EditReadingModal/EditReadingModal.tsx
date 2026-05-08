import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/src/constants/Colors';
import { useLoader } from '@/src/context/LoaderContext';
import { getMeterColor, Meter, MeterReading, updateMeterReading } from '@/src/services/meters';
import { deleteMeterPhoto, takeAndUploadMeterPhoto } from '@/src/services/storage';
import { styles } from './EditReadingModal.styles';

interface EditReadingModalProps {
  visible: boolean;
  onClose: () => void;
  reading: MeterReading | null;
  meter: Meter | null;
}

export const EditReadingModal: React.FC<EditReadingModalProps> = ({ visible, onClose, reading, meter }) => {
  const { showLoader, hideLoader } = useLoader();

  const [prevValue, setPrevValue] = useState("");
  const [currValue, setCurrValue] = useState("");
  const [consumed, setConsumed] = useState("");
  const [comment, setComment] = useState("");
  
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    if (visible && reading) {
      setPrevValue(reading.prevValue !== undefined ? reading.prevValue.toString() : "");
      setCurrValue(reading.currentValue !== undefined ? reading.currentValue.toString() : "");
      setConsumed(reading.consumedValue !== undefined ? reading.consumedValue.toString() : "");
      setComment(reading.comment || "");
      setPhotoUrl(reading.photoUrl || null);
    }
  }, [visible, reading]);

const handleChangePhoto = async () => {
    setIsUploadingPhoto(true);
    const url = await takeAndUploadMeterPhoto();
    if (url) {
      if (photoUrl && photoUrl !== reading?.photoUrl) {
        deleteMeterPhoto(photoUrl);
      }
      setPhotoUrl(url);
    }
    setIsUploadingPhoto(false);
  };

  const handleSave = async () => {
    if (!reading || !meter) return;

    let consumedValue = 0;
    let finalPrev: number | undefined = undefined;
    let finalCurr: number | undefined = undefined;

    if (meter.calcType === 'readings') {
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

    const updateData: Partial<MeterReading> = { consumedValue };
    if (meter.calcType === 'readings') {
      updateData.prevValue = finalPrev;
      updateData.currentValue = finalCurr;
    }
    updateData.comment = comment.trim() ? comment.trim() : undefined;
    
    if (photoUrl !== reading.photoUrl) {
      updateData.photoUrl = photoUrl || ""; 
      
      if (reading.photoUrl) {
        deleteMeterPhoto(reading.photoUrl);
      }
    }

    showLoader();
    const success = await updateMeterReading(reading.id!, updateData);
    hideLoader();

    if (success) {
      onClose();
    } else {
      Alert.alert("Помилка", "Не вдалося оновити показники.");
    }
  };

  const sanitizeNumber = (val: string) => val.replace(/[^0-9.]/g, '');

  if (!meter || !reading) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <View style={styles.dragIndicator} />
            
            <View style={styles.headerRow}>
              <Text style={styles.modalTitle}>Редагування</Text>
              <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
                <Ionicons name="close" size={26} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false} 
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <View style={[styles.submitCard, { marginTop: 10 }]}>
                <View style={styles.submitHeader}>
                  <View style={[styles.manageIconBox, { backgroundColor: `${getMeterColor(meter.icon)}15` }]}>
                    <Ionicons name={meter.icon as any} size={24} color={getMeterColor(meter.icon)} />
                  </View>
                  <Text style={styles.manageName}>{meter.name}</Text>
                </View>

                <View style={styles.submitInputsRow}>
                  {meter.calcType === 'readings' ? (
                    <>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Попередній</Text>
                        <TextInput 
                          style={styles.meterInput}
                          keyboardType="numeric"
                          value={prevValue}
                          onChangeText={(val) => setPrevValue(sanitizeNumber(val))}
                        />
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Теперішній</Text>
                        <TextInput 
                          style={styles.meterInput}
                          keyboardType="numeric"
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
                        value={consumed}
                        onChangeText={(val) => setConsumed(sanitizeNumber(val))}
                      />
                    </View>
                  )}
                </View>

                <Text style={[styles.inputLabel, { marginTop: 15 }]}>Коментар (необов&apos;язково)</Text>
                <TextInput 
                  style={styles.commentInput}
                  value={comment}
                  onChangeText={setComment}
                  multiline
                />
              </View>
              
              {/* 📸 БЛОК КЕРУВАННЯ ФОТОГРАФІЄЮ (використовуємо спільні стилі) */}
              <View style={styles.photoSectionContainer}>
                {isUploadingPhoto ? (
                  <View style={styles.photoUploadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.photoUploadingText}>Завантаження фото...</Text>
                  </View>
                ) : photoUrl ? (
                  <View style={styles.photoPreviewContainer}>
                    <Image 
                      source={{ uri: photoUrl }} 
                      style={styles.photoPreviewImage} 
                      resizeMode="cover"
                    />
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                      {/* Кнопка зміни фото */}
                      <TouchableOpacity 
                        style={[styles.photoAddBtn, { flex: 1, borderStyle: 'solid', padding: 10 }]} 
                        onPress={handleChangePhoto}
                      >
                        <Ionicons name="camera-outline" size={20} color={Colors.primary} />
                        <Text style={[styles.photoAddText, { fontSize: 14 }]}>Змінити</Text>
                      </TouchableOpacity>
                      
                      {/* Кнопка видалення фото */}
                      <TouchableOpacity 
                        style={styles.photoDeleteBtn}
                        onPress={() => setPhotoUrl(null)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                        <Text style={styles.photoDeleteText}>Видалити</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.photoAddBtn} 
                    onPress={handleChangePhoto}
                  >
                    <Ionicons name="camera-outline" size={24} color={Colors.primary} />
                    <Text style={styles.photoAddText}>
                      Додати фото лічильника
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* 📸 КІНЕЦЬ БЛОКУ ФОТО */}

              <TouchableOpacity style={styles.formSubmitBtn} onPress={handleSave}>
                <Ionicons name="checkmark-circle-outline" size={24} color="white" />
                <Text style={styles.formSubmitBtnText}>Зберегти зміни</Text>
              </TouchableOpacity>
            </ScrollView>

          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};
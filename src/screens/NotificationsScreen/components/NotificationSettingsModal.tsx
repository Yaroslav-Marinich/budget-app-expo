import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

import { DefaultModal } from '@/src/components/ui/DefaultModal/DefaultModal';
import { useTheme } from '@/src/context/ThemeContext';
import { getStyles } from '../NotificationsScreen.styles';

interface Option {
    label: string;
    value: string | number;
}

interface NotificationSettingsModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    options: Option[];
    selectedOption: string | number;
    onSelectOption: (value: any) => void;
    timeValue: string;
    onChangeTime: (time: string) => void;
    onSave: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
    visible,
    onClose,
    title,
    options,
    selectedOption,
    onSelectOption,
    timeValue,
    onChangeTime,
    onSave,
}) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [showPicker, setShowPicker] = useState(false);

    const getParsedDate = () => {
        const [hours, minutes] = timeValue.split(':').map(Number);
        const date = new Date();
        date.setHours(isNaN(hours) ? 12 : hours);
        date.setMinutes(isNaN(minutes) ? 0 : minutes);
        date.setSeconds(0);
        return date;
    };

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }

        if (event.type === 'set' && selectedDate) {
            const h = selectedDate.getHours().toString().padStart(2, '0');
            const m = selectedDate.getMinutes().toString().padStart(2, '0');
            onChangeTime(`${h}:${m}`);
        }
    };

    return (
        <DefaultModal visible={visible} onClose={onClose}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Коли нагадувати?</Text>
            <View style={styles.chipContainer}>
                {options.map((opt) => (
                    <TouchableOpacity
                        key={opt.value}
                        style={[styles.chip, selectedOption === opt.value && styles.chipActive]}
                        onPress={() => onSelectOption(opt.value)}
                    >
                        <Text style={[styles.chipText, selectedOption === opt.value && styles.chipTextActive]}>
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Точний час</Text>

            {/* РЕНДЕР ПІКЕРА В ЗАЛЕЖНОСТІ ВІД ПЛАТФОРМИ */}
            {Platform.OS === 'ios' ? (
                <View style={styles.iosPickerContainer}>
                    <DateTimePicker
                        value={getParsedDate()}
                        mode="time"
                        display="spinner"
                        onChange={handleTimeChange}
                        textColor={colors.text}
                    />
                </View>
            ) : (
                <>
                    <TouchableOpacity
                        style={styles.timeSelector}
                        onPress={() => setShowPicker(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.timeSelectorText}>{timeValue}</Text>
                    </TouchableOpacity>

                    {showPicker && (
                        <DateTimePicker
                            value={getParsedDate()}
                            mode="time"
                            display="default"
                            is24Hour={true}
                            onChange={handleTimeChange}
                        />
                    )}
                </>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
                <Text style={styles.saveBtnText}>Зберегти</Text>
            </TouchableOpacity>
        </DefaultModal>
    );
};
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { DefaultModal } from "@/src/components/ui/DefaultModal/DefaultModal";
import { useTheme } from "@/src/context/ThemeContext";
import { getStyles } from "./DatePickerModal.styles";

interface Props {
    visible: boolean;
    onClose: () => void;
    currentDate: Date;
    onSelect: (date: Date) => void;
}

const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
const MONTHS = [
    "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
    "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
];

export const DatePickerModal = ({ visible, onClose, currentDate, onSelect }: Props) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const [viewDate, setViewDate] = useState(new Date(currentDate));

    useEffect(() => {
        if (visible) {
            setViewDate(new Date(currentDate));
        }
    }, [visible, currentDate]);

    const changeMonth = (delta: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1);
        setViewDate(newDate);
    };

    // Розрахунок днів для сітки
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

    // Визначаємо, з якого дня тижня починається місяць (0 - Пн, 6 - Нд)
    const getFirstDayOfMonth = (year: number, month: number) => {
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

    // Масиви для рендеру
    const emptyCells = Array.from({ length: firstDay }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handleSelect = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onSelect(newDate);
        onClose();
    };

    const setToday = () => {
        const today = new Date();
        onSelect(today);
        onClose();
    };

    return (
        <DefaultModal visible={visible} onClose={onClose} overlayStyle={styles.overlay} contentStyle={styles.modalContent}>

            <View style={styles.monthSelector}>
                <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}>
                    <Ionicons name="chevron-back" size={28} color={colors.textSecondary} />
                </TouchableOpacity>

                <Text style={styles.monthText}>
                    {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                </Text>

                <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}>
                    <Ionicons name="chevron-forward" size={28} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Дні тижня */}
            <View style={styles.weekDaysRow}>
                {WEEK_DAYS.map((day, index) => (
                    <View key={index} style={styles.weekDayCell}>
                        <Text style={styles.weekDayText}>{day}</Text>
                    </View>
                ))}
            </View>

            {/* Сітка днів */}
            <View style={styles.daysGrid}>

                {/* Порожні контейнери для зсуву першого дня */}
                {emptyCells.map(index => (
                    <View key={`empty-${index}`} style={styles.dayCellContainer} />
                ))}

                {/* Кнопки з датами */}
                {days.map(day => {
                    const isSelected =
                        day === currentDate.getDate() &&
                        viewDate.getMonth() === currentDate.getMonth() &&
                        viewDate.getFullYear() === currentDate.getFullYear();

                    return (
                        <View key={day} style={styles.dayCellContainer}>
                            <TouchableOpacity
                                style={[styles.dayCell, isSelected && styles.dayCellActive]}
                                onPress={() => handleSelect(day)}
                            >
                                <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>

            <TouchableOpacity style={styles.todayBtn} onPress={setToday}>
                <Ionicons name="calendar-outline" size={24} color={colors.primary} style={{ marginRight: 10 }} />
                <Text style={styles.todayText}>Обрати сьогодні</Text>
            </TouchableOpacity>
        </DefaultModal>
    );
};
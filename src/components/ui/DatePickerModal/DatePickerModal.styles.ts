import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.overlayHeavy,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        paddingBottom: 40,
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    arrowBtn: {
        padding: 12,
        backgroundColor: colors.surfaceSubtle,
        borderRadius: 16,
    },
    monthText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        textTransform: 'capitalize',
    },

    // Дні тижня
    weekDaysRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    weekDayCell: {
        width: '14.28%', // Рівно 1/7 ширини
        alignItems: 'center',
    },
    weekDayText: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },

    // Сітка днів
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // Жодних space-between чи gap! Ми керуємо шириною контейнерів.
    },
    dayCellContainer: {
        width: '14.28%', // Рівно 1/7 ширини
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    dayCell: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20, // Ідеальне коло
        backgroundColor: 'transparent',
    },
    dayCellActive: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    dayText: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '500',
    },
    dayTextActive: {
        color: colors.background,
        fontWeight: 'bold',
        fontSize: 20,
    },

    todayBtn: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        backgroundColor: `${colors.primary}15`,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: `${colors.primary}30`,
    },
    todayText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 18,
    },
});
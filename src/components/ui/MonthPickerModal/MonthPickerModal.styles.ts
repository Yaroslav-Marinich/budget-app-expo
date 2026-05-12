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
  // --- Стилі вибору року ---
  yearSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  arrowBtn: {
    padding: 10,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 15,
  },
  yearText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  // --- Стилі сітки місяців ---
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  monthBtn: {
    width: '31%',
    backgroundColor: colors.surfaceSubtle,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  monthBtnActive: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
  },
  monthText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  monthTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },

  currentMonthBtn: {
    flexDirection: 'row',
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: `${colors.primary}15`,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  currentMonthText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
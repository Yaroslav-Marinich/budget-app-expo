import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlayHeavy,
    justifyContent: 'flex-end',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Перемикач Крипта/Фіат
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceMuted,
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  switchLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  switchSubLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  // Поля вводу
  inputLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    marginTop: 15,
    marginLeft: 5,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.outline,
  },

  // Іконки
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  // Валюта
  currencyText: {
    color: colors.text,
  },

  // Кнопка збереження
  saveBtn: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  saveBtnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
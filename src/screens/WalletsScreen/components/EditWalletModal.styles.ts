import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlayHeavy,
    justifyContent: 'flex-end',
  },
  dragIndicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.outline,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '90%',
  },
modalTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Перемикач Крипта/Фіат
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceMuted,
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  switchLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  switchSubLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  
  // Поля вводу
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    marginTop: 15,
    marginLeft: 5,
  },
  input: {
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.outline,
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
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  
  // Валюта
  currencyText: {
    color: Colors.text,
  },
  
  // Кнопка збереження
  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Внутрішня модалка пошуку валют
  currencyPickerContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 30,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
  },
  closeBtn: {
    marginLeft: 15,
  },
  closeBtnText: {
    color: Colors.error,
  },
  
  // Елемент списку валют
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  currencyCode: {
    color: Colors.accent,
    fontWeight: 'bold',
  },
  currencyName: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
});
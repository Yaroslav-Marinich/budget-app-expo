import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  // --- Поля вводу ---
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

  // --- НОВЕ: Сітка кольорів ---
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  colorBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorBoxActive: {
    transform: [{ scale: 1.1 }],
    borderColor: Colors.text, 
  },

  // --- ОНОВЛЕНО: Сітка іконок ---
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    marginBottom: 10,
  },
  iconBox: {
    width: '18%', 
    aspectRatio: 1, 
    borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconBoxActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}15`,
  },
  
  // --- Кнопка збереження ---
  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 20,
    // marginTop: 20,
    marginBottom: 30, 
    alignItems: 'center',
  },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
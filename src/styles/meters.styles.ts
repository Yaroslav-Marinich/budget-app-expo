import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 15,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  
  // --- Картка місяця ---
  monthCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    paddingBottom: 10,
  },
  monthTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  readingsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  readingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  readingValue: {
    color: Colors.text,
    fontWeight: '600',
    marginLeft: 6,
  },

  // --- Нижня панель управління ---
  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomMenuText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // --- FAB (Кнопка додавання показників) ---
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fabText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
        },
  // --- Велика кнопка збереження форми ---
formSubmitBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 40, 
  },
  formSubmitBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  
  // --- Сторінка управління лічильниками ---
  manageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 15,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  manageIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  manageInfoBox: {
    flex: 1,
  },
  manageName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  manageType: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  manageActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    padding: 8,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    },
  // --- Сторінка внесення показників ---
  submitCard: {
    backgroundColor: Colors.surface,
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  submitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  submitInputsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 6,
    marginLeft: 4,
  },
  meterInput: {
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.outline,
    },
  // Поле коментаря
  commentInput: {
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.outline,
    minHeight: 100,
    textAlignVertical: 'top',
    marginTop: 15,
    },
  // --- Вибір дати ---
  dateSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.outline,
    },
  dateSelectorTextContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    // backgroundColor: 'rgba(255,255,255,0.05)',
  },
  dateSelectorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    width: 150,
    textAlign: 'center',
  },
  dateSelectorBtn: {
    padding: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  dateHeaderContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dateHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
});
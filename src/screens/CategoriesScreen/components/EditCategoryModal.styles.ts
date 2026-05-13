import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
  modalContent: {
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceMuted,
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
  },
  switchLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  // --- Інпут з прев'ю іконки ---
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  previewIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    color: colors.text,
    padding: 16,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    height: 56,
  },

  // --- Заголовки секцій ---
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 5,
  },

  // --- Горизонтальні списки ---
  scrollWrapper: {
    marginBottom: 20,
    marginHorizontal: -20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 5,
  },

  // Кольори
  colorBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 12,
  },
  colorBoxActive: {
    transform: [{ scale: 1.1 }],
    borderColor: colors.text,
  },

  // Іконки
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  iconBoxActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
  },

  // Кнопка
  saveBtn: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  saveBtnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
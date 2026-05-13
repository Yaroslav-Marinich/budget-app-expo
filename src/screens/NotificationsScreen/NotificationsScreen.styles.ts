import { StyleSheet } from 'react-native';

export const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 15,
  },
  listContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.outline,
  },
  cardInfo: {
    flex: 1,
    marginRight: 15,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsBtn: {
    padding: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
  },

  // --- Стилі для модалки ---
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
  label: {
    color: colors.textSecondary,
    fontSize: 14,
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    marginTop: 5,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.background,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  saveBtnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeSelector: {
    backgroundColor: colors.surfaceMuted,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outlineSoft || colors.outline,
    marginVertical: 10,
  },
  timeSelectorText: {
    color: colors.text,
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  iosPickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    marginVertical: 10,
  },
});
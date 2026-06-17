import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: 20 },

  primaryBorder: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  primaryBadge: {
    position: 'absolute',
    top: 0,
    left: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  primaryBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  walletCard: {
    flexDirection: 'column',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
  },

  walletTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  excludeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.outlineSoft,
  },
  excludeText: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
    paddingRight: 10,
  },

  itemContainer: {
    marginBottom: 12,
    position: 'relative',
    paddingTop: 10,
  },
  deleteAction: {
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    borderRadius: 20,
    width: 100,
    height: '100%',
    borderWidth: 1,
    borderColor: colors.outline,
    borderLeftWidth: 0,
    marginLeft: -40,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoBox: { flex: 1 },
  title: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  balance: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  },
  actionBtn: { padding: 8, marginLeft: 4 },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  screenTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  archivedRow: {
    opacity: 0.6,
    backgroundColor: colors.outlineSubtle,
  },
  archivedBadge: {
    position: 'absolute',
    top: 0,
    right: 60,
    backgroundColor: colors.textSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 10,
  },
  archivedBadgeText: {
    color: colors.background,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pendingBadge: {
    position: 'absolute',
    top: 0,
    right: 120,
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  pendingBadgeText: {
    color: colors.background,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pendingRow: {
    borderColor: colors.warning,
    borderStyle: 'dashed',
  },
  swipeHintIcon: {
    marginLeft: 8,
  },

  // Модалка
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '90%',
  },
  inputLabel: { color: colors.textSecondary, fontSize: 12, marginBottom: 8, marginTop: 15, marginLeft: 5 },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.outline,
  },

  // Пошук валют
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  currencyCode: { color: colors.accent, fontWeight: 'bold' },
  currencyName: { color: colors.textSecondary, fontSize: 13 },
});
import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  backBtn: {
    padding: 5,
    marginRight: 10,
    marginLeft: -5,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },

  // Селектор рахунків
  walletsSelector: {
    height: 45,
    marginBottom: 15,
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  walletPillActive: {
    backgroundColor: colors.primary,
  },
  walletPillText: {
    color: colors.text,
  },

  // Селектор дати
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateArrow: {
    padding: 10,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 12,
  },
  dateCenter: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dateText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  // Картка заблокованого режиму
  lockedWalletCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  lockedWalletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  lockedIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedWalletInfo: {
    flex: 1,
    marginLeft: 12,
  },
  lockedWalletTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lockedWalletCurrency: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  lockIconContainer: {
    padding: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
  },
  lockedDetailsRow: {
    flexDirection: 'column',
    gap: 10,
  },
  lockedPeriodContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    padding: 12,
    borderRadius: 16,
    gap: 10,
  },
  lockedPeriodText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  lockedTotalContainer: {
    width: '100%',
    backgroundColor: colors.surfaceSoft,
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lockedTotalLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    flex: 1,
  },
  lockedTotalAmount: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },

  // Список операцій
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 5,
  },
  sectionHeaderText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemContainer: {
    marginBottom: 6,
    position: 'relative',
    paddingTop: 6,
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
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  amountBox: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  swipeHintIcon: {
    marginLeft: 8,
  },
  expenseText: {
    color: colors.error,
  },
  incomeText: {
    color: colors.primary,
  },

  // СТИЛІ ДЛЯ ТРАНСФЕРІВ
  transferWalletsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  transferWalletName: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  transferAmountText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  transferAmountMinus: {
    color: colors.error,
    marginBottom: 2,
  },
  transferAmountPlus: {
    color: colors.success,
  },

  // Порожній стан
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 15,
  },
});
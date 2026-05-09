import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.text,
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  walletPillActive: {
    backgroundColor: Colors.primary,
  },
  walletPillText: {
    color: Colors.text,
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  dateCenter: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dateText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  // 👈 НОВІ СТИЛІ: Картка заблокованого режиму
  lockedWalletCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.outline,
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedWalletInfo: {
    flex: 1,
    marginLeft: 12,
  },
  lockedWalletTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lockedWalletCurrency: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  lockIconContainer: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
  },
  lockedPeriodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 16,
    gap: 8,
  },
  lockedPeriodText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
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
    color: Colors.textSecondary,
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
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    borderRadius: 20,
    width: 100,
    height: '100%',
    borderWidth: 1,
    borderColor: Colors.outline,
    borderLeftWidth: 0,
    marginLeft: -40,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outline,
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
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    color: Colors.textSecondary,
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
  expenseText: {
    color: Colors.error,
  },
  incomeText: {
    color: Colors.primary,
  },

  // Порожній стан
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 15,
  },
});
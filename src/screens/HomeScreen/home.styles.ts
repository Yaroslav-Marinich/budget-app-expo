import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // =======================
  // Рахунки
  // =======================
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },

  walletList: {
    paddingLeft: 20,
    marginBottom: 25,
  },

  walletCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.outline,
  },

  walletCardPending: {
    borderColor: colors.warning,
    borderStyle: 'dashed',
  },

  walletCardArchived: {
    opacity: 0.6,
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.outline,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  archiveBadgeHome: {
    position: 'absolute',
    top: -1,
    right: 25,
    backgroundColor: colors.textSecondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 2,
  },
  archiveBadgeTextHome: {
    color: colors.background,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainBadgeHome: {
    position: 'absolute',
    top: -1,
    right: 25,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mainBadgeTextHome: {
    color: colors.background,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pendingBadgeHome: {
    position: 'absolute',
    top: -1,
    left: 25,
    backgroundColor: colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pendingBadgeTextHome: {
    color: colors.background,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },

  walletTitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  walletAmount: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "bold",
  },

  currency: {
    color: colors.accent,
    fontSize: 18,
  },

  // =======================
  // Вибір дати
  // =======================
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 15,
  },

  dateText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  // --- ГОЛОВНИЙ БЛОК (ОСТРІВ) ---
  transactionsBoard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 32,
    paddingTop: 20,
    paddingBottom: 5,
    marginBottom: 40,
  },

  // =======================
  // Перемикач Витрати / Доходи
  // =======================
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 15,
    // marginBottom: 20 
  },

  toggleBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent'
  },

  toggleBtnActive: {
    backgroundColor: colors.background,
    borderColor: colors.outline,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleLabel: { color: colors.textSecondary, fontSize: 14, marginBottom: 4 },
  toggleAmount: { color: colors.text, fontSize: 20, fontWeight: 'bold' },

  // Лінія-розділювач
  // divider: {
  //   height: 1,
  //   backgroundColor: colors.outline, 
  //   marginHorizontal: 20,
  //   marginBottom: 20,
  // },
  // --- РОЗДІЛЮВАЧ ІЗ ЗАМКОМ ---
  dividerContainer: {
    position: 'relative',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: colors.outline,
  },
  lockBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
  },

  // =======================
  // Список категорій
  // =======================
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  categoryCard: {
    backgroundColor: colors.surfaceSubtle,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.outlineSoft
  },
  iconContainer: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  pendingCategoryDot: {
    position: 'absolute',
    right: -4,
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryName: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  categoryAmount: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  addCategoryCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  categoryCardDisabled: {
    // opacity: 0.6, 
  },

  transactionsListBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.outlineSoft,
  },
  transactionsListBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
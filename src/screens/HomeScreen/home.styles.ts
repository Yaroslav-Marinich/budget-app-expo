import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  syncBanner: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
    backgroundColor: '#FF9500',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  syncBannerText: {
    color: Colors.background,
    fontSize: 13,
    fontWeight: '700',
  },

  // =======================
  // Рахунки
  // =======================
  sectionTitle: {
    color: Colors.text,
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
    backgroundColor: Colors.surface,
    // width: 240,
    padding: 20,
    borderRadius: 24,
    // marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.outline,
  },

  walletCardPending: {
    borderColor: '#FF9500',
    borderStyle: 'dashed',
  },

walletCardArchived: {
    opacity: 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: Colors.outline,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  archiveBadgeHome: {
    position: 'absolute',
    top: -1, 
    right: 25, 
    backgroundColor: Colors.textSecondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 2,
  },
  archiveBadgeTextHome: {
    color: Colors.background,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pendingBadgeHome: {
    position: 'absolute',
    top: -1,
    left: 25,
    backgroundColor: '#FF9500',
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
    color: Colors.background,
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
    color: Colors.textSecondary,
    fontSize: 14,
  },

  walletAmount: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "bold",
  },

  currency: {
    color: Colors.accent,
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
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  // --- ГОЛОВНИЙ БЛОК (ОСТРІВ) ---
  transactionsBoard: {
    backgroundColor: Colors.surface, 
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
    backgroundColor: Colors.background, 
    borderColor: Colors.outline,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleLabel: { color: Colors.textSecondary, fontSize: 14, marginBottom: 4 },
  toggleAmount: { color: Colors.text, fontSize: 20, fontWeight: 'bold' },

  // Лінія-розділювач
  // divider: {
  //   height: 1,
  //   backgroundColor: Colors.outline, 
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
    backgroundColor: Colors.outline,
  },
  lockBadge: {
    backgroundColor: Colors.surface, 
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
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    width: '48%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 8, 
    borderRadius: 16, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)'
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
    backgroundColor: '#FF9500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1, 
    justifyContent: 'center',
  },
  categoryName: { 
    color: Colors.textSecondary, 
    fontSize: 12,
    fontWeight: '500', 
    marginBottom: 2, 
  },
  categoryAmount: { 
    color: Colors.text, 
    fontSize: 14,
    fontWeight: 'bold', 
  },
  addCategoryCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  categoryCardDisabled: {
    // opacity: 0.6, 
  },
});
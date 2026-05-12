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
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 15,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  manageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  manageIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  manageInfoBox: {
    flex: 1,
  },
  manageName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  manageType: {
    color: colors.textSecondary,
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
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fabText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});
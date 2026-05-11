import { Colors } from '@/src/constants/Colors';
import { StyleSheet } from 'react-native';

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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 15,
  },
  listContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  cardInfo: {
    flex: 1,
    marginRight: 15,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDesc: {
    color: Colors.textSecondary,
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
    backgroundColor: Colors.surfaceMuted,
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
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 14,
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
    borderColor: Colors.outline,
    backgroundColor: Colors.background,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.text,
    fontSize: 14,
    textAlign: 'center',
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  
  // Хедер профілю
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  userName: { color: Colors.text, fontSize: 22, fontWeight: 'bold' },
  userEmail: { color: Colors.textSecondary, fontSize: 14, marginTop: 4 },

  // Секції налаштувань
  section: { marginTop: 25 },
  sectionTitle: { 
    color: Colors.accent, 
    fontSize: 13, 
    fontWeight: '600', 
    textTransform: 'uppercase', 
    marginHorizontal: 20, 
    marginBottom: 10 
  },
  menuBlock: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuText: { flex: 1, color: Colors.text, fontSize: 16, fontWeight: '500' },
  
  // Кнопка виходу
  logoutBtn: {
    marginTop: 40,
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    alignItems: 'center',
    marginBottom: 40
  },
  logoutText: { color: Colors.error, fontWeight: 'bold', fontSize: 16 }
});
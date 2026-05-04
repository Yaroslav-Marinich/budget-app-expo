import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.85)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: Colors.surface, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: Colors.outline,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  closeBtn: { 
    flex: 1,
    backgroundColor: Colors.outline, 
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center' 
  },
  saveBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center'
  }
});
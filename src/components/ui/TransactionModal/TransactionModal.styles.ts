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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerSpacer: {
    width: 30,
  },
  headerCloseBtn: {
    padding: 2,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    flex: 1,
    textAlign: 'center' 
  },
  
  commentContainer: {
    paddingVertical: 20,
    minHeight: 200, 
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
  },
  commentInput: {
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 18,
    borderRadius: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.outline,
    minHeight: 100,
    textAlignVertical: 'top',
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
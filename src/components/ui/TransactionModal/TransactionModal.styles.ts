import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
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
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
  },
  commentInput: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 18,
    borderRadius: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.outline,
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
    backgroundColor: colors.outline, 
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
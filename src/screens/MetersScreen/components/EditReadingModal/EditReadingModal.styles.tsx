import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Базові стилі модалки
  overlay: { flex: 1, backgroundColor: Colors.overlayHeavy, justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: Colors.surface, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20, 
    maxHeight: '90%' 
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { color: Colors.text, fontSize: 20, fontWeight: 'bold' },

  // Стилі форми вводу
  submitCard: {
    backgroundColor: Colors.surface,
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  submitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  manageIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 12,
  },
  submitInputsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 6,
    marginLeft: 4,
  },
  meterInput: {
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  commentInput: {
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.outline,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  formSubmitBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  formSubmitBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  /* --- СТИЛІ БЛОКУ ФОТОГРАФІЇ --- */
  photoSectionContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  photoUploadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  photoUploadingText: {
    color: Colors.textSecondary,
    marginTop: 10,
  },
  photoPreviewContainer: {
    alignItems: 'center',
  },
  photoPreviewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  photoDeleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dangerSoft,
    padding: 10,
    borderRadius: 12,
  },
  photoDeleteText: {
    color: Colors.danger,
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 14,
  },
  photoAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${Colors.primary}15`,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
    borderStyle: 'dashed',
  },
  photoAddText: {
    color: Colors.primary,
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 16,
  },
});
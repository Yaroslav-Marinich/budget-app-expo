import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
  // Базові стилі модалки
  overlay: { flex: 1, backgroundColor: colors.overlayHeavy, justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: colors.surface, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20, 
    maxHeight: '90%' 
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: 'bold' },

  // Стилі форми вводу
  submitCard: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.outline,
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
    color: colors.text,
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
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 6,
    marginLeft: 4,
  },
  meterInput: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  commentInput: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  formSubmitBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  formSubmitBtnText: {
    color: colors.white,
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
    color: colors.textSecondary,
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
    backgroundColor: colors.dangerSoft,
    padding: 10,
    borderRadius: 12,
  },
  photoDeleteText: {
    color: colors.danger,
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 14,
  },
  photoAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}15`,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    borderStyle: 'dashed',
  },
  photoAddText: {
    color: colors.primary,
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 16,
  },
});
import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft: 15,
    },
    logoSelectorContainer: {
        width: 100,
        height: 100,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.outline,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 10,
        overflow: 'hidden',
    },
    logoSelectorContainerActive: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    logoSelectorPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    logoSelectorText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    form: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        marginLeft: 4,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.outline,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: colors.text,
    },
    row: {
        flexDirection: 'row',
        gap: 15,
    },
    flex1: {
        flex: 1,
    },
    chipContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    chip: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.outline,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    chipTextActive: {
        color: colors.background,
    },
    saveBtn: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    saveBtnText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectorBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.outline,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    selectorText: {
        fontSize: 16,
        color: colors.text,
    },
    selectorPlaceholder: {
        fontSize: 16,
        color: colors.textSecondary,
    }
});
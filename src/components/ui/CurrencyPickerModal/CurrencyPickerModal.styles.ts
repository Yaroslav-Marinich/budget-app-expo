import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.overlayHeavy,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        height: '80%',
    },
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        backgroundColor: colors.background,
        color: colors.text,
        padding: 15,
        borderRadius: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.outline,
    },
    closeBtn: {
        marginLeft: 15,
        padding: 5,
    },
    currencyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.outlineSoft || colors.outline,
    },
    currencyCode: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    currencyName: {
        color: colors.textSecondary,
        fontSize: 13,
        marginTop: 4,
    },
});
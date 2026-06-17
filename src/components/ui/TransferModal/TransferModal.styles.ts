import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        maxHeight: "95%",
        minHeight: "60%",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    backBtn: {
        padding: 4,
    },
    title: {
        color: colors.text,
        fontSize: 20,
        fontWeight: "bold",
    },
    closeBtn: {
        padding: 4,
    },
    label: {
        color: colors.textSecondary,
        fontSize: 13,
        marginBottom: 8,
        marginLeft: 5,
        marginTop: 15,
    },

    // Картка вибраного рахунку
    selectedWalletCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.background,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.outline,
    },
    walletCardLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.surfaceMuted,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    walletName: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "600",
    },
    walletBalance: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "bold",
    },
    emptyWalletText: {
        color: colors.textSecondary,
        fontSize: 16,
    },

    // Елемент списку рахунків (при виборі)
    walletListItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.background,
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.outlineSoft,
    },

    // Інпути
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.background,
        borderRadius: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: colors.outline,
    },
    input: {
        flex: 1,
        color: colors.text,
        padding: 15,
        fontSize: 18,
        fontWeight: "600",
    },
    currencySymbol: {
        fontSize: 18,
        color: colors.textSecondary,
        fontWeight: "600",
    },
    saveBtn: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 30,
        marginBottom: 20,
    },
    saveBtnText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
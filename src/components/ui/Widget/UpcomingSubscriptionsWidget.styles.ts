import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
    // Стилі плаваючої кнопки (тригера)
    subscriptionsTrigger: {
        position: 'absolute',
        right: 0,
        backgroundColor: colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingLeft: 12,
        paddingRight: 6,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: 1,
        borderRightWidth: 0,
        borderColor: colors.outlineVariant || colors.outline,
        gap: 8,
        zIndex: 9999,
        elevation: 10,
    },
    subTriggerBadge: {
        position: 'absolute',
        top: -5,
        left: 5,
        backgroundColor: colors.error,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        zIndex: 1,
    },
    subTriggerBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
    },

    // Стилі Drawer (Бокового меню)
    sideDrawerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
    },
    sideDrawerContent: {
        width: '85%',
        height: '100%',
        backgroundColor: colors.background,
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: -10, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 10,
    },
    drawerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
    },

    // Картка підписки всередині віджета
    subItemCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.outlineSoft || colors.outline,
        overflow: 'hidden',
    },
    mainCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 14,
        paddingHorizontal: 15,
        paddingBottom: 2,
    },
    subItemLogo: {
        width: 40,
        height: 40,
        borderRadius: 12,
        marginRight: 12,
    },
    subItemInfo: {
        flex: 1,
    },
    subItemName: {
        color: colors.text,
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    subItemDate: {
        color: colors.warningAccent || colors.warning,
        fontSize: 12,
        fontWeight: '600',
    },
    subItemAmount: {
        color: colors.text,
        fontSize: 15,
        fontWeight: 'bold',
    },
    // Блок деталей, що виїжджає
    expandedContent: {
        paddingHorizontal: 15,
        // paddingBottom: 15,
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: colors.outlineSoft,
        paddingTop: 10,
    },
    expandedRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expandedLabel: {
        color: colors.textSecondary,
        fontSize: 13,
    },
    expandedValue: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    walletBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    // Стрілочка внизу
    arrowContainer: {
        alignItems: 'center',
        paddingBottom: 5,
    },
});
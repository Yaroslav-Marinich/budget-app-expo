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
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 20,
    },

    // --- НОВІ СТИЛІ КАРТКИ ---
    card: {
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        shadowColor: colors.shadow || '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoImage: {
        width: 64,
        height: 64,
        marginRight: 16,
    },
    fallbackLogo: {
        width: 64,
        height: 64,
        borderRadius: 20,
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardHeaderInfo: {
        flex: 1,
    },
    cardTitle: {
        color: colors.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSubtitle: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionBtn: {
        padding: 8,
        backgroundColor: colors.background,
        borderRadius: 12,
    },

    // Блок з деталями
    cardDetails: {
        backgroundColor: colors.surfaceMuted || colors.outlineSoft || 'rgba(0,0,0,0.03)',
        borderRadius: 20,
        padding: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: colors.outlineVariant || colors.outline,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        color: colors.textSecondary,
        fontSize: 13,
        fontWeight: '500',
    },
    detailValue: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    amountText: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '900',
    },
    dateWarning: {
        color: colors.warningAccent || colors.warning,
        fontSize: 14,
        fontWeight: 'bold',
    },
    walletInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    walletIcon: {
        width: 22,
        height: 22,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Плаваюча кнопка
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.shadow || '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
});
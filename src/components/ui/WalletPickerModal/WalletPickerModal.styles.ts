import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
    overlay: { flex: 1, backgroundColor: colors.overlayHeavy, justifyContent: 'flex-end' },
    modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, maxHeight: '80%' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { color: colors.text, fontSize: 20, fontWeight: 'bold' },

    walletCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.background,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.outline,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    info: { flex: 1 },
    walletTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
    badgeContainer: { flexDirection: 'row', gap: 6 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4 },
    badgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
});
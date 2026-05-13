import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
    overlay: { flex: 1, backgroundColor: colors.overlayHeavy, justifyContent: 'flex-end' },
    modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, maxHeight: '80%' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { color: colors.text, fontSize: 20, fontWeight: 'bold' },

    sectionTitle: { color: colors.textSecondary, fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10, marginTop: 15, marginLeft: 5 },

    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
    card: { width: '30%', alignItems: 'center', marginBottom: 15 },

    logoBox: {
        width: 60,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.outlineSoft || colors.outline,
    },
    logoBoxActive: {
        borderColor: colors.text,
        borderWidth: 2,
    },
    serviceName: { color: colors.text, fontSize: 12, textAlign: 'center', fontWeight: '500' },
});
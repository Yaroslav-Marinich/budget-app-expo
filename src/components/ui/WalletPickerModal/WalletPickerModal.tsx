import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { DefaultModal } from "@/src/components/ui/DefaultModal/DefaultModal";
import { useGlobalData } from "@/src/context/DataContext";
import { useTheme } from "@/src/context/ThemeContext";
import { getStyles } from "./WalletPickerModal.styles";

interface Props {
    visible: boolean;
    onClose: () => void;
    onSelect: (walletId: string) => void;
}

export const WalletPickerModal = ({ visible, onClose, onSelect }: Props) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const { wallets } = useGlobalData();

    const activeWallets = wallets
        .filter(w => !w.isArchived)
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

    const mainWalletId = activeWallets.length > 0 ? activeWallets[0].id : null;

    return (
        <DefaultModal visible={visible} onClose={onClose} overlayStyle={styles.overlay} contentStyle={styles.modalContent}>
            <View style={styles.header}>
                <Text style={styles.title}>Оберіть рахунок</Text>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={26} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={activeWallets}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.walletCard}
                        onPress={() => { onSelect(item.id); onClose(); }}
                    >
                        <View style={[styles.iconBox, { backgroundColor: item.isCrypto ? `${colors.warningAccent}15` : `${colors.primary}15` }]}>
                            <Ionicons name={item.icon as any} size={24} color={item.isCrypto ? colors.warningAccent : colors.primary} />
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.walletTitle}>{item.title}</Text>

                            <View style={styles.badgeContainer}>
                                {item.id === mainWalletId && (
                                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                                        <Ionicons name="star" size={10} color={colors.background} />
                                        <Text style={[styles.badgeText, { color: colors.background }]}>Основний</Text>
                                    </View>
                                )}
                                {item.isCrypto && (
                                    <View style={[styles.badge, { backgroundColor: colors.warningAccent }]}>
                                        <Ionicons name="logo-bitcoin" size={10} color={colors.background} />
                                        <Text style={[styles.badgeText, { color: colors.background }]}>Крипто</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <Text style={{ color: colors.textSecondary, fontWeight: 'bold' }}>{item.currency}</Text>
                    </TouchableOpacity>
                )}
            />
        </DefaultModal>
    );
};
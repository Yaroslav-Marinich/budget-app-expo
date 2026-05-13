import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { DefaultModal } from "@/src/components/ui/DefaultModal/DefaultModal";
import { DEFAULT_CATEGORIES_LOGO, SERVICES_DB } from "@/src/constants/ServicesDB";
import { useTheme } from "@/src/context/ThemeContext";
import { Image } from "expo-image";
import { getStyles } from "./ServiceLogoPickerModal.styles";

interface Props {
    visible: boolean;
    onClose: () => void;
    searchQuery: string;
    selectedId?: string;
    onSelect: (serviceId: string) => void;
}

export const ServiceLogoPickerModal = ({ visible, onClose, searchQuery, selectedId, onSelect }: Props) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const { recommended, others } = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        if (!query) return { recommended: [], others: SERVICES_DB };

        const matches = SERVICES_DB.filter(s => {
            const keywords = (s as any).keywords as string[] | undefined;
            return keywords?.some(k => k.includes(query) || query.includes(k));
        });

        const nonMatches = SERVICES_DB.filter(s => !matches.includes(s));

        return { recommended: matches, others: nonMatches };
    }, [searchQuery]);

    const renderServiceCard = (item: typeof SERVICES_DB[0]) => (
        <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => { onSelect(item.id); onClose(); }}
        >
            <View style={[
                styles.logoBox,
                { backgroundColor: colors.surfaceMuted },
                selectedId === item.id && styles.logoBoxActive
            ]}>
                <Image
                    source={item.image}
                    style={{ width: 40, height: 40, borderRadius: 10 }}
                    contentFit="contain"
                    transition={200}
                />
            </View>
            <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <DefaultModal visible={visible} onClose={onClose} overlayStyle={styles.overlay} contentStyle={styles.modalContent}>
            <View style={styles.header}>
                <Text style={styles.title}>Оберіть логотип</Text>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={26} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {recommended.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Схожі сервіси</Text>
                        <View style={styles.grid}>{recommended.map(renderServiceCard)}</View>
                    </>
                )}

                <Text style={styles.sectionTitle}>Тематичні іконки</Text>
                <View style={styles.grid}>
                    {DEFAULT_CATEGORIES_LOGO.map(renderServiceCard)}
                </View>

                <Text style={styles.sectionTitle}>Всі логотипи</Text>
                <View style={styles.grid}>
                    {others.filter(s => !s.id.startsWith('cat_')).map(renderServiceCard)}
                </View>
            </ScrollView>
        </DefaultModal>
    );
};
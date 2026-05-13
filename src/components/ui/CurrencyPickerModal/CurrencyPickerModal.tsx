import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

import { DefaultModal } from "@/src/components/ui/DefaultModal/DefaultModal";
import { CURRENCIES } from "@/src/constants/Currencies";
import { useTheme } from "@/src/context/ThemeContext";
import { getStyles } from "./CurrencyPickerModal.styles";

interface Props {
    visible: boolean;
    onClose: () => void;
    onSelect: (currencyCode: string) => void;
    currencyType?: "fiat" | "crypto";
}

export const CurrencyPickerModal = ({ visible, onClose, onSelect, currencyType }: Props) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const [search, setSearch] = useState("");

    const filteredCurrencies = CURRENCIES.filter(c =>
        (!currencyType || c.type === currencyType) &&
        (
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.country.toLowerCase().includes(search.toLowerCase()) ||
            c.code.toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <DefaultModal visible={visible} onClose={onClose} overlayStyle={styles.overlay} contentStyle={styles.modalContent}>
            <View style={styles.searchHeader}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Пошук валюти або країни..."
                    placeholderTextColor={colors.textSecondary}
                    value={search}
                    onChangeText={setSearch}
                />
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Ionicons name="close" size={28} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredCurrencies}
                keyExtractor={item => item.code}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.currencyItem}
                        onPress={() => {
                            onSelect(item.code);
                            onClose();
                        }}
                    >
                        <View>
                            <Text style={styles.currencyCode}>{item.code} - {item.symbol}</Text>
                            <Text style={styles.currencyName}>{item.name} ({item.country})</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </DefaultModal>
    );
};
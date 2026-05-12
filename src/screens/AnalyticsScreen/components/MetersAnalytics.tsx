import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from "react-native-gifted-charts";

import { useTheme } from '@/src/context/ThemeContext';
import { getMeterColor, getMeterReadingsForAnalytics, Meter, MeterReading, subscribeToMeters } from '@/src/services/meters';

type ViewMode = 'months' | 'years';
const screenWidth = Dimensions.get('window').width;

export const MetersAnalytics = () => {
    const { colors } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [meters, setMeters] = useState<Meter[]>([]);
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);
  const [allReadings, setAllReadings] = useState<MeterReading[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('months');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    
  const currentMeterColor = getMeterColor(selectedMeter?.icon || '');

  useEffect(() => {
    const unsubscribe = subscribeToMeters((data) => {
      setMeters(data);
      if (data.length > 0) {
        setSelectedMeter(prev => prev ? data.find(m => m.id === prev.id) || data[0] : data[0]);
      } else {
        setSelectedMeter(null);
      }
    });
    return () => unsubscribe();
  }, []);

useEffect(() => {
    const fetchReadings = async () => {
      if (!selectedMeter) {
        setLoading(false);
        setAllReadings([]);
        return;
      }
      
      setLoading(true);
      const readings = await getMeterReadingsForAnalytics(selectedMeter.id);
      setAllReadings(readings);
      setLoading(false);
    };
    fetchReadings();
  }, [selectedMeter]);

  useEffect(() => {
    if (allReadings.length === 0) {
      setChartData([]);
      return;
    }

    let formattedData: any[] = [];

    // 🎨 Функція для створення маленького контейнера над точкою
    const renderLabel = (value: number) => (
      <View style={{
        backgroundColor: colors.surface, 
        borderWidth: 1,
        borderColor: currentMeterColor, 
        borderRadius: 6,
        width: 40, 
        paddingVertical: 3,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text 
          numberOfLines={1} 
          adjustsFontSizeToFit 
          style={{ 
            color: colors.text, 
            fontSize: 16, 
            fontWeight: 'bold' 
          }}
        >
          {value}
        </Text>
      </View>
    );

    if (viewMode === 'months') {
      const yearReadings = allReadings.filter(r => r.date.startsWith(selectedYear.toString()));
      formattedData = yearReadings.map(r => {
        const [year, month] = r.date.split('-');
        const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
        return {
          value: r.consumedValue,
          label: date.toLocaleString('uk-UA', { month: 'short' }),
          dataPointLabelComponent: () => renderLabel(r.consumedValue),
          dataPointLabelShiftY: -25,
          dataPointLabelShiftX: -10,
        };
      });
    } else {
      const groupedByYear = allReadings.reduce((acc, r) => {
        const year = r.date.split('-')[0];
        acc[year] = (acc[year] || 0) + r.consumedValue;
        return acc;
      }, {} as Record<string, number>);

      formattedData = Object.keys(groupedByYear).sort().map(year => ({
        value: groupedByYear[year],
        label: year,
        dataPointLabelComponent: () => renderLabel(groupedByYear[year]),
        dataPointLabelShiftY: -25,
        dataPointLabelShiftX: -10,
      }));
    }
    setChartData(formattedData);
  }, [allReadings, viewMode, selectedYear]);

  const changeYear = (offset: number) => {
    setSelectedYear(prev => prev + offset);
  };

  if (loading && meters.length === 0) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (meters.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>Додайте хоча б один лічильник.</Text>
      </View>
    );
  }

  const maxDataValue = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 0;
  
  const avgConsumption = chartData.length > 0 
    ? (chartData.reduce((acc, curr) => acc + curr.value, 0) / chartData.length).toFixed(1) 
    : "0";
  
  const yAxisMax = maxDataValue > 0 ? Math.ceil(maxDataValue * 1.2) : 10;
  const noOfSections = 4;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}>
      {/* 1. Селектор лічильників */}
      <View style={{ height: 50, marginBottom: 15 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
          {meters.map(meter => {
            const isSelected = selectedMeter?.id === meter.id;
            const meterColor = getMeterColor(meter.icon);
            return (
              <TouchableOpacity
                key={meter.id}
                onPress={() => setSelectedMeter(meter)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: isSelected ? meterColor : colors.surfaceSoft,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Ionicons name={meter.icon as any} size={18} color={isSelected ? colors.white : meterColor} />
                <Text style={{ color: isSelected ? colors.white : colors.text, fontWeight: isSelected ? 'bold' : 'normal' }}>
                  {meter.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. Панель фільтрів */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', backgroundColor: colors.surfaceSoft, borderRadius: 8, padding: 3 }}>
          <TouchableOpacity
            style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: viewMode === 'months' ? colors.surfacePressed : 'transparent' }}
            onPress={() => setViewMode('months')}
          >
            <Text style={{ color: viewMode === 'months' ? colors.text : colors.textSecondary, fontSize: 13, fontWeight: '600' }}>Місяці</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: viewMode === 'years' ? colors.surfacePressed : 'transparent' }}
            onPress={() => setViewMode('years')}
          >
            <Text style={{ color: viewMode === 'years' ? colors.text : colors.textSecondary, fontSize: 13, fontWeight: '600' }}>Роки</Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'months' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity onPress={() => changeYear(-1)} style={{ padding: 5 }}><Ionicons name="chevron-back" size={20} color={colors.textSecondary} /></TouchableOpacity>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold' }}>{selectedYear}</Text>
            <TouchableOpacity onPress={() => changeYear(1)} style={{ padding: 5 }}><Ionicons name="chevron-forward" size={20} color={colors.textSecondary} /></TouchableOpacity>
          </View>
        )}
      </View>

      {/* 3. Блок з графіком */}
      <View style={{ marginHorizontal: 20, backgroundColor: colors.surfaceMuted, borderRadius: 20, padding: 20, alignItems: 'center' }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold', marginBottom: 25, alignSelf: 'flex-start' }}>
          {viewMode === 'months' ? `Споживання за ${selectedYear} рік` : 'Глобальний тренд'}
        </Text>

        {loading ? (
           <View style={{ height: 200, justifyContent: 'center' }}><ActivityIndicator color={colors.primary} /></View>
        ) : chartData.length > 0 ? (
            <LineChart
              key={`chart-${viewMode}-${chartData.length}`}
            data={chartData}
            height={200}
            width={screenWidth - 100} 
            initialSpacing={30}
            endSpacing={30}
            color={currentMeterColor}
            thickness={3}
            dataPointsColor={currentMeterColor}
            dataPointsRadius={5}
            
            // 🛠️ ОСІ ТА ЗАЗОР (Залишили як було, з правильним запасом зверху)
            maxValue={yAxisMax} 
            noOfSections={noOfSections}
            stepValue={yAxisMax / noOfSections} 
            yAxisColor="transparent"
            xAxisColor={colors.outlineMuted}
            yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
            xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
            
            // 🛠️ СІТКА (Вертикальна та горизонтальна)
            hideRules={false}
            rulesColor={colors.outlineSoft}
            rulesType="solid"
            showVerticalLines
            verticalLinesColor={colors.outlineSoft}
            
            // Дизайн лінії
            curved={viewMode === 'months'}
            animateOnDataChange
            animationDuration={800}
            areaChart 
            startFillColor={currentMeterColor}
            startOpacity={0.3}
            endOpacity={0.01}
          />
        ) : (
          <View style={{ height: 200, justifyContent: 'center' }}>
            <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
              Немає даних за цей період.
            </Text>
          </View>
        )}
      </View>

      {/* 4. Статистика */}
      {chartData.length > 0 && !loading && (
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, gap: 15 }}>
            <View style={{ flex: 1, backgroundColor: colors.surfaceMuted, padding: 15, borderRadius: 15 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 5 }}>Середнє</Text>
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: 'bold' }}>
                    {(maxDataValue > 0 ? avgConsumption : 0)}
                </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.surfaceMuted, padding: 15, borderRadius: 15 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 5 }}>Максимум</Text>
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: 'bold' }}>
                    {maxDataValue}
                </Text>
            </View>
        </View>
      )}
    </ScrollView>
  );
};
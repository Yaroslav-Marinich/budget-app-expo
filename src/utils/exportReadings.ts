import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Colors } from '../constants/Colors';
import { Meter, MeterReading, getMeterColor } from '../services/meters';

export const shareReadingsAsPDF = async (
  title: string,
  readings: MeterReading[],
  meters: Meter[]
) => {
  let rowsHtml = '';

  readings.forEach((reading) => {
    const meter = meters.find((m) => m.id === reading.meterId);
    if (!meter) return;

    const meterColor = getMeterColor(meter.icon);
    
    // 1. Якщо фото є - малюємо контейнер, якщо ні - порожній рядок
    const photoHtml = reading.photoUrl
      ? `<div style="margin-left: 20px; display: flex; align-items: center; justify-content: center;">
           <img src="${reading.photoUrl}" style="max-width: 300px; height: auto; border-radius: 8px; border: 2px solid ${meterColor}; display: block;" />
         </div>`
      : '';

    // Блок з даними
    let detailsHtml = '';
    if (meter.calcType === 'readings') {
      detailsHtml = `
        <div style="margin-bottom: 8px; font-size: 16px; color: ${Colors.textHint};">Попередні показники: <strong style="color: ${Colors.black};">${reading.prevValue ?? '-'}</strong></div>
        <div style="margin-bottom: 8px; font-size: 16px; color: ${Colors.textHint};">Поточні показники: <strong style="color: ${Colors.black};">${reading.currentValue ?? '-'}</strong></div>
        <div style="margin-top: 15px; font-size: 18px; color: ${Colors.textTertiary};">Спожито (різниця): <strong style="font-size: 24px; color: ${Colors.black};">${reading.consumedValue}</strong></div>
      `;
    } else {
      detailsHtml = `
        <div style="margin-top: 15px; font-size: 18px; color: ${Colors.textTertiary};">Об'єм споживання: <strong style="font-size: 24px; color: ${Colors.black};">${reading.consumedValue}</strong></div>
      `;
    }

    rowsHtml += `
      <div style="display: flex; flex-direction: row; margin-bottom: 30px; padding: 20px; border: 1px solid ${Colors.mutedBorder}; border-radius: 12px; background-color: ${Colors.mutedSurface}; page-break-inside: avoid;">
        
        <div style="flex: 1;">
          <div style="color: ${meterColor}; font-weight: bold; font-size: 22px; margin-bottom: 15px; border-bottom: 2px solid ${meterColor}; padding-bottom: 5px; display: inline-block;">
            ${meter.name}
          </div>
          
          ${detailsHtml}
          
          ${reading.comment ? `<div style="margin-top: 20px; padding: 10px; background-color: ${Colors.white}; border-left: 4px solid ${Colors.mutedBorder}; font-style: italic; font-size: 14px; color: ${Colors.textTertiary};">Коментар: ${reading.comment}</div>` : ''}
        </div>

        ${photoHtml}

      </div>
    `;
  });

  const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          /* 2. Задаємо margin для всіх сторінок PDF-документа */
          @page {
            margin: 40px; 
          }
          body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            color: ${Colors.textTertiary}; 
            line-height: 1.5; 
            /* padding тут більше не потрібен, бо працює @page */
          }
          .header { margin-bottom: 40px; border-bottom: 2px solid ${Colors.surfaceOverlay}; padding-bottom: 15px; }
          .header h1 { margin: 0; font-size: 24px; color: ${Colors.surfaceOverlay}; text-transform: uppercase; letter-spacing: 1px; }
          .header .period { font-size: 18px; color: ${Colors.textHint}; margin-top: 10px; }
        </style>
      </head>
      <body>
        
        <div class="header">
          <h1>Показники по споживанню</h1>
          <div class="period">Звітний період: <strong>${title}</strong></div>
        </div>

        ${rowsHtml}
        
        <div style="margin-top: 50px; text-align: center; color: ${Colors.textFaint}; font-size: 12px; border-top: 1px solid ${Colors.outlineSoft}; padding-top: 20px;">
          Згенеровано автоматично в додатку СімБюджет
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Показники_${title.replace(' ', '_')}`,
        UTI: 'com.adobe.pdf',
      });
    }
  } catch (error) {
    console.error('Помилка експорту PDF:', error);
  }
};
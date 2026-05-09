export type CurrencyType = 'fiat' | 'crypto';

export const CURRENCIES: { code: string, name: string, country: string, symbol: string, type: CurrencyType }[] = [
  // --- Фіатні валюти ---
  { code: 'UAH', name: 'Гривня', country: 'Україна', symbol: '₴', type: 'fiat' },
  { code: 'USD', name: 'Долар', country: 'США', symbol: '$', type: 'fiat' },
  { code: 'EUR', name: 'Євро', country: 'Євросоюз', symbol: '€', type: 'fiat' },
  { code: 'PLN', name: 'Злотий', country: 'Польща', symbol: 'zł', type: 'fiat' },
  { code: 'GBP', name: 'Фунт', country: 'Велика Британія', symbol: '£', type: 'fiat' },
  { code: 'CHF', name: 'Франк', country: 'Швейцарія', symbol: '₣', type: 'fiat' },
  { code: 'CAD', name: 'Долар', country: 'Канада', symbol: 'C$', type: 'fiat' },
  { code: 'JPY', name: 'Єна', country: 'Японія', symbol: '¥', type: 'fiat' },
  { code: 'AUD', name: 'Долар', country: 'Австралія', symbol: 'A$', type: 'fiat' },
  { code: 'CZK', name: 'Крона', country: 'Чехія', symbol: 'Kč', type: 'fiat' },
  
  // --- Криптовалюти ---
  { code: 'USDT', name: 'Tether', country: 'Криптовалюта', symbol: '₮', type: 'crypto' },
  { code: 'BTC', name: 'Bitcoin', country: 'Криптовалюта', symbol: '₿', type: 'crypto' },
  { code: 'ETH', name: 'Ethereum', country: 'Криптовалюта', symbol: 'Ξ', type: 'crypto' },
  { code: 'USDC', name: 'USD Coin', country: 'Криптовалюта', symbol: '©', type: 'crypto' },
];
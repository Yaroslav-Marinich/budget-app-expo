export const DEFAULT_CATEGORIES_LOGO = [
    { id: 'cat_ent', name: 'Розваги', image: require('@/src/assets/services/generic_entertainment.png') },
    { id: 'cat_edu', name: 'Освіта', image: require('@/src/assets/services/generic_education.png') },
    { id: 'cat_health', name: 'Здоров\'я', image: require('@/src/assets/services/generic_health.png') },
    { id: 'cat_trans', name: 'Транспорт', image: require('@/src/assets/services/generic_transport.png') },
    { id: 'cat_shop', name: 'Шопінг', image: require('@/src/assets/services/generic_shopping.png') },
    { id: 'cat_util', name: 'Побутові', image: require('@/src/assets/services/generic_utilities.png') },
    { id: 'cat_soft', name: 'Сервіси/ПЗ', image: require('@/src/assets/services/generic_software.png') },
    { id: 'cat_prog', name: 'Програмування', image: require('@/src/assets/services/generic_programming.png') },
    { id: 'cat_other', name: 'Інше', image: require('@/src/assets/services/generic_other.png') },
];

export const BRANDED_SERVICES_LOGO = [
    // Міжнародні сервіси
    {
        id: 'netflix',
        name: 'Netflix',
        keywords: ['netflix', 'нетфлікс', 'кіно', 'фільми'],
        image: require('@/src/assets/services/netflix.png')
    },
    {
        id: 'youtube',
        name: 'YouTube Premium',
        keywords: ['youtube', 'ютуб', 'premium', 'відео', 'music'],
        image: require('@/src/assets/services/youtube.png')
    },
    {
        id: 'spotify',
        name: 'Spotify',
        keywords: ['spotify', 'спотіфай', 'музика', 'music'],
        image: require('@/src/assets/services/spotify.png')
    },
    {
        id: 'apple_music',
        name: 'Apple Music',
        keywords: ['apple', 'епл', 'music', 'музика'],
        image: require('@/src/assets/services/apple.png')
    },
    {
        id: 'chatgpt',
        name: 'ChatGPT Plus',
        keywords: ['chatgpt', 'gpt', 'ai', 'чатгпт', 'штучний інтелект'],
        image: require('@/src/assets/services/chatgpt.png')
    },
    {
        id: 'github',
        name: 'GitHub',
        keywords: ['github', 'гітхаб', 'code', 'copilot', 'програмування'],
        image: require('@/src/assets/services/github.png')
    },

    // Українські сервіси
    {
        id: 'mono',
        name: 'Monobank',
        keywords: ['mono', 'монобанк', 'моно', 'банка', 'донат', 'розстрочка'],
        image: require('@/src/assets/services/mono.png')
    },
    {
        id: 'megogo',
        name: 'MEGOGO',
        keywords: ['megogo', 'мегого', 'кіно', 'тб', 'спорт'],
        image: require('@/src/assets/services/megogo.png')
    },
    {
        id: 'sweettv',
        name: 'Sweet.tv',
        keywords: ['sweet', 'світ тб', 'sweettv', 'кіно', 'тб'],
        image: require('@/src/assets/services/sweettv.png')
    },
    {
        id: 'kyivstar',
        name: 'Київстар',
        keywords: ['kyivstar', 'київстар', 'зв\'язок', 'телефон', 'тариф'],
        image: require('@/src/assets/services/kyivstar.png')
    },
    {
        id: 'vodafone',
        name: 'Vodafone',
        keywords: ['vodafone', 'водафон', 'зв\'язок', 'телефон', 'тариф'],
        image: require('@/src/assets/services/vodafone.png')
    },
    {
        id: 'lifecell',
        name: 'Lifecell',
        keywords: ['lifecell', 'лайфсел', 'лайф', 'зв\'язок', 'телефон', 'тариф'],
        image: require('@/src/assets/services/lifecell.png')
    }
];

export const SERVICES_DB = [...BRANDED_SERVICES_LOGO, ...DEFAULT_CATEGORIES_LOGO];
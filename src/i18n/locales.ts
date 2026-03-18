import { computed, signal } from '@preact/signals';

export const locales = {
    en: {
        label: 'English',
        common: {
            greeting: 'hiii',
            save: 'Save',
            at: 'at',
            shortDate: (date: Date) =>
                date.toLocaleString('en-US', {
                    day: 'numeric',
                    month: 'short',
                }),
            cancel: 'Cancel',
        },
        nav: {
            dashboard: 'Dashboard',
            products: 'Products',
            settings: 'Settings',
        },
        dashboard: {
            header: 'Dashboard',
            noMeals: [
                'food... need...',
                'why are you not eating?',
                'eat!',
                'just eat somethong!',
                'you should eat',
                'are you hungry?',
            ],
            progress: {
                less: {
                    past: 'undernourished by',
                    current: 'should eat another',
                    future: '',
                },
                between: { past: '', current: 'can eat another', future: '' },
                more: { past: 'overate by', current: 'overate by', future: '' },
            },
        },
        meals: {
            create: 'Add meal',
            createHeaderPlaceholder: 'New meal',
            makeCopy: 'Copy meal',
            copy: 'copy',
            addProduct: 'Add product',
            eaten: 'eaten:',
            portionSize: 'Serving size:',
        },
        products: {
            header: 'Products',
            create: 'Create new product',
            createHeaderPlaceholder: 'Product name',
            createBrandPlaceholder: 'Brand name',
            searchPlaceholder: 'Product name',
            per100: (unit: string) => `Per 100 ${unit} of product`,
            perPiece: 'Per portion',
            hasPiece: 'Use default portion',
            unit: 'Unit of measure',
            deleteDialog: {
                header: 'Delete product?',
                description: (count: number) =>
                    `Product will also be deleted from meals it is used in: ${count}`,
                descriptionNoMeals: 'Product is not used in meals',
                button: 'Delete',
            },
        },
        settings: {
            header: 'Settings',
            dailyGoals: 'Daily goals',
            min: {
                full: 'Lower limit',
                short: 'from',
            },
            max: {
                full: 'Upper limit',
                short: 'to',
            },
            maxMacrosLowerThanMinKcal:
                'Maximal calorie intake from macros is less then minimal calorie goal!',
            minMacrosHigherThanMaxKcal:
                'Minimal calorie intake from macros is higher than maximal calorie goal!',
            system: 'System',
            theme: 'Theme',
            themes: {
                light: 'Light',
                dark: 'Dark',
            },
            language: 'Language',
        },
        unit: {
            kcal: 'kcal',
            gram: 'g',
            ml: 'ml',
            percent: '%',
            piece: 'pcs.',
        },
        macros: {
            kcal: {
                full: 'Calorie',
                short: 'kcal',
                emoji: 'K',
            },
            protein: {
                full: 'Protein',
                short: 'protein',
                emoji: '🥩 P',
            },
            fat: {
                full: 'Fat',
                short: 'fat',
                emoji: '🫒 F',
            },
            carbs: {
                full: 'Carbs',
                short: 'carbs',
                emoji: '🍌 C',
            },
        },
    },
    ru: {
        label: 'Русский',
        common: {
            greeting: 'здрасьте',
            save: 'Сохранить изменения',
            at: 'в',
            shortDate: (date: Date) =>
                `${date.getDate()} ${date.toLocaleString('ru-RU', { month: 'short' }).slice(0, 3)}.`,
            cancel: 'Отмена',
        },
        nav: {
            dashboard: 'Дашборд',
            products: 'Продукты',
            settings: 'Настройки',
        },
        dashboard: {
            header: 'Дашборд',
            noMeals: [
                'покушай...',
                'ты че не ешь?',
                'ешь давай че-нибудь!',
                'съешь чего-нибудь вкусного!',
                'надо поесть',
                'ты не голоден?',
            ],
            progress: {
                less: {
                    past: 'недоел на',
                    current: 'осталось съесть',
                    future: '',
                },
                between: { past: '', current: 'можно съесть', future: '' },
                more: { past: 'переел на', current: 'переел на', future: '' },
            },
        },
        meals: {
            create: 'Добавить прием пищи',
            createHeaderPlaceholder: 'Новый прием пищи',
            makeCopy: 'Скопировать прием пищи',
            copy: 'копия',
            addProduct: 'Добавить продукт',
            eaten: 'съедено:',
            portionSize: 'Размер порции:',
        },
        products: {
            header: 'Продукты',
            create: 'Создать новый продукт',
            createHeaderPlaceholder: 'Название продукта',
            createBrandPlaceholder: 'Название бренда',
            searchPlaceholder: 'Название продукта',
            per100: (unit: string) => `На 100 ${unit} продукта`,
            perPiece: 'На одну порцию',
            hasPiece: 'Есть стандартная порция',
            unit: 'Единица измерения',
            deleteDialog: {
                header: 'Удалить продукт?',
                description: (count: number) =>
                    `Продукт также будет удален из приемов пищи: ${count}`,
                descriptionNoMeals: 'Продукт не использован в приемах пищи',
                button: 'Удалить',
            },
        },
        settings: {
            header: 'Настройки',
            dailyGoals: 'Цели на день',
            min: {
                full: 'Нижняя граница',
                short: 'от',
            },
            max: {
                full: 'Верхняя граница',
                short: 'до',
            },
            maxMacrosLowerThanMinKcal:
                'Максимальный объем калорий от БЖУ меньше минимальной цели по калориям!',
            minMacrosHigherThanMaxKcal:
                'Минимальный объем калорий от БЖУ больше максимальной цели по калориям!',
            system: 'Система',
            theme: 'Тема',
            themes: {
                light: 'Светлая',
                dark: 'Темная',
            },
            language: 'Язык',
        },
        unit: {
            kcal: 'ккал',
            gram: 'г',
            ml: 'мл',
            percent: '%',
            piece: 'шт.',
        },
        macros: {
            kcal: {
                full: 'Калории',
                short: 'ккал',
                emoji: 'К',
            },
            protein: {
                full: 'Белки',
                short: 'белки',
                emoji: '🥩 Б',
            },
            fat: {
                full: 'Жиры',
                short: 'жиры',
                emoji: '🫒 Ж',
            },
            carbs: {
                full: 'Углеводы',
                short: 'углеводы',
                emoji: '🍌 У',
            },
        },
    },
};

export type LocaleVariant = keyof typeof locales;
export type Locale = (typeof locales)[LocaleVariant];

export const localeVariant = signal<LocaleVariant>('ru');

export const locale = computed(() => locales[localeVariant.value]);

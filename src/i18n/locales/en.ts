import { format } from 'date-fns';
import type { Locale } from '../type';

export const en: Locale = {
    label: 'English',
    datetime: {
        at: (date: Date) => format(date, "yyyy-MM-dd 'at' HH:mm"),
        short: (date: Date) => format(date, 'd MMM'),
    },
    common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        perWeek: 'per week',
        unspecified: 'Unspecified',
    },
    dashboard: {
        title: 'Dashboard',
        progress: {
            under: 'undernourished by',
            over: 'overate',
            needMore: 'should eat another',
            canMore: 'can eat another',
        },
    },
    meals: {
        namePlaceholder: 'New meal',
        addNew: 'Add meal',
        makeCopy: 'Copy meal',
        eaten: 'eaten',
        portionSize: 'Portion size',
    },
    products: {
        title: 'Products',
        add: 'Add product',
        namePlaceholder: 'Product name',
        brandPlaceholder: 'Brand name',
        createNew: 'Create new product',
        per100: (unit: string) => `Per 100 ${unit} of product`,
        perPiece: 'Per portion',
        hasPiece: 'Use default portion',
        deleteDialog: {
            title: 'Delete product?',
            description: {
                hasMeals: (count: number) =>
                    `Product will also be deleted from meals (${count})`,
                noMeals: 'Product is not used in meals',
            },
        },
    },
    settings: {
        title: 'Settings',
        info: 'Information',
        system: 'System',
        language: 'Language',
        theme: {
            title: 'Theme',
            light: 'Light',
            dark: 'Dark',
        },
    },
    goals: {
        title: 'Daily goals',
        min: {
            full: 'Lower limit',
            short: 'from',
        },
        max: {
            full: 'Upper limit',
            short: 'to',
        },
        hintMaxMacrosMinKcal:
            'Maximal calorie intake from macros is less then minimal calorie goal!',
        hintMinMacrosMaxKcal:
            'Minimal calorie intake from macros is higher than maximal calorie goal!',
    },
    profile: {
        title: 'Profile',
        fillHint: 'Fill your profile to calculate TDEE',
        height: 'Height',
        weight: 'Weight',
        birthDate: 'Birth date',
        sex: {
            title: 'Sex',
            male: 'Male',
            female: 'Female',
        },
        activityLevel: {
            title: 'Activity',
            description: 'Physical activity level',
            sedentary: {
                title: 'Sedentary',
                description: 'sedentary life style',
            },
            light: {
                title: 'Light',
                description: '1-3 excercises per week',
            },
            moderate: {
                title: 'Moderate',
                description: '3-5 excercises',
            },
            heavy: {
                title: 'Heavy',
                description: 'excercise everyday',
            },
            athlete: {
                title: 'Athlete',
                description: 'professional athlete',
            },
        },
    },
    tdee: {
        title: 'Your TDEE',
        description: 'Total daily energy expenditure',
        forGoal: {
            min: 'For min goal',
            max: 'For max goal',
        },
        deficit: 'Deficit',
        surplus: 'Surplus',
    },
    unit: {
        title: 'Unit of measure',
        kcal: 'kcal',
        gram: 'g',
        ml: 'ml',
        percent: '%',
        piece: 'pcs',
        kg: 'kg',
        cm: 'cm',
    },
    macros: {
        kcal: {
            full: 'Calorie',
            short: 'kcal',
        },
        protein: {
            full: 'Protein',
            short: 'protein',
        },
        fat: {
            full: 'Fat',
            short: 'fat',
        },
        carbs: {
            full: 'Carbs',
            short: 'carbs',
        },
    },
};

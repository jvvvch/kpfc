import { format } from 'date-fns';
import { ru as dateRu } from 'date-fns/locale';
import type { Locale } from '../type';

export const ru: Locale = {
    label: 'Русский',
    datetime: {
        at: (date: Date) => format(date, "dd.MM.yyyy 'в' HH:mm"),
        short: (date: Date) =>
            format(date, 'd MMM', { locale: dateRu }).toLowerCase(),
    },
    common: {
        save: 'Сохранить',
        cancel: 'Отмена',
        delete: 'Удалить',
        perWeek: 'в неделю',
        unspecified: 'Не указано',
    },
    dashboard: {
        title: 'Дашборд',
        progress: {
            under: 'недоел на',
            over: 'переел на',
            needMore: 'осталось съесть',
            canMore: 'можно съесть',
        },
    },
    meals: {
        namePlaceholder: 'Новый прием пищи',
        addNew: 'Добавить прием пищи',
        makeCopy: 'Скопировать прием пищи',
        eaten: 'съедено:',
        portionSize: 'Размер порции',
    },
    products: {
        title: 'Продукты',
        add: 'Добавить продукт',
        namePlaceholder: 'Название продукта',
        brandPlaceholder: 'Название бренда',
        createNew: 'Создать новый продукт',
        per100: (unit: string) => `На 100 ${unit} продукта:`,
        perPiece: 'На одну порцию',
        hasPiece: 'Есть стандартная порция',
        deleteDialog: {
            title: 'Удалить продукт?',
            description: {
                hasMeals: (count: number) =>
                    `Продукт будет удален из приемов пищи (${count})`,
                noMeals: 'Продукт не используется в приемах пищи',
            },
        },
    },
    settings: {
        title: 'Настройки',
        system: 'Система',
        info: 'Информация',
        language: 'Язык',
        theme: {
            title: 'Тема',
            light: 'Светлая',
            dark: 'Темная',
        },
    },
    goals: {
        title: 'Цели на день',
        min: {
            full: 'Нижняя граница',
            short: 'от',
        },
        max: {
            full: 'Верхняя граница',
            short: 'до',
        },
        hintMaxMacrosMinKcal:
            'Максимальный объем калорий от БЖУ меньше минимальной цели по калориям!',
        hintMinMacrosMaxKcal:
            'Минимальный объем калорий от БЖУ больше максимальной цели по калориям!',
    },
    profile: {
        title: 'Профиль',
        fillHint: 'Заполните профиль для подсчета TDEE',
        height: 'Рост',
        weight: 'Вес',
        birthDate: 'Дата рождения',
        sex: {
            title: 'Пол',
            male: 'Мужчина',
            female: 'Женщина',
        },
        activityLevel: {
            title: 'Активность',
            description: 'Уровень физической активности',
            sedentary: {
                title: 'Минимальная',
                description: 'сидячий образ жизни',
            },
            light: {
                title: 'Легкая',
                description: '1-3 тренировок в неделю',
            },
            moderate: {
                title: 'Умеренная',
                description: '3-5 тренировок в неделю',
            },
            heavy: {
                title: 'Высокая',
                description: 'тренировки каждый день',
            },
            athlete: {
                title: 'Очень высокая',
                description: 'профессиональный спорт',
            },
        },
    },
    tdee: {
        title: 'Ваш TDEE',
        description: 'Средний расход за день',
        forGoal: {
            min: 'Минимальная цель',
            max: 'Максимальная цель',
        },
        deficit: 'Дефицит',
        surplus: 'Профицит',
    },
    unit: {
        title: 'Единица измерения',
        kcal: 'ккал',
        gram: 'г',
        ml: 'мл',
        percent: '%',
        piece: 'шт.',
        kg: 'кг',
        cm: 'см',
    },
    macros: {
        kcal: {
            full: 'Калории',
            short: 'ккал',
        },
        protein: {
            full: 'Белки',
            short: 'белки',
        },
        fat: {
            full: 'Жиры',
            short: 'жиры',
        },
        carbs: {
            full: 'Углеводы',
            short: 'углеводы',
        },
    },
};

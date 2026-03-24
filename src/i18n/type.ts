type TitleDescription = {
    title: string;
    description: string;
};
type FullShort = {
    full: string;
    short: string;
};

export type Locale = {
    label: string;
    datetime: {
        at: (date: Date) => string;
        short: (date: Date) => string;
    };
    common: {
        save: string;
        cancel: string;
        delete: string;
        perWeek: string;
        unspecified: string;
    };
    dashboard: {
        title: string;
        progress: {
            under: string;
            over: string;
            needMore: string;
            canMore: string;
        };
    };
    meals: {
        namePlaceholder: string;
        addNew: string;
        makeCopy: string;
        eaten: string;
        portionSize: string;
    };
    products: {
        title: string;
        add: string;
        namePlaceholder: string;
        brandPlaceholder: string;
        createNew: string;
        per100: (unit: string) => string;
        perPiece: string;
        hasPiece: string;
        deleteDialog: {
            title: string;
            description: {
                hasMeals: (count: number) => string;
                noMeals: string;
            };
        };
    };
    settings: {
        title: string;
        system: string;
        language: string;
        info: string;
        theme: {
            title: string;
            light: string;
            dark: string;
        };
    };
    goals: {
        title: string;
        min: FullShort;
        max: FullShort;
        hintMinMacrosMaxKcal: string;
        hintMaxMacrosMinKcal: string;
    };
    profile: {
        title: string;
        fillHint: string;
        height: string;
        weight: string;
        birthDate: string;
        sex: {
            title: string;
            male: string;
            female: string;
        };
        activityLevel: TitleDescription & {
            sedentary: TitleDescription;
            light: TitleDescription;
            moderate: TitleDescription;
            heavy: TitleDescription;
            athlete: TitleDescription;
        };
    };
    tdee: {
        title: string;
        description: string;
        forGoal: {
            min: string;
            max: string;
        };
        deficit: string;
        surplus: string;
    };
    unit: {
        title: string;
        kcal: string;
        gram: string;
        ml: string;
        percent: string;
        piece: string;
        kg: string;
        cm: string;
    };
    macros: {
        kcal: FullShort;
        protein: FullShort;
        fat: FullShort;
        carbs: FullShort;
    };
};

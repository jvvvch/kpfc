import { render } from 'preact';
import { LocationProvider, Route, Router } from 'preact-iso';
import { Page, PageWrapper } from '@/components/feature';
import {
    ComposeProviders,
    LocaleProvider,
    MealDraftProvider,
    ThemeProvider,
} from '@/contexts';
import { db } from '@/domain/db';
import { useQuery } from '@/hooks';
import {
    DashboardPage,
    LoadingPage,
    MealPage,
    ProductListPage,
    ProductPage,
    SettingListPage,
    SettingPage,
} from '@/pages';

function Routes() {
    return (
        <Router>
            <Route path="/" component={DashboardPage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/meals/:id" component={MealPage} />
            <Route path="/products" component={ProductListPage} />
            <Route path="/products/:id" component={ProductPage} />
            <Route path="/settings" component={SettingListPage} />
            <Route path="/settings/:code" component={SettingPage} />
            <Route default component={() => <Page>Not found</Page>} />
        </Router>
    );
}

export function App() {
    const query = useQuery(() => db.init('kpfc.sqlite'));

    if (query.isError()) {
        return JSON.stringify(query.error.value);
    }

    return (
        <ComposeProviders
            providers={[
                LocationProvider,
                ThemeProvider,
                LocaleProvider,
                MealDraftProvider,
            ]}
        >
            <main>
                <PageWrapper>
                    {query.loading.value && <LoadingPage />}
                    {!query.loading.value && <Routes />}
                </PageWrapper>
            </main>
        </ComposeProviders>
    );
}

render(<App />, document.getElementById('app'));

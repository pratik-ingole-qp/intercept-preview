import type { ReactNode } from 'react';
import { HashRouter, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import PreviewPage from './components/PreviewPage';
import RulesPage from './components/RulesPage';
import InterceptSettingsPage from './components/InterceptSettingsPage';
import DataMappingPage from './components/DataMappingPage';
import VisitorIdentityPage from './components/VisitorIdentityPage';
import SetupPage from './components/SetupPage';
import ExamplesPage from './components/ExamplesPage';
import AssistantPage from './components/AssistantPage';
import SiteSearch from './components/SiteSearch';
import { SITE_KICKER, TABS } from './data';

function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const current = TABS.find((t) => location.pathname.startsWith(`/${t.key}`)) ?? TABS[0];

  return (
    <>
      <header className="masthead">
        <div className="masthead-top">
          <p className="kicker">{SITE_KICKER}</p>
          <SiteSearch />
        </div>
        <h1>{current.title}</h1>
        <p>{current.subtitle}</p>

        <div className="view-tabs" role="tablist">
          {TABS.map((t) => (
            <NavLink key={t.key} to={`/${t.key}`}>
              {t.label}
            </NavLink>
          ))}
        </div>
      </header>

      {children}
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/preview" replace />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/preview/:type" element={<PreviewPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/rules/:slug" element={<RulesPage />} />
          <Route path="/settings" element={<InterceptSettingsPage />} />
          <Route path="/settings/:slug" element={<InterceptSettingsPage />} />
          <Route path="/mapping" element={<DataMappingPage />} />
          <Route path="/mapping/:slug" element={<DataMappingPage />} />
          <Route path="/identity" element={<VisitorIdentityPage />} />
          <Route path="/identity/:key" element={<VisitorIdentityPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/examples" element={<ExamplesPage />} />
          <Route path="/examples/:key" element={<ExamplesPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="*" element={<Navigate to="/preview" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;

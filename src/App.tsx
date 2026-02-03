import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AdminRoute from "@/components/AdminRoute";
import Index from "./pages/Index";
import LeilaoCaixaRJ from "./pages/LeilaoCaixaRJ";
import LeilaoRJ from "./pages/LeilaoRJ";
import LeilaoSP from "./pages/LeilaoSP";
import NotFound from "./pages/NotFound";
import PropertyDetail from "./pages/PropertyDetail";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminMarketing from "./pages/AdminMarketing";
import AdminEmailSchedules from "./pages/AdminEmailSchedules";
import AdminEmailLists from "./pages/AdminEmailLists";
import StaticCatalog from "./pages/StaticCatalog";
import AnalyticsSimple from "./pages/AnalyticsSimple";
import TestPage from "./pages/TestPage";
import TestPdfEmail from "./pages/TestPdfEmail";
import TestScheduleProcessor from "./pages/TestScheduleProcessor";
import TestWhatsAppScheduleProcessor from "./pages/TestWhatsAppScheduleProcessor";
import WhatsAppPhoneLists from "./components/admin/WhatsAppPhoneLists";
import WhatsAppSchedules from "./components/admin/WhatsAppSchedules";
import AdminLeads from "./pages/AdminLeads";
import AdminSchedules from "./pages/AdminSchedules";
import AdminCreateSchedule from "./pages/AdminCreateSchedule";
import AdminCreateLead from "./pages/AdminCreateLead";
import AdminGroups from "./pages/AdminGroups";
import AdminFilters from "./pages/AdminFilters";
import TestUnifiedScheduleProcessor from "./pages/TestUnifiedScheduleProcessor";
import AdminCmsPages from "./pages/AdminCmsPages";
import AdminCmsPageEdit from "./pages/AdminCmsPageEdit";
import CmsPreview from "./pages/CmsPreview";
import AdminCmsAssets from "./pages/AdminCmsAssets";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/leilao-caixa-rj" element={<LeilaoCaixaRJ />} />
            <Route path="/leilao-rj" element={<LeilaoRJ />} />
            <Route path="/imovel-rj" element={<LeilaoRJ />} />
            <Route path="/leilao-sp" element={<LeilaoSP />} />
            <Route path="/imovel/:id" element={<PropertyDetail />} />
            <Route path="/imovel/:id/:slug" element={<PropertyDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } />
            <Route path="/admin/analytics" element={
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            } />
            <Route path="/admin/marketing" element={
              <AdminRoute>
                <AdminMarketing />
              </AdminRoute>
            } />
            <Route path="/admin/email-schedules" element={
              <AdminRoute>
                <AdminEmailSchedules />
              </AdminRoute>
            } />
            <Route path="/admin/email-lists" element={
              <AdminRoute>
                <AdminEmailLists />
              </AdminRoute>
            } />
            <Route path="/catalogo/:pageId" element={<StaticCatalog />} />
            <Route path="/admin/analytics-simple" element={<AnalyticsSimple />} />
            <Route path="/admin/analytics-protected" element={
              <AdminRoute>
                <AnalyticsSimple />
              </AdminRoute>
            } />
            <Route path="/test" element={<TestPage />} />
            <Route path="/test-pdf-email" element={<TestPdfEmail />} />
            <Route path="/test-schedule-processor" element={<TestScheduleProcessor />} />
            <Route path="/test-whatsapp-schedule-processor" element={<TestWhatsAppScheduleProcessor />} />
            <Route path="/test-unified-schedule-processor" element={<TestUnifiedScheduleProcessor />} />
            <Route path="/admin/whatsapp-phone-lists" element={<AdminRoute><WhatsAppPhoneLists /></AdminRoute>} />
            <Route path="/admin/whatsapp-schedules" element={<AdminRoute><WhatsAppSchedules /></AdminRoute>} />
            <Route path="/admin/leads" element={
              <AdminRoute>
                <AdminLeads />
              </AdminRoute>
            } />
            <Route path="/admin/leads/create" element={
              <AdminRoute>
                <AdminCreateLead />
              </AdminRoute>
            } />
            <Route path="/admin/leads/edit" element={
              <AdminRoute>
                <AdminCreateLead />
              </AdminRoute>
            } />
            <Route path="/admin/groups" element={
              <AdminRoute>
                <AdminGroups />
              </AdminRoute>
            } />
            <Route path="/admin/schedules" element={
              <AdminRoute>
                <AdminSchedules />
              </AdminRoute>
            } />
            <Route path="/admin/schedules/create" element={
              <AdminRoute>
                <AdminCreateSchedule />
              </AdminRoute>
            } />
            <Route path="/admin/filters" element={
              <AdminRoute>
                <AdminFilters />
              </AdminRoute>
            } />
            {/* CMS Routes */}
            <Route path="/admin/cms" element={
              <AdminRoute>
                <AdminCmsPages />
              </AdminRoute>
            } />
            <Route path="/admin/cms/pages/:slug/edit" element={
              <AdminRoute>
                <AdminCmsPageEdit />
              </AdminRoute>
            } />
            <Route path="/preview/:slug" element={
              <AdminRoute>
                <CmsPreview />
              </AdminRoute>
            } />
            <Route path="/admin/cms/assets" element={
              <AdminRoute>
                <AdminCmsAssets />
              </AdminRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

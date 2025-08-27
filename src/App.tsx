import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AdminRoute from "@/components/AdminRoute";
import Index from "./pages/Index";
import LeilaoCaixaRJ from "./pages/LeilaoCaixaRJ";
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
            <Route path="/admin/whatsapp-phone-lists" element={<AdminRoute><WhatsAppPhoneLists /></AdminRoute>} />
            <Route path="/admin/whatsapp-schedules" element={<AdminRoute><WhatsAppSchedules /></AdminRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

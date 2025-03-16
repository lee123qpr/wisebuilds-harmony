
import { Route } from "react-router-dom";
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";

export const miscRoutes = (
  <>
    <Route path="/" element={<Index />} />
    
    {/* Messages Routes */}
    <Route path="/messages" element={<NotFound />} />
    <Route path="/messages/:conversationId" element={<NotFound />} />
    
    {/* Settings Routes */}
    <Route path="/settings" element={<NotFound />} />
    
    {/* Info Pages */}
    <Route path="/how-it-works" element={<NotFound />} />
    <Route path="/about" element={<NotFound />} />
    
    {/* Legal Pages */}
    <Route path="/legal/privacy" element={<NotFound />} />
    <Route path="/legal/terms" element={<NotFound />} />
    <Route path="/legal/cookies" element={<NotFound />} />
    
    {/* Catch-all route - must be last */}
    <Route path="*" element={<NotFound />} />
  </>
);


import { Route } from "react-router-dom";

// Pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

const PublicRoutes = () => {
  return (
    <>
      <Route path="/" element={<Index />} />
      
      {/* Info Pages */}
      <Route path="/how-it-works" element={<NotFound />} />
      <Route path="/about" element={<NotFound />} />
      
      {/* Legal Pages */}
      <Route path="/legal/privacy" element={<NotFound />} />
      <Route path="/legal/terms" element={<NotFound />} />
      <Route path="/legal/cookies" element={<NotFound />} />
      
      {/* Messages Routes */}
      <Route path="/messages" element={<NotFound />} />
      <Route path="/messages/:conversationId" element={<NotFound />} />
      
      {/* Settings Routes */}
      <Route path="/settings" element={<NotFound />} />
      
      {/* Marketplace index */}
      <Route path="/marketplace" element={<NotFound />} />
      
      {/* Catch-all route - must be last */}
      <Route path="*" element={<NotFound />} />
    </>
  );
};

export default PublicRoutes;

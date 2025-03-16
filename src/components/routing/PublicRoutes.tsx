
import { Route } from "react-router-dom";
import Index from "../../pages/Index";
import NotFound from "../../pages/NotFound";

export const PublicRoutes = () => {
  return (
    <>
      <Route path="/" element={<Index />} />
      <Route path="/marketplace" element={<NotFound />} />
      <Route path="/marketplace/:projectId" element={<NotFound />} />
      <Route path="/messages" element={<NotFound />} />
      <Route path="/messages/:conversationId" element={<NotFound />} />
      <Route path="/settings" element={<NotFound />} />
      <Route path="/how-it-works" element={<NotFound />} />
      <Route path="/about" element={<NotFound />} />
      <Route path="/legal/privacy" element={<NotFound />} />
      <Route path="/legal/terms" element={<NotFound />} />
      <Route path="/legal/cookies" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </>
  );
};

export default PublicRoutes;


import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NotFound = () => {
  const location = useLocation();
  const [routerInfo, setRouterInfo] = useState<{available: boolean, routeCount?: number}>({
    available: false
  });

  useEffect(() => {
    // Log the 404 error for debugging
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Try to access router info if available in window
    try {
      const anyWindow = window as any;
      if (anyWindow.__ROUTER_DEBUG__) {
        setRouterInfo({
          available: true,
          routeCount: anyWindow.__ROUTER_DEBUG__.routeCount
        });
      }
    } catch (e) {
      console.error("Failed to access router debug info:", e);
    }
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="container py-12 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-5xl font-bold text-primary">404</h1>
          <p className="text-xl text-gray-600 mb-6">
            Oops! The page you're looking for cannot be found.
          </p>
          
          {/* Debug info for development */}
          <div className="p-4 bg-gray-50 rounded-md text-left mb-6">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <p className="text-sm text-gray-600">Attempted path: <span className="font-mono">{location.pathname}</span></p>
            {routerInfo.available && (
              <p className="text-sm text-gray-600">Routes registered: {routerInfo.routeCount}</p>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full">Go to Home Page</Button>
            </Link>
            <Link to="/test">
              <Button variant="outline" className="w-full">
                Go to Test Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Add debug info to window in development
if (import.meta.env.DEV) {
  try {
    const anyWindow = window as any;
    anyWindow.__ROUTER_DEBUG__ = {
      routeCount: 0, // Will be updated by router
      notFoundVisits: (anyWindow.__ROUTER_DEBUG__?.notFoundVisits || 0) + 1
    };
  } catch (e) {
    console.error("Failed to set router debug info:", e);
  }
}

export default NotFound;

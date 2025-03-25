
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="container py-12 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-5xl font-bold text-primary">404</h1>
          <p className="text-xl text-gray-600 mb-6">
            Oops! The page you're looking for cannot be found.
          </p>
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

export default NotFound;


import { RouterProvider } from 'react-router-dom';
import router from './index';
import { Suspense, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';

export const AppRouter = () => {
  useEffect(() => {
    console.log('AppRouter mounted - routes should be available');
    console.log('Current path:', window.location.pathname);
    console.log('Available routes:', 
      router.routes.map(route => ({
        path: route.path,
        id: route.id || 'no-id'
      }))
    );
  }, []);

  return (
    <Suspense fallback={
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading application...</p>
      </div>
    }>
      <RouterProvider 
        router={router} 
        fallbackElement={
          <div className="h-screen w-full flex items-center justify-center">
            <p>Failed to load router</p>
          </div>
        } 
      />
    </Suspense>
  );
};

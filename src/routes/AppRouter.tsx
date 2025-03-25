
import { RouterProvider } from 'react-router-dom';
import router from './index';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

export const AppRouter = () => {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Spinner size="lg" /></div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

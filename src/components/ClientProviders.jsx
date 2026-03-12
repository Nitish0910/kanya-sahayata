'use client';
import dynamic from 'next/dynamic';
import { ToastProvider } from '@/components/Toast';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { I18nProvider } from '@/lib/i18n';

const DishaChatbot = dynamic(() => import('@/components/DishaChatbot'), {
  ssr: false,
  loading: () => null,
});

export default function ClientProviders({ children }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ErrorBoundary>
          <ToastProvider>
            {children}
            <DishaChatbot />
          </ToastProvider>
        </ErrorBoundary>
      </I18nProvider>
    </ThemeProvider>
  );
}

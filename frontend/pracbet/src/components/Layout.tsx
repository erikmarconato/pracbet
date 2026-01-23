import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-light flex flex-col">
      <Header />
      <main className="flex-1 pt-4 pb-6 px-4 lg:px-6">
        {children}
      </main>
    </div>
  );
}

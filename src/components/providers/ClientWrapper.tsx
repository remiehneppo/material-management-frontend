'use client';

import { ReactNode } from 'react';
import BrowserCheck from '@/components/BrowserCheck';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <>
      <BrowserCheck />
      {children}
    </>
  );
}

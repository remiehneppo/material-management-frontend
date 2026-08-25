import React, { type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import LoginPage from './login/page';
import Dashboard from './page';

vi.mock('@/components/providers/AuthProvider', () => ({
  useAuth: () => ({ login: vi.fn() }),
}));

vi.mock('@/components/layout/DashboardLayout', () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/layout/Header', () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock('@/services', () => ({
  maintenanceService: {
    getAll: vi.fn().mockResolvedValue({ status: true, data: [] }),
  },
  materialRequestService: {
    getAll: vi.fn().mockResolvedValue({ status: true, data: { items: [] } }),
  },
}));

afterEach(cleanup);

describe('page accessibility structure', () => {
  it('gives the login page one primary landmark, one h1, and a named password toggle', () => {
    render(<LoginPage />);

    expect(document.querySelectorAll('main')).toHaveLength(1);
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    const passwordToggle = screen.getByRole('button', { name: 'Hiện mật khẩu' });
    fireEvent.click(passwordToggle);
    expect(screen.getByRole('button', { name: 'Ẩn mật khẩu' })).toBeTruthy();
  });

  it('does not skip heading levels on the dashboard', () => {
    render(<Dashboard />);

    const levels = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(
      (heading) => Number(heading.tagName.slice(1)),
    );
    expect(levels[0]).toBe(1);
    for (let index = 1; index < levels.length; index += 1) {
      expect(levels[index]).toBeLessThanOrEqual(levels[index - 1] + 1);
    }
  });
});

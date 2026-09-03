import { ThemeProvider } from '@/contexts/theme-context';
import { AuthProvider } from '@/contexts/auth-context';
import { NotificationProvider } from '@/contexts/notification-context';
import { PreferencesProvider } from '@/contexts/preferences-context';
import { CommandPaletteProvider } from '@/contexts/command-palette-context';
import { Toaster } from '@/components/ui/sonner';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <AuthProvider>
          <NotificationProvider>
            <CommandPaletteProvider>
              {children}
              <Toaster position="bottom-right" richColors />
            </CommandPaletteProvider>
          </NotificationProvider>
        </AuthProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}

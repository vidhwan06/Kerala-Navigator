import { Logo } from '@/components/icons/Logo';

export function AppFooter() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center space-x-2">
          <Logo className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground">
            Built for your next adventure in Kerala.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Kerala Navigator. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

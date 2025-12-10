'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Home, MapPin, Utensils, Hotel, Calendar, User, LogOut, ChevronLeft, Camera, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons/Logo';
import { UserNav } from './UserNav';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/attractions', label: 'Attractions', icon: MapPin },
  { href: '/festivals', label: 'Festivals', icon: Calendar },
  { href: '/gallery', label: 'Gallery', icon: Camera },
  { href: '/dining', label: 'Dining', icon: Utensils },
  { href: '/stays', label: 'Stays', icon: Hotel },
  { href: '/itinerary-planner', label: 'Itinerary Planner', icon: Calendar },
];

export function AppHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const shouldShow = isOpen || isHovered || isUserMenuOpen;

  return (
    <>
      {/* Floating Navigation Controls */}
      <div
        className="fixed top-6 left-6 z-50 flex items-center gap-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl transition-all duration-300",
            "bg-gradient-to-br from-primary to-primary/80 hover:scale-110",
            "border-2 border-white/20",
            shouldShow && "scale-110 shadow-primary/50"
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-primary-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-primary-foreground" />
          )}
        </Button>

        {/* Back Button - Only show if not on home page */}
        {pathname !== '/' && (
          <Button
            onClick={() => window.history.back()}
            className={cn(
              "h-12 w-12 rounded-full shadow-xl transition-all duration-300",
              "bg-background/80 backdrop-blur-md hover:bg-background hover:scale-110",
              "border border-border/50 text-foreground",
              "animate-in fade-in zoom-in slide-in-from-left-4 duration-500"
            )}
            title="Go Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Collapsible Navigation Panel */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen w-80 z-40 transition-all duration-500 ease-out",
          shouldShow ? "translate-x-0" : "-translate-x-full"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background with blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-background/95 backdrop-blur-xl border-r border-border/50 shadow-2xl" />

        {/* Gradient accent */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-accent to-primary" />

        {/* Content */}
        <div className="relative h-full flex flex-col p-8 pt-24">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 mb-12 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Logo className="h-8 w-8 text-primary" />
            </div>
            <div>
              <span className="font-bold font-headline text-xl block">Kerala Navigator</span>
              <span className="text-xs text-muted-foreground">God's Own Country</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                    "hover:bg-primary/10 hover:translate-x-2",
                    isActive && "bg-gradient-to-r from-primary/20 to-primary/10 translate-x-2 shadow-lg"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted group-hover:bg-primary/20"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "flex-1 font-medium transition-colors",
                    isActive ? "text-primary font-semibold" : "text-foreground"
                  )}>
                    {item.label}
                  </span>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-all duration-300",
                    isActive ? "text-primary opacity-100" : "opacity-0 group-hover:opacity-100"
                  )} />
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="pt-6 border-t border-border/50">
            <UserNav onOpenChange={setIsUserMenuOpen} />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Explore Kerala with AI
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {shouldShow && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Minimal Top Bar (Logo only, right side) */}
      <header className="fixed top-0 right-0 z-50 p-6">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-md rounded-full border border-border/50 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-sm hidden sm:inline">Kerala Navigator</span>
        </Link>
      </header>
    </>
  );
}

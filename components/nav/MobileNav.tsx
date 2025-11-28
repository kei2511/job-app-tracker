'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User, Menu, Home, Plus, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  
  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="flex flex-col h-full pt-8">
          <div className="px-4 mb-8">
            <h1 className="text-xl font-bold">Job Tracker</h1>
          </div>
          
          <div className="flex flex-col space-y-2 flex-1">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent"
              onClick={() => {
                setIsOpen(false);
                // Open the application form modal
                const event = new CustomEvent('openApplicationForm');
                window.dispatchEvent(event);
              }}
            >
              <Plus className="h-5 w-5" />
              Add Application
            </Link>
          </div>
          
          <div className="border-t pt-4 mt-auto">
            <div className="px-4 py-2">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-8 w-8 rounded-full bg-muted p-1.5" />
                <div>
                  <p className="font-medium text-sm">{session?.user?.username}</p>
                  <p className="text-xs text-muted-foreground">Signed in</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
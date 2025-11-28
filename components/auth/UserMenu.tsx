// components/auth/UserMenu.tsx
'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';

export default function UserMenu() {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center text-sm py-2 px-3">
          <User className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">{session?.user?.username}</span>
          <span className="md:hidden">Profile</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/auth/signin' })}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
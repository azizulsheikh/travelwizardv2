'use client';

import { Wand2, User, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { getAuth, signOut } from 'firebase/auth';

function UserProfile() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />;
  }
  
  if (!user) {
    return (
      <Link href="/login">
        <Button variant="outline" className="text-white bg-transparent border-white/50 hover:bg-white/10 hover:text-white">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </Link>
    )
  }

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer h-9 w-9">
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.displayName || 'My Account'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Header() {
  return (
    <header className="bg-transparent text-primary-foreground sticky top-0 z-20">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex-1"></div>
        <div className="flex-1 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold group">
            <span className="font-headline transition-transform duration-300 group-hover:scale-105 text-animated-gradient flex items-center gap-2">
              <Wand2 className="group-hover:animate-pulse" />
              TripWizard AI
            </span>
          </Link>
        </div>
        <div className="flex-1 flex justify-end">
          <UserProfile />
        </div>
      </nav>
    </header>
  );
}

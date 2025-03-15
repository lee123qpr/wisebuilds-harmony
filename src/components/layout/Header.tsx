import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getStorageUrl } from '@/integrations/supabase/client';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: 'There was an error signing out. Please try again.',
      });
    } else {
      signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    }
  };

  return (
    <header className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-bold text-2xl">
          LeadFlow
        </Link>
        <nav className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url ? getStorageUrl('avatars', user.user_metadata.avatar_url) : undefined} alt={user.email || "Avatar"} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.app_metadata.provider === 'email' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/account">Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/password">Change password</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {user.app_metadata.provider === 'google' && (
                  <DropdownMenuItem disabled>
                    Google Account
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {user.user_metadata.role === 'freelancer' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/freelancer/leads">Leads</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/freelancer/projects">Projects</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/freelancer/profile">Profile</Link>
                    </DropdownMenuItem>
                  </>
                )}

                {user.user_metadata.role === 'business' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/business/profile">Profile & Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/business/projects">Projects</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

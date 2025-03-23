
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import AuthStatus from '@/components/auth/AuthStatus';
import NotificationIcon from '@/components/notifications/NotificationIcon';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const [logoError, setLogoError] = useState(false);
  const { user } = useAuth();
  
  return (
    <header className="w-full bg-white border-b border-bw-gray-light">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            {!logoError ? (
              <img 
                src="/buildwise-logo.png" 
                alt="Buildwise UK" 
                className="h-10 w-auto"
                onError={() => {
                  console.error("Logo failed to load");
                  setLogoError(true);
                }}
              />
            ) : (
              <span className="text-xl font-bold text-primary">Buildwise UK</span>
            )}
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/how-it-works">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  How It Works
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/contact">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-2">
          {user && <NotificationIcon />}
          <AuthStatus />
        </div>
      </div>
    </header>
  );
};

export default Header;

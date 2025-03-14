
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import AuthStatus from '@/components/auth/AuthStatus';

const Header: React.FC = () => {
  const [logoError, setLogoError] = useState(false);
  
  return (
    <header className="w-full bg-white border-b border-bw-gray-light">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            {!logoError ? (
              <img 
                src="buildwise-logo.png" 
                alt="BuildWise Logo" 
                className="h-10 w-auto"
                onError={() => {
                  console.error("Logo failed to load");
                  setLogoError(true);
                }}
              />
            ) : (
              <span className="text-xl font-bold text-primary">BuildWise</span>
            )}
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/marketplace">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Marketplace
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/dashboard/business/account">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Account
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
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
          </NavigationMenuList>
        </NavigationMenu>

        <AuthStatus />
      </div>
    </header>
  );
};

export default Header;

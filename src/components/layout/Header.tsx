
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-bw-gray-light">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/buildwise-logo.png" 
              alt="BuildWise UK Logo" 
              className="h-10 w-auto"
            />
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

        <div className="flex items-center space-x-4">
          <Link to="/auth/login">
            <Button variant="outline" className="border-logo-dark-blue text-logo-dark-blue hover:bg-logo-light-blue/20">
              Log In
            </Button>
          </Link>
          <div className="hidden sm:block">
            <Link to="/auth/signup/freelancer">
              <Button variant="outline" className="border-logo-dark-blue text-logo-dark-blue hover:bg-logo-light-blue/20">
                Freelancer Sign Up
              </Button>
            </Link>
          </div>
          <Link to="/auth/signup/business">
            <Button className="bg-logo-dark-blue hover:bg-logo-dark-blue/90 text-white">
              Business Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

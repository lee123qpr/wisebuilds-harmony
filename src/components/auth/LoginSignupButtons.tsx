
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LoginSignupButtons: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <Link to="/auth/login">
        <Button variant="ghost" size="sm">
          Log in
        </Button>
      </Link>
      <Link to="/auth/signup">
        <Button size="sm">Sign up</Button>
      </Link>
    </div>
  );
};

export default LoginSignupButtons;

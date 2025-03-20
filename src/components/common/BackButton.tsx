
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonProps } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps extends Omit<ButtonProps, 'children'> {
  to?: string;
  label?: string;
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  label = 'Go Back',
  onClick,
  variant = 'ghost',
  size = 'sm',
  className,
  ...props
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleClick} 
      className={`gap-2 ${className || ''}`}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
};

export default BackButton;

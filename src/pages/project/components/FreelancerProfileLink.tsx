
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonProps } from '@/components/ui/button';

interface FreelancerProfileLinkProps extends Omit<ButtonProps, 'onClick'> {
  freelancerId: string;
  projectId: string;
  className?: string;
  children?: React.ReactNode;
}

const FreelancerProfileLink: React.FC<FreelancerProfileLinkProps> = ({
  freelancerId,
  projectId,
  className,
  children = 'View Profile',
  ...props
}) => {
  return (
    <Button
      as={Link}
      to={`/freelancer/${freelancerId}`}
      state={{ from: 'projectApplications', projectId }}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FreelancerProfileLink;

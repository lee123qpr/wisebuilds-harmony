
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
    <Link
      to={`/freelancer/${freelancerId}`}
      state={{ from: 'projectApplications', projectId }}
      className="inline-block"
    >
      <Button
        className={className}
        {...props}
      >
        {children}
      </Button>
    </Link>
  );
};

export default FreelancerProfileLink;

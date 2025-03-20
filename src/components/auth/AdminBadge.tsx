
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminBadge: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      title="Admin Dashboard" 
      onClick={() => navigate('/dashboard/admin')}
      className="flex items-center gap-1.5 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
    >
      <Shield className="h-4 w-4" />
      <span className="text-xs font-medium">Admin</span>
    </Button>
  );
};

export default AdminBadge;

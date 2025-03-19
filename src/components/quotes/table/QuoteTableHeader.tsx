
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

const QuoteTableHeader: React.FC = () => {
  return (
    <TableHeader className="bg-slate-50">
      <TableRow>
        <TableHead className="w-[250px]">Freelancer</TableHead>
        <TableHead>Quote Type</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Start Date</TableHead>
        <TableHead>Duration</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default QuoteTableHeader;

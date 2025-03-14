
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { NewProjectDialogContent } from './new-project/NewProjectDialogContent';

const NewProjectDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          const activeElement = document.activeElement;
          const pacContainer = document.querySelector('.pac-container');
          
          if (
            pacContainer && 
            activeElement && 
            activeElement instanceof HTMLInputElement && 
            activeElement.name === 'location'
          ) {
            return;
          }
        }
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Post New Project
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          if (e.target instanceof Node) {
            const isPacContainer = e.target instanceof Element && e.target.closest('.pac-container');
            if (isPacContainer) {
              e.preventDefault();
            }
          }
        }}
        onPointerDownOutside={(e) => {
          if (e.target instanceof Node) {
            const isPacContainer = e.target instanceof Element && e.target.closest('.pac-container');
            if (isPacContainer) {
              e.preventDefault();
            }
          }
        }}
      >
        <NewProjectDialogContent setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;

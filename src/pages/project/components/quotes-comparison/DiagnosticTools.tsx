
import React from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

interface DiagnosticToolsProps {
  projectId?: string;
  isCheckingDirectly: boolean;
  isFixingClientIDs: boolean;
  directQuotesCount: number | null;
  onCheckDirectly: () => Promise<void>;
  onFixClientIds: () => Promise<void>;
}

const DiagnosticTools: React.FC<DiagnosticToolsProps> = ({
  projectId,
  isCheckingDirectly,
  isFixingClientIDs,
  directQuotesCount,
  onCheckDirectly,
  onFixClientIds
}) => {
  return (
    <>
      <div className="flex gap-2 mb-4">
        <Button 
          variant="secondary"
          onClick={onCheckDirectly}
          disabled={isCheckingDirectly}
          className="flex-1"
        >
          {isCheckingDirectly ? 'Checking...' : 'Run Database Diagnostic Check'}
        </Button>
        
        {directQuotesCount && directQuotesCount > 0 && (
          <Button 
            variant="default"
            onClick={onFixClientIds}
            disabled={isFixingClientIDs}
            className="flex-1"
          >
            {isFixingClientIDs ? 'Fixing...' : 'Fix Quote Client IDs'}
          </Button>
        )}
      </div>
      
      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="troubleshooting">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Troubleshooting Information
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Common reasons for quotes not appearing:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>No quotes have been submitted yet</li>
                <li>Quotes were submitted to a different project ID</li>
                <li>Quotes have a different client_id than your user ID</li>
                <li>Database permissions prevent fetching the quotes</li>
              </ul>
              <p className="mt-2">Steps to troubleshoot:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Use the "Run Database Diagnostic Check" to see if there are quotes in the database</li>
                <li>If quotes appear, use "Fix Quote Client IDs" to update them to your user ID</li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default DiagnosticTools;

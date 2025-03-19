
import React, { useState } from 'react';
import { HelpCircle, AlertCircle, Info, Tool } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [showIdProblemDetails, setShowIdProblemDetails] = useState(false);

  return (
    <>
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Issue Detected</AlertTitle>
        <AlertDescription>
          <p className="mb-2">There appears to be an issue with the quote client IDs in the database. The system has detected that some quotes have the same ID for both client and freelancer.</p>
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowIdProblemDetails(!showIdProblemDetails)}
            >
              {showIdProblemDetails ? 'Hide Details' : 'Show Details'}
            </Button>
            
            <Button 
              variant="default"
              size="sm"
              onClick={onFixClientIds}
              disabled={isFixingClientIDs}
            >
              {isFixingClientIDs ? 'Fixing...' : 'Fix ID Problem'}
            </Button>
          </div>
          
          {showIdProblemDetails && (
            <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
              <p className="font-semibold">Problem Details:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Some quotes have identical client_id and freelancer_id values</li>
                <li>This prevents proper filtering of quotes for both clients and freelancers</li>
                <li>The system needs to assign the correct client_id based on the project owner</li>
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">The "Fix ID Problem" button will update these quotes to use the project owner's ID as the client_id.</p>
            </div>
          )}
        </AlertDescription>
      </Alert>

      <div className="flex gap-2 mb-4">
        <Button 
          variant="secondary"
          onClick={onCheckDirectly}
          disabled={isCheckingDirectly}
          className="flex-1"
        >
          <Tool className="h-4 w-4 mr-2" />
          {isCheckingDirectly ? 'Checking...' : 'Run Database Diagnostic Check'}
        </Button>
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
                <li>Quotes have identical client_id and freelancer_id values (duplicate ID issue)</li>
                <li>Database permissions prevent fetching the quotes</li>
              </ul>
              <p className="mt-2">Steps to troubleshoot:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Use the "Run Database Diagnostic Check" to see if there are quotes in the database</li>
                <li>If quotes appear, use "Fix ID Problem" to update them with the correct client ID</li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default DiagnosticTools;

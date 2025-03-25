
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { sendTestEmail } from '@/services/notifications/emailService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, CheckCircle } from 'lucide-react';

const EmailTester = () => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastResult, setLastResult] = useState<{success: boolean, message: string} | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setLastResult(null);
    
    try {
      const result = await sendTestEmail(email);
      
      if (result.success) {
        toast({
          title: "Test email sent!",
          description: `Email successfully sent to ${email}`,
          variant: "default",
        });
        setLastResult({
          success: true,
          message: `Email sent to ${email}. Check your inbox!`
        });
      } else {
        toast({
          title: "Failed to send email",
          description: result.error?.message || "An unknown error occurred",
          variant: "destructive",
        });
        setLastResult({
          success: false,
          message: `Error: ${result.error?.message || "Unknown error"}`
        });
      }
    } catch (error) {
      console.error("Error testing email:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setLastResult({
        success: false,
        message: `Exception: ${error instanceof Error ? error.message : "Unknown error"}`
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" /> 
          Email Tester
        </CardTitle>
        <CardDescription>
          Send a test email to verify your Resend integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="Enter email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSending}
              />
            </div>
          </div>
        </form>
        
        {lastResult && (
          <div className={`mt-4 p-3 rounded-md ${lastResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <div className="flex items-start gap-2">
              {lastResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <Mail className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <p className="text-sm">{lastResult.message}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={isSending || !email}
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Test Email'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailTester;

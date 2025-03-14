
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertCircle, Save, Loader2, Trash2 } from 'lucide-react';

const AccountSettingsTab: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Email is required',
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;
      
      toast({
        title: 'Email Update Requested',
        description: 'A confirmation email has been sent to your new email address.',
      });
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to update email',
        description: error.message || 'An error occurred while updating your email.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Password is required',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passwords do not match',
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated.',
      });
      
      // Clear password fields
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to update password',
        description: error.message || 'An error occurred while updating your password.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // Delete the client profile first
      const { error: profileError } = await supabase
        .from('client_profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Sign out the user
      await signOut();
      
      toast({
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted.',
      });
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete account',
        description: error.message || 'An error occurred while deleting your account.',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
          <CardDescription>
            Update your email address. You'll need to verify the new email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateEmail}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="submit" disabled={isSaving || email === user?.email}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to a new secure one.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                type="submit" 
                disabled={isSaving || !password || password !== confirmPassword}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Deleting your account will remove all of your data from our system, including your profile, projects, and any other information associated with your account.
          </p>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center p-4 mt-2 bg-destructive/10 rounded-md">
                <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
                <p className="text-sm text-destructive">
                  All your projects, documents, and profile information will be deleted.
                </p>
              </div>
              <DialogFooter className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettingsTab;

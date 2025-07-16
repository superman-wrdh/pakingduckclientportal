import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

export type Invitation = Tables<'invitations'>;

export const useInvitations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvitations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch invitations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createInvitation = async (
    companyName: string,
    pointOfContact: string,
    email: string
  ) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('invitations')
        .insert({
          user_id: user.id,
          company_name: companyName,
          point_of_contact: pointOfContact,
          email: email,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setInvitations(prev => [data, ...prev]);
      toast({
        title: "Invite Sent",
        description: `Invitation sent to ${pointOfContact} at ${companyName}`,
      });
      return true;
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Error",
        description: "Failed to send invite. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateInvitationStatus = async (id: string, status: 'accepted' | 'declined') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('invitations')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setInvitations(prev =>
        prev.map(inv => inv.id === id ? { ...inv, status } : inv)
      );
    } catch (error) {
      console.error('Error updating invitation status:', error);
      toast({
        title: "Error",
        description: "Failed to update invitation status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  return {
    invitations,
    loading,
    createInvitation,
    updateInvitationStatus,
    refreshInvitations: fetchInvitations
  };
};
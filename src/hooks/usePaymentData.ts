import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

export interface PaymentMethod {
  id: string;
  type: string;
  brand: string;
  last4: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  invoice_date: string;
}

export const usePaymentData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses((data || []) as Address[]);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setPaymentMethods((data || []) as PaymentMethod[]);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  // Fetch invoices
  const fetchInvoices = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('invoice_date', { ascending: false });

      if (error) throw error;
      setInvoices((data || []) as Invoice[]);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  // Save or update address
  const saveAddress = async (addressData: Omit<Address, 'id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('addresses')
        .upsert({
          ...addressData,
          user_id: user.id,
        });

      if (error) throw error;
      
      await fetchAddresses();
      toast({
        title: "Success",
        description: `${addressData.type} address updated successfully`,
      });
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      });
    }
  };

  // Get address by type
  const getAddressByType = (type: 'billing' | 'shipping'): Address | null => {
    return addresses.find(addr => addr.type === type) || null;
  };

  // Load all data
  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchAddresses(),
        fetchPaymentMethods(),
        fetchInvoices(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  return {
    addresses,
    paymentMethods,
    invoices,
    loading,
    saveAddress,
    getAddressByType,
    refetch: loadData,
  };
};
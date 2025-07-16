import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Calendar, DollarSign, Edit, Save, X, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePaymentData, Address } from "@/hooks/usePaymentData";
import { useAuth } from "@/hooks/useAuth";

const Payment = () => {
  const { user } = useAuth();
  const { 
    addresses, 
    paymentMethods, 
    invoices, 
    loading, 
    saveAddress, 
    getAddressByType 
  } = usePaymentData();
  
  const [billAddressEdit, setBillAddressEdit] = useState(false);
  const [shipmentAddressEdit, setShipmentAddressEdit] = useState(false);
  
  // Get current addresses or initialize empty ones
  const currentBillAddress = getAddressByType('billing');
  const currentShipAddress = getAddressByType('shipping');
  
  const [billAddress, setBillAddress] = useState({
    street: currentBillAddress?.street || "",
    city: currentBillAddress?.city || "",
    state: currentBillAddress?.state || "",
    zip_code: currentBillAddress?.zip_code || "",
    country: currentBillAddress?.country || "United States"
  });
  
  const [shipmentAddress, setShipmentAddress] = useState({
    street: currentShipAddress?.street || "",
    city: currentShipAddress?.city || "",
    state: currentShipAddress?.state || "",
    zip_code: currentShipAddress?.zip_code || "",
    country: currentShipAddress?.country || "United States"
  });

  // Update local state when data loads
  useState(() => {
    if (currentBillAddress) {
      setBillAddress({
        street: currentBillAddress.street,
        city: currentBillAddress.city,
        state: currentBillAddress.state,
        zip_code: currentBillAddress.zip_code,
        country: currentBillAddress.country
      });
    }
    if (currentShipAddress) {
      setShipmentAddress({
        street: currentShipAddress.street,
        city: currentShipAddress.city,
        state: currentShipAddress.state,
        zip_code: currentShipAddress.zip_code,
        country: currentShipAddress.country
      });
    }
  });

  const handleSaveBillAddress = async () => {
    await saveAddress({
      type: 'billing',
      street: billAddress.street,
      city: billAddress.city,
      state: billAddress.state,
      zip_code: billAddress.zip_code,
      country: billAddress.country,
      is_default: true
    });
    setBillAddressEdit(false);
  };

  const handleSaveShipmentAddress = async () => {
    await saveAddress({
      type: 'shipping',
      street: shipmentAddress.street,
      city: shipmentAddress.city,
      state: shipmentAddress.state,
      zip_code: shipmentAddress.zip_code,
      country: shipmentAddress.country,
      is_default: true
    });
    setShipmentAddressEdit(false);
  };

  const handleCancelBillEdit = () => {
    setBillAddressEdit(false);
    if (currentBillAddress) {
      setBillAddress({
        street: currentBillAddress.street,
        city: currentBillAddress.city,
        state: currentBillAddress.state,
        zip_code: currentBillAddress.zip_code,
        country: currentBillAddress.country
      });
    }
  };

  const handleCancelShipmentEdit = () => {
    setShipmentAddressEdit(false);
    if (currentShipAddress) {
      setShipmentAddress({
        street: currentShipAddress.street,
        city: currentShipAddress.city,
        state: currentShipAddress.state,
        zip_code: currentShipAddress.zip_code,
        country: currentShipAddress.country
      });
    }
  };

  if (!user) {
    return (
      <main className="flex-1 p-6 bg-background overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Please sign in to view your payment information.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex-1 p-6 bg-background overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading payment information...</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 bg-background overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Billing & Payment</h1>
            <p className="text-muted-foreground">
              Manage your subscription, payment methods, and view billing history.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bill Address */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Bill Address
                  </CardTitle>
                  {!billAddressEdit ? (
                    <Button variant="outline" size="sm" onClick={() => setBillAddressEdit(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleSaveBillAddress}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCancelBillEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>
                  Your billing address for invoices and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {billAddressEdit ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="billStreet">Street Address</Label>
                      <Input
                        id="billStreet"
                        value={billAddress.street}
                        onChange={(e) => setBillAddress({...billAddress, street: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billCity">City</Label>
                        <Input
                          id="billCity"
                          value={billAddress.city}
                          onChange={(e) => setBillAddress({...billAddress, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="billState">State</Label>
                        <Input
                          id="billState"
                          value={billAddress.state}
                          onChange={(e) => setBillAddress({...billAddress, state: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billZip">ZIP Code</Label>
                        <Input
                          id="billZip"
                           value={billAddress.zip_code}
                           onChange={(e) => setBillAddress({...billAddress, zip_code: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="billCountry">Country</Label>
                        <Input
                          id="billCountry"
                          value={billAddress.country}
                          onChange={(e) => setBillAddress({...billAddress, country: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">{billAddress.street}</p>
                    <p className="text-muted-foreground">
                      {billAddress.city}, {billAddress.state} {billAddress.zip_code}
                    </p>
                    <p className="text-muted-foreground">{billAddress.country}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipment Address */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipment Address
                  </CardTitle>
                  {!shipmentAddressEdit ? (
                    <Button variant="outline" size="sm" onClick={() => setShipmentAddressEdit(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleSaveShipmentAddress}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCancelShipmentEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>
                  Your shipping address for physical deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {shipmentAddressEdit ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="shipStreet">Street Address</Label>
                      <Input
                        id="shipStreet"
                        value={shipmentAddress.street}
                        onChange={(e) => setShipmentAddress({...shipmentAddress, street: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shipCity">City</Label>
                        <Input
                          id="shipCity"
                          value={shipmentAddress.city}
                          onChange={(e) => setShipmentAddress({...shipmentAddress, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipState">State</Label>
                        <Input
                          id="shipState"
                          value={shipmentAddress.state}
                          onChange={(e) => setShipmentAddress({...shipmentAddress, state: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shipZip">ZIP Code</Label>
                        <Input
                          id="shipZip"
                           value={shipmentAddress.zip_code}
                           onChange={(e) => setShipmentAddress({...shipmentAddress, zip_code: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipCountry">Country</Label>
                        <Input
                          id="shipCountry"
                          value={shipmentAddress.country}
                          onChange={(e) => setShipmentAddress({...shipmentAddress, country: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">{shipmentAddress.street}</p>
                    <p className="text-muted-foreground">
                      {shipmentAddress.city}, {shipmentAddress.state} {shipmentAddress.zip_code}
                    </p>
                    <p className="text-muted-foreground">{shipmentAddress.country}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment Methods</CardTitle>
                <Button variant="outline">Add Payment Method</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {method.brand} ending in {method.last4}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires {method.expiry_month}/{method.expiry_year}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.is_default && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invoice History */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                Download and view your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{invoice.id}</p>
                        <Badge 
                          variant={invoice.status === "Paid" ? "secondary" : "destructive"}
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {invoice.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.invoice_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold">${invoice.amount.toFixed(2)}</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
  );
};

export default Payment;
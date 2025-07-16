import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Send, UserPlus, Clock, CheckCircle, XCircle, Mail } from "lucide-react";

interface Invite {
  id: string;
  companyName: string;
  pointOfContact: string;
  email: string;
  status: "pending" | "accepted" | "declined";
  sentDate: string;
}

const Invite = () => {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState("");
  const [pointOfContact, setPointOfContact] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for existing invites
  const [invites, setInvites] = useState<Invite[]>([
    {
      id: "1",
      companyName: "TechStart Inc.",
      pointOfContact: "John Smith",
      email: "john@techstart.com",
      status: "accepted",
      sentDate: "2024-01-15"
    },
    {
      id: "2",
      companyName: "Innovation Labs",
      pointOfContact: "Sarah Johnson",
      email: "sarah@innovationlabs.com",
      status: "pending",
      sentDate: "2024-01-10"
    },
    {
      id: "3",
      companyName: "Future Corp",
      pointOfContact: "Mike Wilson",
      email: "mike@futurecorp.com",
      status: "declined",
      sentDate: "2024-01-08"
    }
  ]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName || !pointOfContact || !email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newInvite: Invite = {
        id: String(invites.length + 1),
        companyName,
        pointOfContact,
        email,
        status: "pending",
        sentDate: new Date().toISOString().split('T')[0]
      };

      setInvites(prev => [newInvite, ...prev]);

      toast({
        title: "Invite Sent",
        description: `Invitation sent to ${pointOfContact} at ${companyName}`,
      });

      // Clear form
      setCompanyName("");
      setPointOfContact("");
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invite. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: Invite["status"]) => {
    switch (status) {
      case "accepted":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "declined":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        );
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
        <p className="text-muted-foreground">
          Invite new members to join Paking Duck
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Send Invite Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Send Invitation
            </CardTitle>
            <CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pointOfContact">Point of Contact</Label>
                <Input
                  id="pointOfContact"
                  placeholder="Enter contact person's name"
                  value={pointOfContact}
                  onChange={(e) => setPointOfContact(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Invitation Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Invitation Overview</CardTitle>
            <CardDescription>Current invitation statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Accepted</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {invites.filter(i => i.status === "accepted").length}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Pending</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {invites.filter(i => i.status === "pending").length}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium">Declined</span>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {invites.filter(i => i.status === "declined").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invites List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Sent Invitations
          </CardTitle>
          <CardDescription>
            Track the status of all sent invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(invite.pointOfContact)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{invite.pointOfContact}</span>
                    </div>
                  </TableCell>
                  <TableCell>{invite.companyName}</TableCell>
                  <TableCell className="text-muted-foreground">{invite.email}</TableCell>
                  <TableCell>{getStatusBadge(invite.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(invite.sentDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Invite;
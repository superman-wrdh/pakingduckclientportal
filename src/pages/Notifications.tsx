import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  Package, 
  Users, 
  MessageSquare, 
  Heart, 
  Star, 
  Clock,
  CheckCircle,
  AlertCircle,
  Truck
} from "lucide-react";

const Notifications = () => {
  const projectUpdates = [
    {
      id: 1,
      title: "Coffee Package Design Approved",
      description: "Manufacturing phase has begun",
      timestamp: "2 hours ago",
      type: "approved",
      icon: CheckCircle,
      project: "Artisan Coffee Packaging"
    },
    {
      id: 2,
      title: "Tea Box Shipping Update",
      description: "Package shipped to client - tracking #TB2024001",
      timestamp: "4 hours ago",
      type: "shipping",
      icon: Truck,
      project: "Premium Tea Collection"
    },
    {
      id: 3,
      title: "Design Review Required",
      description: "New feedback from client on beverage label design",
      timestamp: "1 day ago",
      type: "review",
      icon: AlertCircle,
      project: "Energy Drink Labels"
    },
    {
      id: 4,
      title: "Manufacturing Complete",
      description: "Wine bottle packaging batch ready for quality check",
      timestamp: "2 days ago",
      type: "complete",
      icon: Package,
      project: "Luxury Wine Bottles"
    }
  ];

  const socialEngagement = [
    {
      id: 1,
      user: "Sarah Chen",
      action: "liked your design showcase",
      project: "Sustainable Food Packaging",
      timestamp: "1 hour ago",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 2,
      user: "Mike Rodriguez",
      action: "commented on your project",
      project: "Minimalist Cosmetic Boxes",
      timestamp: "3 hours ago",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 3,
      user: "Emily Watson",
      action: "shared your design in community",
      project: "Eco-Friendly Packaging Series",
      timestamp: "5 hours ago",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 4,
      user: "David Kim",
      action: "started following your work",
      project: "",
      timestamp: "1 day ago",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 5,
      user: "Lisa Thompson",
      action: "gave 5 stars to your portfolio",
      project: "Tech Product Packaging",
      timestamp: "2 days ago",
      avatar: "/api/placeholder/32/32"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "approved": return CheckCircle;
      case "shipping": return Truck;
      case "review": return AlertCircle;
      case "complete": return Package;
      default: return Bell;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "approved": return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "shipping": return <Badge className="bg-blue-100 text-blue-800">Shipping</Badge>;
      case "review": return <Badge className="bg-orange-100 text-orange-800">Review</Badge>;
      case "complete": return <Badge className="bg-purple-100 text-purple-800">Complete</Badge>;
      default: return <Badge variant="secondary">Update</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated on project progress and community engagement
          </p>
        </div>
        <Button variant="outline">
          <Bell className="h-4 w-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Project Updates
              </CardTitle>
              <CardDescription>
                Recent updates on your packaging projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectUpdates.map((update) => {
                const IconComponent = getTypeIcon(update.type);
                return (
                  <div key={update.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{update.title}</h4>
                        {getTypeBadge(update.type)}
                      </div>
                      <p className="text-sm text-muted-foreground">{update.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {update.timestamp}
                        <Separator orientation="vertical" className="h-3" />
                        <span className="font-medium">{update.project}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Engagement
              </CardTitle>
              <CardDescription>
                Social activity and interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialEngagement.map((engagement) => (
                <div key={engagement.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={engagement.avatar} alt={engagement.user} />
                    <AvatarFallback>{engagement.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{engagement.user}</span>
                      {" "}{engagement.action}
                      {engagement.project && (
                        <>
                          {" "}on{" "}
                          <span className="font-medium text-primary">{engagement.project}</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{engagement.timestamp}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Unread notifications</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active projects</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Community interactions</span>
                <Badge variant="secondary">24</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
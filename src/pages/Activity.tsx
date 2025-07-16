import { Header } from "@/components/crm/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, FileText, Upload, Settings } from "lucide-react";

const Activity = () => {
  const activities = [
    {
      id: 1,
      user: "Sarah Chen",
      action: "uploaded new design",
      target: "Organic Tea Collection",
      time: "2 hours ago",
      type: "upload",
      avatar: "SC"
    },
    {
      id: 2,
      user: "Mike Johnson",
      action: "commented on",
      target: "Luxury Perfume Box",
      time: "4 hours ago",
      type: "comment",
      avatar: "MJ"
    },
    {
      id: 3,
      user: "Emma Wilson",
      action: "completed project",
      target: "Electronics Packaging",
      time: "1 day ago",
      type: "completion",
      avatar: "EW"
    },
    {
      id: 4,
      user: "Alex Rodriguez",
      action: "shared design in",
      target: "Community",
      time: "1 day ago",
      type: "share",
      avatar: "AR"
    },
    {
      id: 5,
      user: "Lisa Park",
      action: "updated project settings for",
      target: "Artisan Chocolate Boxes",
      time: "2 days ago",
      type: "settings",
      avatar: "LP"
    },
    {
      id: 6,
      user: "David Kim",
      action: "created new project",
      target: "Sustainable Packaging Initiative",
      time: "2 days ago",
      type: "creation",
      avatar: "DK"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload": return <Upload className="h-4 w-4 text-blue-600" />;
      case "comment": return <MessageCircle className="h-4 w-4 text-green-600" />;
      case "completion": return <FileText className="h-4 w-4 text-purple-600" />;
      case "settings": return <Settings className="h-4 w-4 text-orange-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-6 bg-background overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Activity Feed</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest activities from your team and projects.
            </p>
          </div>

          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback>{activity.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getActivityIcon(activity.type)}
                        <span className="font-medium text-foreground">{activity.user}</span>
                        <span className="text-muted-foreground">{activity.action}</span>
                        <span className="font-medium text-foreground">{activity.target}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Activity Summary */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Today's Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">24</div>
                <p className="text-sm text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">18</div>
                <p className="text-sm text-muted-foreground">Currently online</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Projects Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">8</div>
                <p className="text-sm text-muted-foreground">In the last 24 hours</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Activity;
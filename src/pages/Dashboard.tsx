import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Factory, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Users,
  BarChart3
} from "lucide-react";
import { NewProjectSheet } from "@/components/NewProjectSheet";

const Dashboard = () => {
  const projects = [
    {
      id: 1,
      name: "Artisan Coffee Packaging",
      client: "Bean & Brew Co.",
      status: "Manufacturing",
      progress: 75,
      phase: "Quality Testing",
      dueDate: "Dec 15, 2024",
      team: 4
    },
    {
      id: 2,
      name: "Premium Tea Collection",
      client: "Zen Tea House",
      status: "Shipping",
      progress: 95,
      phase: "In Transit",
      dueDate: "Dec 10, 2024",
      team: 3
    },
    {
      id: 3,
      name: "Energy Drink Labels",
      client: "Power Sports Inc.",
      status: "Design",
      progress: 40,
      phase: "Client Review",
      dueDate: "Dec 20, 2024",
      team: 5
    },
    {
      id: 4,
      name: "Luxury Wine Bottles",
      client: "Vintage Estates",
      status: "Complete",
      progress: 100,
      phase: "Delivered",
      dueDate: "Dec 5, 2024",
      team: 6
    }
  ];

  const stats = [
    {
      title: "Active Projects",
      value: "12",
      change: "+2 from last month",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "In Manufacturing",
      value: "8",
      change: "+3 this week",
      icon: Factory,
      color: "text-orange-600"
    },
    {
      title: "Ready to Ship",
      value: "5",
      change: "2 shipped today",
      icon: Truck,
      color: "text-green-600"
    },
    {
      title: "Completed",
      value: "127",
      change: "+15 this month",
      icon: CheckCircle,
      color: "text-purple-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Design": return "bg-blue-100 text-blue-800";
      case "Manufacturing": return "bg-orange-100 text-orange-800";
      case "Shipping": return "bg-yellow-100 text-yellow-800";
      case "Complete": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Track progress on your packaging design, manufacturing, and shipping
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project Progress */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Project Progress
              </CardTitle>
              <CardDescription>
                Current status of your packaging projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{project.phase}</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {project.dueDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.team} team members
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Updates */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <NewProjectSheet>
                <Button className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </NewProjectSheet>
              <Button variant="outline" className="w-full justify-start">
                <Factory className="h-4 w-4 mr-2" />
                Manufacturing Update
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Truck className="h-4 w-4 mr-2" />
                Track Shipment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Tea Collection Shipped</p>
                  <p className="text-xs text-muted-foreground">Tracking: TC2024001</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-1 bg-orange-100 rounded">
                  <Factory className="h-4 w-4 text-orange-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Coffee Packaging in QA</p>
                  <p className="text-xs text-muted-foreground">Quality testing phase</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 rounded">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Energy Drink Review</p>
                  <p className="text-xs text-muted-foreground">Awaiting client feedback</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
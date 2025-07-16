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
  BarChart3,
  Loader2
} from "lucide-react";
import { NewProjectSheet } from "@/components/NewProjectSheet";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { projects, loading } = useProjects();
  const { user } = useAuth();

  // Calculate real stats from project data
  const getProjectStats = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status !== "completed").length;
    const completedProjects = projects.filter(p => p.status === "completed").length;
    const inManufacturing = projects.filter(p => 
      p.status === "production" || p.status === "testing & refinement"
    ).length;
    const readyToShip = projects.filter(p => 
      p.status === "delivering"
    ).length;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      inManufacturing,
      readyToShip
    };
  };

  const stats = getProjectStats();

  const statsCards = [
    {
      title: "Active Projects",
      value: stats.activeProjects.toString(),
      change: `${stats.totalProjects} total projects`,
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "In Manufacturing",
      value: stats.inManufacturing.toString(),
      change: "Production & testing",
      icon: Factory,
      color: "text-orange-600"
    },
    {
      title: "Ready to Ship",
      value: stats.readyToShip.toString(),
      change: "Awaiting delivery",
      icon: Truck,
      color: "text-green-600"
    },
    {
      title: "Completed",
      value: stats.completedProjects.toString(),
      change: "Successfully delivered",
      icon: CheckCircle,
      color: "text-purple-600"
    }
  ];

  // Calculate progress percentage based on project status
  const getProjectProgress = (status: string) => {
    switch (status) {
      case "project initiation": return 10;
      case "design development": return 30;
      case "prototyping": return 50;
      case "testing & refinement": return 70;
      case "production": return 85;
      case "delivering": return 95;
      case "completed": return 100;
      default: return 0;
    }
  };

  // Map project status to display names
  const getDisplayStatus = (status: string) => {
    switch (status) {
      case "project initiation": return "Initiation";
      case "design development": return "Design";
      case "prototyping": return "Prototyping";
      case "testing & refinement": return "Testing";
      case "production": return "Manufacturing";
      case "delivering": return "Shipping";
      case "completed": return "Complete";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "project initiation": return "bg-blue-100 text-blue-800";
      case "design development": return "bg-purple-100 text-purple-800";
      case "prototyping": return "bg-indigo-100 text-indigo-800";
      case "testing & refinement": return "bg-yellow-100 text-yellow-800";
      case "production": return "bg-orange-100 text-orange-800";
      case "delivering": return "bg-cyan-100 text-cyan-800";
      case "completed": return "bg-green-100 text-green-800";
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
        {statsCards.map((stat, index) => (
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
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading projects...</span>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No projects found. Create your first project to get started!</p>
                </div>
              ) : (
                projects.slice(0, 4).map((project) => (
                  <div key={project.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{user?.user_metadata?.company || project.client}</p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {getDisplayStatus(project.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{project.status}</span>
                        <span className="font-medium">{getProjectProgress(project.status)}%</span>
                      </div>
                      <Progress value={getProjectProgress(project.status)} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.due_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.type}
                      </div>
                    </div>
                  </div>
                ))
              )}
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
              {projects.slice(0, 3).map((project, index) => {
                const icons = [CheckCircle, Factory, Clock];
                const colors = ["green", "orange", "blue"];
                const IconComponent = icons[index % icons.length];
                const color = colors[index % colors.length];
                
                return (
                  <div key={project.id} className="flex items-start gap-3">
                    <div className={`p-1 bg-${color}-100 rounded`}>
                      <IconComponent className={`h-4 w-4 text-${color}-600`} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Status: {getDisplayStatus(project.status)}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {projects.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent updates. Create a project to see activity here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
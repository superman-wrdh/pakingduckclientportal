import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Package, Users, Clock, Star } from "lucide-react";

const Statistics = () => {
  const projectData = [
    { month: "Jan", completed: 8, inProgress: 5 },
    { month: "Feb", completed: 12, inProgress: 7 },
    { month: "Mar", completed: 10, inProgress: 8 },
    { month: "Apr", completed: 15, inProgress: 6 },
    { month: "May", completed: 13, inProgress: 9 },
    { month: "Jun", completed: 18, inProgress: 4 }
  ];

  const clientSatisfactionData = [
    { month: "Jan", satisfaction: 4.2 },
    { month: "Feb", satisfaction: 4.5 },
    { month: "Mar", satisfaction: 4.3 },
    { month: "Apr", satisfaction: 4.7 },
    { month: "May", satisfaction: 4.6 },
    { month: "Jun", satisfaction: 4.8 }
  ];

  const projectTypeData = [
    { name: "Food & Beverage", value: 35, color: "#8884d8" },
    { name: "Cosmetics", value: 25, color: "#82ca9d" },
    { name: "Electronics", value: 20, color: "#ffc658" },
    { name: "Fashion", value: 12, color: "#ff7300" },
    { name: "Other", value: 8, color: "#8dd1e1" }
  ];

  const stats = [
    {
      title: "Total Projects",
      value: "127",
      change: "+12%",
      trend: "up",
      icon: Package
    },
    {
      title: "Active Clients",
      value: "34",
      change: "+8%",
      trend: "up",
      icon: Users
    },
    {
      title: "Avg. Completion Time",
      value: "12 days",
      change: "-15%",
      trend: "down",
      icon: Clock
    },
    {
      title: "Client Satisfaction",
      value: "4.8/5",
      change: "+0.2",
      trend: "up",
      icon: Star
    }
  ];

  return (
    <main className="flex-1 p-6 bg-background overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Statistics & Analytics</h1>
            <p className="text-muted-foreground">
              Track your performance, project metrics, and business insights.
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <IconComponent className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex items-center mt-4">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                      )}
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                      <span className="text-sm text-muted-foreground ml-2">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Project Completion Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Project Completion Trends</CardTitle>
                <CardDescription>Monthly project completion vs in-progress</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#8884d8" name="Completed" />
                    <Bar dataKey="inProgress" fill="#82ca9d" name="In Progress" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Client Satisfaction Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Client Satisfaction</CardTitle>
                <CardDescription>Average satisfaction rating over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={clientSatisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Satisfaction Rating"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Types Distribution */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Project Types</CardTitle>
                <CardDescription>Distribution by industry</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={projectTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {projectTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for the current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue Growth</p>
                      <p className="text-2xl font-bold text-green-600">+23.5%</p>
                      <p className="text-sm text-muted-foreground">vs. last month</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Project Success Rate</p>
                      <p className="text-2xl font-bold text-blue-600">94.2%</p>
                      <p className="text-sm text-muted-foreground">On-time delivery</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Client Retention</p>
                      <p className="text-2xl font-bold text-purple-600">87%</p>
                      <p className="text-sm text-muted-foreground">Repeat customers</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Team Productivity</p>
                      <p className="text-2xl font-bold text-orange-600">112%</p>
                      <p className="text-sm text-muted-foreground">Of target goals</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Quality Score</p>
                      <p className="text-2xl font-bold text-indigo-600">9.1/10</p>
                      <p className="text-sm text-muted-foreground">Design quality rating</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cost Efficiency</p>
                      <p className="text-2xl font-bold text-teal-600">-8%</p>
                      <p className="text-sm text-muted-foreground">Reduced project costs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
  );
};

export default Statistics;
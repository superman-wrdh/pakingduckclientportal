import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Package, 
  Users, 
  MessageSquare, 
  BarChart3, 
  CreditCard,
  Bot,
  User,
  Settings,
  ArrowRight
} from "lucide-react";

const Guide = () => {
  const sections = [
    {
      title: "Getting Started",
      icon: BookOpen,
      items: [
        "Create your account and complete your profile",
        "Set up your company information",
        "Explore the dashboard and familiarize yourself with the interface"
      ]
    },
    {
      title: "Managing Projects",
      icon: Package,
      items: [
        "Create new packaging design projects",
        "Upload design files and specifications",
        "Track manufacturing progress and timelines",
        "Monitor shipping and delivery status"
      ]
    },
    {
      title: "Team Collaboration",
      icon: Users,
      items: [
        "Invite team members to your projects",
        "Assign roles and permissions",
        "Share files and feedback in real-time",
        "Use @mentions to notify specific team members"
      ]
    },
    {
      title: "Communication",
      icon: MessageSquare,
      items: [
        "Use project chat to discuss designs",
        "Share updates and progress reports",
        "Get instant notifications for important changes",
        "Archive conversations for future reference"
      ]
    }
  ];

  const quickTips = [
    "Use the search bar to quickly find projects or team members",
    "Set up notifications to stay updated on project progress",
    "Leverage Duck AI for quick answers and design suggestions",
    "Export reports from the Statistics page for client presentations",
    "Keep your payment information updated for seamless transactions"
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Platform Guide</h1>
        <p className="text-muted-foreground text-lg">
          Learn how to make the most of Peking Duck's packaging design platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Quick Tips
          </CardTitle>
          <CardDescription>
            Pro tips to enhance your workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                <Badge variant="secondary" className="text-xs">
                  {index + 1}
                </Badge>
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Overview</CardTitle>
          <CardDescription>
            Quick reference for all platform features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistics
              </h4>
              <p className="text-sm text-muted-foreground">
                View project analytics, timeline reports, and performance metrics
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment
              </h4>
              <p className="text-sm text-muted-foreground">
                Manage billing, invoices, and subscription details
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </h4>
              <p className="text-sm text-muted-foreground">
                Configure account security, notifications, and preferences
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center p-6 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Need More Help?</h3>
        <p className="text-muted-foreground mb-4">
          Our Duck AI assistant is available 24/7 to answer your questions
        </p>
        <Button>
          <Bot className="h-4 w-4 mr-2" />
          Talk to Duck AI
        </Button>
      </div>
    </div>
  );
};

export default Guide;
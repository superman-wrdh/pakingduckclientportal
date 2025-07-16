import { Header } from "@/components/crm/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, Download, Users } from "lucide-react";

const HowTo = () => {
  const guides = [
    {
      id: 1,
      title: "Getting Started with Peking Duck Platform",
      description: "Learn the basics of navigating our packaging design platform",
      duration: "5 min read",
      difficulty: "Beginner",
      type: "Article",
      icon: BookOpen
    },
    {
      id: 2,
      title: "Creating Your First Packaging Design",
      description: "Step-by-step tutorial for designing custom packaging",
      duration: "15 min",
      difficulty: "Beginner",
      type: "Video",
      icon: Play
    },
    {
      id: 3,
      title: "Managing Projects and Collaborating",
      description: "How to organize projects and work with team members",
      duration: "8 min read",
      difficulty: "Intermediate",
      type: "Article",
      icon: Users
    },
    {
      id: 4,
      title: "Understanding Payment & Billing",
      description: "Complete guide to our pricing and payment system",
      duration: "6 min read",
      difficulty: "Beginner",
      type: "Article",
      icon: BookOpen
    },
    {
      id: 5,
      title: "Advanced Design Techniques",
      description: "Pro tips for creating stunning packaging designs",
      duration: "20 min",
      difficulty: "Advanced",
      type: "Video",
      icon: Play
    },
    {
      id: 6,
      title: "Exporting and Production Guidelines",
      description: "Best practices for preparing designs for production",
      duration: "12 min read",
      difficulty: "Intermediate",
      type: "Article",
      icon: Download
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-6 bg-background overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">How to Use Our Platform</h1>
            <p className="text-muted-foreground">
              Learn everything you need to know about creating amazing packaging designs with Peking Duck. 
              From getting started to advanced techniques, we've got you covered.
            </p>
          </div>

          {/* Quick Start Section */}
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Quick Start Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2 text-lg font-bold">1</div>
                <h3 className="font-medium text-blue-800 mb-1">Create Account</h3>
                <p className="text-sm text-blue-700">Sign up and set up your profile</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2 text-lg font-bold">2</div>
                <h3 className="font-medium text-blue-800 mb-1">Start Project</h3>
                <p className="text-sm text-blue-700">Create your first packaging project</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2 text-lg font-bold">3</div>
                <h3 className="font-medium text-blue-800 mb-1">Design & Export</h3>
                <p className="text-sm text-blue-700">Create designs and export for production</p>
              </div>
            </div>
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {guides.map((guide) => {
              const IconComponent = guide.icon;
              return (
                <Card key={guide.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className="h-6 w-6 text-primary" />
                      <Badge variant="outline" className={getDifficultyColor(guide.difficulty)}>
                        {guide.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{guide.duration}</span>
                      <Badge variant="secondary" className="text-xs">
                        {guide.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-1">What file formats do you support?</h3>
                <p className="text-muted-foreground text-sm">We support PDF, AI, EPS, PNG, and JPEG formats for design uploads and exports.</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">How do I collaborate with team members?</h3>
                <p className="text-muted-foreground text-sm">You can invite team members to projects, share designs, and leave comments for real-time collaboration.</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Can I get my designs printed?</h3>
                <p className="text-muted-foreground text-sm">Yes! We provide production-ready files and can connect you with trusted printing partners.</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Is there a mobile app available?</h3>
                <p className="text-muted-foreground text-sm">Currently, our platform is web-based and optimized for desktop use. Mobile app is coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowTo;
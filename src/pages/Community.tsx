import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Eye } from "lucide-react";

const Community = () => {
  const designs = [
    {
      id: 1,
      title: "Minimalist Coffee Package",
      designer: "Sarah Chen",
      avatar: "SC",
      likes: 234,
      comments: 12,
      views: 1200,
      description: "Clean and modern coffee packaging with sustainable materials",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
      tags: ["Coffee", "Minimalist", "Sustainable"],
      size: "normal"
    },
    {
      id: 2,
      title: "Luxury Cosmetics Line",
      designer: "Alex Rodriguez",
      avatar: "AR",
      likes: 456,
      comments: 28,
      views: 2100,
      description: "Premium cosmetics packaging featuring gold foil accents and elegant typography. The design emphasizes luxury and sophistication.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=600&fit=crop",
      tags: ["Cosmetics", "Luxury", "Gold Foil"],
      size: "large"
    },
    {
      id: 3,
      title: "Organic Food Series",
      designer: "Emma Wilson",
      avatar: "EW",
      likes: 189,
      comments: 8,
      views: 890,
      description: "Natural and organic food packaging",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
      tags: ["Organic", "Food"],
      size: "small"
    },
    {
      id: 4,
      title: "Tech Product Unboxing Experience",
      designer: "David Kim",
      avatar: "DK",
      likes: 789,
      comments: 45,
      views: 3400,
      description: "Innovative tech packaging that creates an unforgettable unboxing experience with interactive elements",
      image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=400&fit=crop",
      tags: ["Tech", "Interactive", "Experience"],
      size: "normal"
    },
    {
      id: 5,
      title: "Artisan Chocolate Collection",
      designer: "Maria Santos",
      avatar: "MS",
      likes: 312,
      comments: 19,
      views: 1650,
      description: "Handcrafted chocolate packaging with artistic illustrations",
      image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=300&h=400&fit=crop",
      tags: ["Chocolate", "Artisan", "Illustration"],
      size: "normal"
    },
    {
      id: 6,
      title: "Sustainable Wine Labels",
      designer: "James Thompson",
      avatar: "JT",
      likes: 567,
      comments: 34,
      views: 2300,
      description: "Eco-friendly wine packaging using recycled paper and natural inks. The design reflects the vineyard's commitment to sustainability.",
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=300&h=500&fit=crop",
      tags: ["Wine", "Sustainable", "Natural"],
      size: "tall"
    },
    {
      id: 7,
      title: "Kids Toy Packaging",
      designer: "Lisa Park",
      avatar: "LP",
      likes: 445,
      comments: 22,
      views: 1800,
      description: "Playful and colorful toy packaging",
      image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=200&fit=crop",
      tags: ["Toys", "Kids", "Colorful"],
      size: "small"
    },
    {
      id: 8,
      title: "Premium Tea Ceremony Set",
      designer: "Yuki Tanaka",
      avatar: "YT",
      likes: 678,
      comments: 41,
      views: 2850,
      description: "Traditional Japanese tea packaging with modern minimalist approach. Each element tells a story of craftsmanship and tradition.",
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=600&fit=crop",
      tags: ["Tea", "Japanese", "Traditional", "Minimalist"],
      size: "large"
    }
  ];


  const getImageClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'aspect-[4/3]';
      case 'tall':
        return 'aspect-[3/4]';
      case 'small':
        return 'aspect-video';
      default:
        return 'aspect-[4/3]';
    }
  };

  return (
    <main className="flex-1 p-6 bg-background overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Design Community</h1>
            <p className="text-muted-foreground">
              Discover inspiring packaging designs from our creative community. Share your work, get feedback, and find inspiration for your next project.
            </p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4" style={{ columnWidth: '280px' }}>
            {designs.map((design) => (
              <Card 
                key={design.id} 
                className="bg-card border hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden group break-inside-avoid mb-4"
              >
                <div className={`bg-muted overflow-hidden ${getImageClasses(design.size)}`}>
                  <img 
                    src={design.image} 
                    alt={design.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2 pt-3">
                  <CardTitle className="text-foreground leading-tight text-sm">
                    {design.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground line-clamp-2 mt-1 text-xs leading-relaxed">
                    {design.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {design.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {design.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-foreground font-medium truncate">{design.designer}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{design.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{design.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{design.views}</span>
                      </div>
                    </div>
                    <Share2 className="h-3 w-3 cursor-pointer hover:text-foreground transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-muted/50 border rounded-lg p-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Share Your Design</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Have a packaging design you're proud of? Share it with the community and get valuable feedback from fellow designers and packaging experts.
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium">
              Upload Design
            </button>
          </div>
        </div>
      </main>
  );
};

export default Community;
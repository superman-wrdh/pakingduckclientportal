import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Star,
  Package,
  Users,
  Award,
  Briefcase,
  Save,
  X
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: "Creative Packaging Solutions",
    industry: "Design & Manufacturing",
    size: "50-100 employees",
    founded: "2015",
    website: "www.creativepkg.com",
    address: "123 Design Street, San Francisco, CA 94105",
    contactPerson: "John Smith",
    phone: "+1 (555) 987-6543",
    email: "info@creativepkg.com",
    description: "A leading packaging design company specializing in sustainable and innovative packaging solutions for food, beverage, and consumer goods industries."
  });

  const userProfile = {
    name: "Sarah Chen",
    title: "Senior Packaging Designer",
    email: "sarah.chen@company.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "March 2023",
    avatar: "/api/placeholder/100/100",
    bio: "Passionate packaging designer with 8+ years of experience creating sustainable and innovative packaging solutions for leading brands."
  };

  const companyProfile = {
    name: "Creative Packaging Solutions",
    industry: "Design & Manufacturing",
    size: "50-100 employees",
    founded: "2015",
    website: "www.creativepkg.com",
    address: "123 Design Street, San Francisco, CA 94105",
    contactPerson: "John Smith",
    phone: "+1 (555) 987-6543",
    email: "info@creativepkg.com",
    description: "A leading packaging design company specializing in sustainable and innovative packaging solutions for food, beverage, and consumer goods industries."
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setEditedProfile({
      name: companyProfile.name,
      industry: companyProfile.industry,
      size: companyProfile.size,
      founded: companyProfile.founded,
      website: companyProfile.website,
      address: companyProfile.address,
      contactPerson: companyProfile.contactPerson,
      phone: companyProfile.phone,
      email: companyProfile.email,
      description: companyProfile.description,
    });
    setIsEditing(false);
  };

  const achievements = [
    { title: "Top Designer 2024", description: "Recognized for outstanding design quality", icon: Award },
    { title: "Eco Champion", description: "Leader in sustainable packaging solutions", icon: Package },
    { title: "Team Player", description: "Exceptional collaboration and mentoring", icon: Users },
    { title: "Client Favorite", description: "Highest client satisfaction ratings", icon: Star }
  ];

  const stats = [
    { label: "Projects Completed", value: "127", icon: Package },
    { label: "Client Rating", value: "4.9/5", icon: Star },
    { label: "Team Projects", value: "45", icon: Users },
    { label: "Awards Won", value: "12", icon: Award }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage company information
          </p>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Company Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Profile
          </CardTitle>
          <CardDescription>
            Information about your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            {isEditing ? (
              <Input 
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                className="text-lg font-semibold"
              />
            ) : (
              <h3 className="text-lg font-semibold">{editedProfile.name}</h3>
            )}
          </div>
          
          {isEditing ? (
            <textarea 
              value={editedProfile.description}
              onChange={(e) => setEditedProfile({...editedProfile, description: e.target.value})}
              className="w-full text-sm text-muted-foreground bg-background border border-input rounded-md px-3 py-2 min-h-[60px] resize-none"
            />
          ) : (
            <p className="text-sm text-muted-foreground">{editedProfile.description}</p>
          )}
          
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input 
                  value={editedProfile.industry}
                  onChange={(e) => setEditedProfile({...editedProfile, industry: e.target.value})}
                  className="text-sm"
                />
              ) : (
                <span className="text-sm">{editedProfile.industry}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input 
                  value={editedProfile.size}
                  onChange={(e) => setEditedProfile({...editedProfile, size: e.target.value})}
                  className="text-sm"
                />
              ) : (
                <span className="text-sm">{editedProfile.size}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input 
                  value={editedProfile.founded}
                  onChange={(e) => setEditedProfile({...editedProfile, founded: e.target.value})}
                  className="text-sm"
                />
              ) : (
                <span className="text-sm">Founded {editedProfile.founded}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input 
                  value={editedProfile.address}
                  onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                  className="text-sm"
                />
              ) : (
                <span className="text-sm">{editedProfile.address}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input 
                  value={editedProfile.contactPerson}
                  onChange={(e) => setEditedProfile({...editedProfile, contactPerson: e.target.value})}
                  className="text-sm"
                />
              ) : (
                <span className="text-sm">{editedProfile.contactPerson}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input 
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                  className="text-sm"
                />
              ) : (
                <span className="text-sm">{editedProfile.phone}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input 
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                  className="text-sm"
                />
              ) : (
                <span className="text-sm">{editedProfile.email}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
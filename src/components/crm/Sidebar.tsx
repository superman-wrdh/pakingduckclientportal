import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users,
  HelpCircle,
  Activity,
  FolderOpen,
  MessageCircle,
  CreditCard,
  Settings,
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  UserPlus
} from "lucide-react";
const logo = "/lovable-uploads/a09bbeec-4835-42c5-ac6b-dee617792106.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Collapsible, 
  CollapsibleTrigger, 
  CollapsibleContent 
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";

const exploreItems = [
  { title: "Community", url: "/community", icon: Users },
  { title: "Guide", url: "/how-to", icon: HelpCircle },
];

// Get real project counts from the database
const getProjectCounts = (projects: any[]) => {
  const inProgress = projects.filter(p => p.status !== "completed").length;
  const completed = projects.filter(p => p.status === "completed").length;
  const total = projects.length;
  
  return { total, inProgress, completed };
};

// Create workspace items with real project counts
const createWorkspaceItems = (projects: any[]) => {
  const counts = getProjectCounts(projects);
  
  return [
    { title: "Notifications", url: "/notifications", icon: Bell },
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { 
      title: "Projects", 
      url: "/projects", 
      icon: FolderOpen,
      subItems: [
        { title: "Overview", url: "/projects", count: counts.total },
        { title: "In Progress", url: "/projects/in-progress", count: counts.inProgress },
        { title: "Completed", url: "/projects/completed", count: counts.completed },
      ]
    },
    { title: "Chat", url: "/chat", icon: MessageCircle },
    { title: "Payment", url: "/payment", icon: CreditCard },
    { title: "Invite", url: "/invite", icon: UserPlus },
  ];
};

const aiAssistantItems = [
  { title: "Duck AI", url: "/duck-ai", icon: MessageCircle },
];

const personalItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface SidebarSectionProps {
  title: string;
  items: Array<{
    title: string;
    url: string;
    icon: React.ComponentType<any>;
    subItems?: Array<{
      title: string;
      url: string;
      count?: number;
    }>;
  }>;
}

function SidebarSection({ title, items }: SidebarSectionProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { state } = useSidebar();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemTitle: string) => {
    setOpenItems(prev => 
      prev.includes(itemTitle) 
        ? prev.filter(item => item !== itemTitle)
        : [...prev, itemTitle]
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.url;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isOpen = openItems.includes(item.title);
            const isSubItemActive = hasSubItems && item.subItems?.some(subItem => currentPath === subItem.url);
            
            if (hasSubItems) {
              return (
                <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleItem(item.title)}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full justify-between">
                        <div className="flex items-center">
                          <Icon className="h-4 w-4" />
                          {state !== "collapsed" && <span className="ml-2">{item.title}</span>}
                        </div>
                        {state !== "collapsed" && (
                          isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems?.map((subItem) => {
                          const isSubActive = currentPath === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.url}>
                              <SidebarMenuSubButton asChild isActive={isSubActive}>
                                <NavLink to={subItem.url} className="flex items-center justify-between">
                                  <span>{subItem.title}</span>
                                  {subItem.count !== undefined && (
                                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                      {subItem.count}
                                    </span>
                                  )}
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }
            
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <NavLink to={item.url}>
                    <Icon className="h-4 w-4" />
                    {state !== "collapsed" && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const { projects } = useProjects();
  
  // Create workspace items with real project counts
  const workspaceItems = createWorkspaceItems(projects);

  return (
    <Sidebar collapsible="icon" className="w-56">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2">
          <img 
            src={logo} 
            alt="Company Logo" 
            className="h-10 w-auto object-contain flex-shrink-0"
          />
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground">Paking Duck</span>
              <span className="text-sm text-muted-foreground">Client Portal</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarSection title="Explore" items={exploreItems} />
        <SidebarSection title="Workspace" items={workspaceItems} />
        <SidebarSection title="AI Assistant" items={aiAssistantItems} />
        <SidebarSection title="Personal" items={personalItems} />
      </SidebarContent>
    </Sidebar>
  );
}
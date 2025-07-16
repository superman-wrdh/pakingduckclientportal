import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, Users, MessageCircle } from "lucide-react";

const Chat = () => {
  const conversations = [
    {
      id: 1,
      name: "Organic Tea Project",
      type: "Project",
      lastMessage: "The new design looks great! Let's proceed with this direction.",
      time: "2h ago",
      unread: 3,
      participants: 4
    },
    {
      id: 2,
      name: "Sarah Chen",
      type: "Direct",
      lastMessage: "Can you review the color variations?",
      time: "4h ago",
      unread: 1,
      participants: 2
    },
    {
      id: 3,
      name: "Design Team",
      type: "Team",
      lastMessage: "Weekly design review meeting tomorrow at 2 PM",
      time: "1d ago",
      unread: 0,
      participants: 8
    },
    {
      id: 4,
      name: "Client Feedback",
      type: "Project",
      lastMessage: "The client has approved the final design!",
      time: "2d ago",
      unread: 0,
      participants: 6
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Chen",
      message: "Hey team! I've uploaded the latest iterations for the tea packaging. What do you think about the color scheme?",
      time: "10:30 AM",
      isOwn: false,
      avatar: "SC"
    },
    {
      id: 2,
      sender: "You",
      message: "Looks fantastic! The green tones really capture the organic feel we're going for.",
      time: "10:35 AM",
      isOwn: true,
      avatar: "ME"
    },
    {
      id: 3,
      sender: "Mike Johnson",
      message: "I agree! Maybe we could make the logo slightly larger for better brand visibility?",
      time: "10:40 AM",
      isOwn: false,
      avatar: "MJ"
    },
    {
      id: 4,
      sender: "Sarah Chen",
      message: "Good point, Mike. I'll adjust the logo size and share the updated version shortly.",
      time: "10:45 AM",
      isOwn: false,
      avatar: "SC"
    }
  ];

  return (
    <main className="flex-1 p-6 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Team Chat</h1>
            <p className="text-muted-foreground">
              Collaborate with your team in real-time on projects and share ideas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-120px)]">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Button size="sm" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="p-4 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-foreground truncate">{conversation.name}</h3>
                        <div className="flex items-center space-x-2">
                          {conversation.unread > 0 && (
                            <Badge variant="destructive" className="text-xs px-2 py-1">
                              {conversation.unread}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {conversation.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {conversation.participants}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card className="lg:col-span-2 flex flex-col">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Organic Tea Project</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Project Chat</Badge>
                    <span className="text-sm text-muted-foreground">4 participants</span>
                  </div>
                </div>
              </CardHeader>
              
              {/* Messages Area */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-xs">{message.avatar}</AvatarFallback>
                        </Avatar>
                        <div className={`rounded-lg p-3 ${message.isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          {!message.isOwn && (
                            <p className="font-medium text-sm mb-1">{message.sender}</p>
                          )}
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1"
                  />
                  <Button size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
  );
};

export default Chat;
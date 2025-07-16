import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Send, 
  User, 
  Lightbulb, 
  Package, 
  Palette, 
  TrendingUp,
  MessageSquare
} from "lucide-react";

const DuckAI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "Hello! I'm Duck AI, your packaging design assistant. I can help you with design ideas, manufacturing questions, trend analysis, and more. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const quickActions = [
    {
      icon: Lightbulb,
      title: "Design Ideas",
      description: "Get creative packaging concepts",
      prompt: "Can you suggest some innovative packaging ideas for eco-friendly products?"
    },
    {
      icon: Package,
      title: "Manufacturing Help",
      description: "Questions about production",
      prompt: "What materials work best for food packaging that needs to be recyclable?"
    },
    {
      icon: Palette,
      title: "Color Psychology",
      description: "Color choices for your brand",
      prompt: "What colors work best for luxury cosmetic packaging?"
    },
    {
      icon: TrendingUp,
      title: "Market Trends",
      description: "Latest packaging trends",
      prompt: "What are the current trends in beverage packaging design?"
    }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputMessage("");
  };

  const getAIResponse = (message: string) => {
    const responses = [
      "That's a great question! For sustainable packaging, I'd recommend exploring biodegradable materials like PLA-based films or molded fiber. These materials break down naturally while maintaining product protection.",
      "Based on current market trends, minimalist designs with bold typography are very popular. Consider using a single accent color against a neutral background to create visual impact.",
      "For food packaging, food-grade materials like PP, PE, or PET are excellent choices. They're recyclable and provide good barrier properties to keep your products fresh.",
      "Luxury packaging often benefits from deep, rich colors like navy blue, forest green, or burgundy. These colors convey premium quality and sophistication.",
      "Current beverage packaging trends include slim cans, sustainable materials, and interactive QR codes that connect consumers to brand stories."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          Duck AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Your intelligent packaging design companion
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleQuickAction(action.prompt)}
          >
            <CardContent className="p-4 text-center">
              <action.icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Chat with Duck AI</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8">
                  {message.type === "ai" ? (
                    <>
                      <AvatarImage src="/lovable-uploads/a09bbeec-4835-42c5-ac6b-dee617792106.png" alt="Duck AI" />
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.type === "ai" && (
                    <Badge variant="secondary" className="mb-2 text-xs">
                      <Bot className="h-3 w-3 mr-1" />
                      Duck AI
                    </Badge>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Duck AI anything about packaging design..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DuckAI;
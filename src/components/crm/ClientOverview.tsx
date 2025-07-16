import { Edit, Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function ClientOverview() {
  return (
    <div className="space-y-6">
      {/* Client Details */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">ING Bank</CardTitle>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm mt-1">
                  ING is a leading European universal bank. They have more than 60,000...
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Client</label>
                <p className="text-sm mt-1 font-medium">Steven van Rijswijk</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Line of Business</label>
                <p className="text-sm mt-1 font-medium">Technology</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Country</label>
                <p className="text-sm mt-1 font-medium">United States</p>
              </div>
            </div>
            
            {/* Financials */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Financials</h3>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Total Budget</label>
                  <p className="text-2xl font-bold">$10,298</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                      <span className="text-sm">Budget left</span>
                    </div>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                      <span className="text-sm">Basic Cost</span>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                      <span className="text-sm">Apps & Services</span>
                    </div>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Badge variant="secondary">Data Migration</Badge>
            <Badge variant="secondary">Display Reporting</Badge>
            <Badge variant="secondary">Technology</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Apps & Services */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Apps & Services (3)</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-chart-1 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">S</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Snowflake</h4>
                    <p className="text-xs text-muted-foreground">Snow Inc.</p>
                    <p className="text-xs text-muted-foreground">The world's leading analytics platform.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Launch
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-destructive rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">D</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Databricks</h4>
                    <p className="text-xs text-muted-foreground">Databricks Inc.</p>
                    <p className="text-xs text-muted-foreground">World's first and only lakehouse platform</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Launch
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-chart-4 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">T</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Tableau</h4>
                    <p className="text-xs text-muted-foreground">Tableau Software LLC.</p>
                    <p className="text-xs text-muted-foreground">The world's leading analytics platform.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Launch
                  </Button>
                </div>
              </div>
            </div>
            
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              + Add new
            </Button>
          </CardContent>
        </Card>

        {/* Users */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Users (9)</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Arlene McCoy", role: "Designer", avatar: "AM" },
                { name: "Cody Fisher", role: "Developer", avatar: "CF" },
                { name: "Robert Fox", role: "UX Designer", avatar: "RF" },
                { name: "Darlene Robertson", role: "Designer", avatar: "DR" },
                { name: "Ticpol Arif", role: "Engineer", avatar: "TA" },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">{user.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
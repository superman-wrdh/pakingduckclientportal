
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Package, Eye, ArrowLeft, Search, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, Truck, Palette, MessageSquare, FileText, Download, Upload, File, Loader2, Edit, Trash2 } from "lucide-react";
import { NewProjectSheet } from "@/components/NewProjectSheet";
import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isConceptsOpen, setIsConceptsOpen] = useState(false);
  const [selectedDesignVersion, setSelectedDesignVersion] = useState<'latest' | 'past'>('latest');
  const [annotations, setAnnotations] = useState<Array<{id: string, x: number, y: number, comment: string}>>([]);
  const [feedback, setFeedback] = useState("");
  const [newAnnotation, setNewAnnotation] = useState<{x: number, y: number} | null>(null);
  const [selectedPastDesign, setSelectedPastDesign] = useState<any>(null);
  
  // Edit and Delete states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  
  const location = useLocation();
  
  
  const currentView = location.pathname === "/projects/in-progress" ? "in-progress" 
                    : location.pathname === "/projects/completed" ? "completed" 
                    : "overview";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "project initiation": return "bg-blue-100 text-blue-800";
      case "design development": return "bg-purple-100 text-purple-800";
      case "prototyping": return "bg-orange-100 text-orange-800";
      case "testing & refinement": return "bg-yellow-100 text-yellow-800";
      case "production": return "bg-indigo-100 text-indigo-800";
      case "delivering": return "bg-cyan-100 text-cyan-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Handle edit project
  const handleEditProject = async () => {
    if (!editingProject) return;
    
    try {
      await updateProject(editingProject.id, {
        name: editForm.name,
        description: editForm.description
      });
      
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      
      setIsEditDialogOpen(false);
      setEditingProject(null);
      setEditForm({ name: "", description: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  // Handle delete project
  const handleDeleteProject = async () => {
    if (!editingProject) return;
    
    try {
      await deleteProject(editingProject.id);
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      setEditingProject(null);
      
      // Close sheet if this project was selected
      if (selectedProject?.id === editingProject.id) {
        setIsSheetOpen(false);
        setSelectedProject(null);
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  // Filter projects based on current view
  const getFilteredProjects = () => {
    let filtered = [];
    switch (currentView) {
      case "in-progress":
        filtered = projects.filter(project => project.status !== "completed");
        break;
      case "completed":
        filtered = projects.filter(project => project.status === "completed");
        break;
      default:
        filtered = projects;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user?.user_metadata?.company || project.client).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(project => project.type === typeFilter);
    }

    return filtered;
  };

  // Get pagination data
  const getPaginatedProjects = () => {
    const filtered = getFilteredProjects();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      projects: filtered.slice(startIndex, endIndex),
      totalProjects: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage)
    };
  };

  // Reset pagination when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Reset pagination when items per page changes
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = (totalPages: number) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  // Get unique project types for filter
  const getProjectTypes = () => {
    const types = [...new Set(projects.map(project => project.type))];
    return types;
  };

  // Get available statuses based on current view
  const getAvailableStatuses = () => {
    switch (currentView) {
      case "in-progress":
        return ["project initiation", "design development", "prototyping", "testing & refinement", "production", "delivering"];
      case "completed":
        return ["completed"];
      default:
        return [...new Set(projects.map(project => project.status))];
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case "in-progress":
        return "In Progress Projects";
      case "completed":
        return "Completed Projects";
      default:
        return "Projects";
    }
  };

  const getPageDescription = () => {
    switch (currentView) {
      case "in-progress":
        return "Track and manage your ongoing packaging design projects.";
      case "completed":
        return "Review your successfully completed projects.";
      default:
        return "Manage your packaging design projects and collaborate with your team.";
    }
  };

  return (
    <main className="flex-1 p-6 bg-background overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{getPageTitle()}</h1>
              <p className="text-muted-foreground">
                {getPageDescription()}
              </p>
            </div>
            <NewProjectSheet />
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects or clients..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); handleFilterChange(); }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); handleFilterChange(); }}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  <SelectItem value="all">All Statuses</SelectItem>
                  {getAvailableStatuses().map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(value) => { setTypeFilter(value); handleFilterChange(); }}>
                <SelectTrigger className="w-[180px]">
                  <Package className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  <SelectItem value="all">All Types</SelectItem>
                  {getProjectTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Statistics - Only show on overview */}
          {currentView === "overview" && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-foreground">{projects.length}</div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-foreground">$24,500</div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-foreground">{projects.filter(p => p.status === "completed").length}</div>
                  <p className="text-sm text-muted-foreground">Completed This Month</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Projects Display */}
          {currentView === "overview" ? (
            <div className="mb-8">
              {/* Projects Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Projects</CardTitle>
                  <CardDescription>
                    Showing {getPaginatedProjects().projects.length} of {getPaginatedProjects().totalProjects} projects
                  </CardDescription>
                </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Loading projects...</span>
                      </div>
                    ) : (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Project Name</TableHead>
                              <TableHead>Client</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getPaginatedProjects().projects.map((project) => (
                            <TableRow key={project.id}>
                               <TableCell className="font-medium">
                                 <button 
                                   onClick={() => {
                                     setSelectedProject(project);
                                     setIsSheetOpen(true);
                                   }}
                                   className="text-primary hover:text-primary/80 hover:underline transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit text-left"
                                 >
                                   {project.name}
                                 </button>
                               </TableCell>
                             <TableCell>{user?.user_metadata?.company || project.client}</TableCell>
                             <TableCell>
                               <div className="flex items-center">
                                 <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                                 {project.type}
                               </div>
                             </TableCell>
                             <TableCell>
                               <Badge className={getStatusColor(project.status)}>
                                 {project.status}
                               </Badge>
                             </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {new Date(project.due_date).toLocaleDateString()}
                                </div>
                              </TableCell>
                               <TableCell className="text-right">
                                 <div className="flex items-center justify-end gap-2">
                                   {/* Actions removed per user request */}
                                 </div>
                               </TableCell>
                           </TableRow>
                         ))}
                       </TableBody>
                     </Table>
                     
                     {/* Enhanced Pagination */}
                     {getPaginatedProjects().totalPages > 1 && (
                       <div className="flex items-center justify-between mt-6">
                         <div className="text-sm text-muted-foreground">
                           {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, getPaginatedProjects().totalProjects)} of {getPaginatedProjects().totalProjects} items
                         </div>
                         <div className="flex items-center gap-2">
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => setCurrentPage(1)}
                             disabled={currentPage === 1}
                           >
                             <ChevronsLeft className="h-4 w-4" />
                           </Button>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                             disabled={currentPage === 1}
                           >
                             <ChevronLeft className="h-4 w-4" />
                           </Button>
                           {getPageNumbers(getPaginatedProjects().totalPages).map((pageNum) => (
                             <Button
                               key={pageNum}
                               variant={currentPage === pageNum ? "default" : "outline"}
                               size="sm"
                               onClick={() => setCurrentPage(pageNum)}
                               className="min-w-[32px]"
                             >
                               {pageNum}
                             </Button>
                           ))}
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => setCurrentPage(prev => Math.min(prev + 1, getPaginatedProjects().totalPages))}
                             disabled={currentPage === getPaginatedProjects().totalPages}
                           >
                             <ChevronRight className="h-4 w-4" />
                           </Button>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => setCurrentPage(getPaginatedProjects().totalPages)}
                             disabled={currentPage === getPaginatedProjects().totalPages}
                           >
                             <ChevronsRight className="h-4 w-4" />
                           </Button>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-sm text-muted-foreground">Items per page</span>
                           <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                             <SelectTrigger className="w-16">
                               <SelectValue />
                             </SelectTrigger>
                             <SelectContent className="bg-background border z-50">
                               <SelectItem value="5">5</SelectItem>
                               <SelectItem value="10">10</SelectItem>
                               <SelectItem value="20">20</SelectItem>
                               <SelectItem value="50">50</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                        </div>
                      )}
                      </>
                    )}
                  </CardContent>
               </Card>
             </div>
          ) : (
            /* Filtered Projects View */
            <div className="mb-8">
              {getPaginatedProjects().projects.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-muted-foreground">
                    Showing {getPaginatedProjects().projects.length} of {getPaginatedProjects().totalProjects} projects
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getPaginatedProjects().projects.map((project) => (
                      <Card key={project.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <CardDescription>{user?.user_metadata?.company || project.client}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Package className="h-4 w-4 mr-2" />
                            {project.type}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {currentView === "completed" ? "Completed: " : "Due: "}
                            {new Date(project.dueDate).toLocaleDateString()}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProject(project);
                              setIsSheetOpen(true);
                            }}
                            className="w-full flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Enhanced Pagination */}
                  {getPaginatedProjects().totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, getPaginatedProjects().totalProjects)} of {getPaginatedProjects().totalProjects} items
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {getPageNumbers(getPaginatedProjects().totalPages).map((pageNum) => (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="min-w-[32px]"
                          >
                            {pageNum}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, getPaginatedProjects().totalPages))}
                          disabled={currentPage === getPaginatedProjects().totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(getPaginatedProjects().totalPages)}
                          disabled={currentPage === getPaginatedProjects().totalPages}
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Items per page</span>
                        <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                          <SelectTrigger className="w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background border z-50">
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Project Details Sheet - Redesigned as 3/4 screen */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-[75vw] sm:max-w-none overflow-y-auto"  side="right">
            <SheetHeader className="space-y-4 pb-6">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-2xl">{selectedProject?.name}</SheetTitle>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>{selectedProject?.client}</span>
                <span>•</span>
                <span>{selectedProject?.type}</span>
              </div>
            </SheetHeader>

            {selectedProject && (
              <div className="space-y-6">
                {/* Project Details Section */}
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Project Type</h4>
                      <div className="flex items-center mb-4">
                        <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{selectedProject.type}</p>
                      </div>
                      
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Status</h4>
                      <Badge className={getStatusColor(selectedProject.status)} style={{ marginBottom: '1rem' }}>
                        {selectedProject.status}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Due Date</h4>
                      <div className="flex items-center mb-4">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{new Date(selectedProject.due_date).toLocaleDateString()}</p>
                      </div>
                      
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Client</h4>
                      <p>{user?.user_metadata?.company || selectedProject.client}</p>
                    </div>
                  </div>
                  
                  {selectedProject.description && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                      <p className="text-muted-foreground leading-relaxed">{selectedProject.description}</p>
                    </div>
                  )}
                </div>

                {/* Design Versions Section */}
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="text-xl font-semibold mb-4">Design Versions</h2>
                  
                  <Tabs defaultValue="latest" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="latest">Latest Version</TabsTrigger>
                      <TabsTrigger value="v2">Version 2</TabsTrigger>
                      <TabsTrigger value="v1">Version 1</TabsTrigger>
                      <TabsTrigger value="contract">Contract</TabsTrigger>
                      <TabsTrigger value="shipment">Shipment</TabsTrigger>
                    </TabsList>

                    {/* Latest Version Tab */}
                    <TabsContent value="latest" className="mt-6">
                      <div className="grid grid-cols-3 gap-6">
                        {/* Design Canvas */}
                        <div className="col-span-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Latest Design v3.2
                              </CardTitle>
                              <CardDescription>Click on the design to add annotations and feedback</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div 
                                className="relative w-full h-96 bg-muted rounded-lg overflow-hidden cursor-crosshair"
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                                  setNewAnnotation({x, y});
                                }}
                              >
                                {/* Placeholder Design Image */}
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                  <div className="text-center text-muted-foreground">
                                    <Palette className="h-16 w-16 mx-auto mb-4" />
                                    <p className="text-lg font-medium">Latest Design Canvas</p>
                                    <p className="text-sm">Click anywhere to add annotations</p>
                                  </div>
                                </div>
                                
                                {/* Existing Annotations */}
                                {annotations.map((annotation) => (
                                  <div
                                    key={annotation.id}
                                    className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-white text-xs font-bold"
                                    style={{ left: `${annotation.x}%`, top: `${annotation.y}%`, transform: 'translate(-50%, -50%)' }}
                                    title={annotation.comment}
                                  >
                                    {annotations.indexOf(annotation) + 1}
                                  </div>
                                ))}
                                
                                {/* New Annotation Input */}
                                {newAnnotation && (
                                  <div
                                    className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10"
                                    style={{ left: `${newAnnotation.x}%`, top: `${newAnnotation.y}%`, transform: 'translate(-50%, -100%)', minWidth: '200px' }}
                                  >
                                    <Input
                                      placeholder="Add your comment..."
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          const comment = e.currentTarget.value;
                                          if (comment.trim()) {
                                            setAnnotations([...annotations, {
                                              id: Date.now().toString(),
                                              x: newAnnotation.x,
                                              y: newAnnotation.y,
                                              comment: comment.trim()
                                            }]);
                                          }
                                          setNewAnnotation(null);
                                        } else if (e.key === 'Escape') {
                                          setNewAnnotation(null);
                                        }
                                      }}
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Press Enter to save, Esc to cancel
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Feedback Panel */}
                        <div className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Annotations</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3 max-h-48 overflow-y-auto">
                                {annotations.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">No annotations yet. Click on the design to add some.</p>
                                ) : (
                                  annotations.map((annotation, index) => (
                                    <div key={annotation.id} className="flex gap-3 p-2 bg-muted/50 rounded-lg">
                                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {index + 1}
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm">{annotation.comment}</p>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Overall Feedback</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <Textarea
                                placeholder="Add your overall feedback about this design..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={4}
                              />
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setFeedback('');
                                    setAnnotations([]);
                                    toast({
                                      title: "Feedback saved",
                                      description: "Your feedback has been saved as draft.",
                                    });
                                  }}
                                >
                                  Save Draft
                                </Button>
                                <Button 
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => {
                                    toast({
                                      title: "Design Approved",
                                      description: "The latest design has been approved successfully.",
                                    });
                                    setFeedback('');
                                    setAnnotations([]);
                                  }}
                                >
                                  Approve Design
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Version 2 Tab */}
                    <TabsContent value="v2" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Design Version 2.1
                          </CardTitle>
                          <CardDescription>Previous version of the design (Read-only)</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                <Palette className="h-16 w-16 mx-auto mb-4" />
                                <p className="text-lg font-medium">Design Version 2</p>
                                <p className="text-sm">Archived design - view only</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-2">Version Notes</h4>
                            <p className="text-sm text-muted-foreground">
                              This version included the client's initial feedback on color scheme and layout adjustments.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Version 1 Tab */}
                    <TabsContent value="v1" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Design Version 1.0
                          </CardTitle>
                          <CardDescription>Initial design concept (Read-only)</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                <Palette className="h-16 w-16 mx-auto mb-4" />
                                <p className="text-lg font-medium">Design Version 1</p>
                                <p className="text-sm">Original concept - view only</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-2">Version Notes</h4>
                            <p className="text-sm text-muted-foreground">
                              The initial design concept based on the client brief and brand guidelines.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Contract Tab */}
                    <TabsContent value="contract" className="mt-6 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Contract Management</CardTitle>
                          <CardDescription>View contract attachments and manage signatures</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {/* Contract Documents */}
                            <div>
                              <h4 className="font-medium mb-3">Contract Documents</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <File className="h-8 w-8 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium">Project Agreement - {selectedProject.name}</p>
                                      <p className="text-sm text-muted-foreground">PDF • 2.4 MB • Updated 3 days ago</p>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>


                    <TabsContent value="shipment" className="mt-6 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Shipment Information</CardTitle>
                          <CardDescription>Track delivery and logistics details</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-3">Shipping Address</h4>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p>{user?.user_metadata?.company || selectedProject.client}</p>
                                <p>123 Business Avenue</p>
                                <p>Suite 100</p>
                                <p>New York, NY 10001</p>
                                <p>United States</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-3">Delivery Details</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Estimated Delivery:</span>
                                  <span className="text-sm font-medium">{new Date(selectedProject.due_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Shipping Method:</span>
                                  <span className="text-sm font-medium">Express Delivery</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Tracking Number:</span>
                                  <span className="text-sm font-medium">PKG{selectedProject.id}2024001</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

         {/* Concepts View Sheet */}
         <Sheet open={isConceptsOpen} onOpenChange={setIsConceptsOpen}>
           <SheetContent className="w-[90vw] sm:max-w-none overflow-y-auto">
             <SheetHeader className="space-y-4 pb-6">
               <div className="flex items-center justify-between">
                 <SheetTitle className="text-2xl">Design Concepts - {selectedProject?.name}</SheetTitle>
                 <Button 
                   variant="ghost" 
                   size="sm"
                   onClick={() => setIsConceptsOpen(false)}
                   className="h-6 w-6 p-0 hover:bg-muted"
                 >
                   <X className="h-4 w-4" />
                 </Button>
               </div>
             </SheetHeader>

             <Tabs value={selectedDesignVersion} onValueChange={(value) => setSelectedDesignVersion(value as 'latest' | 'past')} className="mt-6">
               <TabsList className="grid w-full grid-cols-2">
                 <TabsTrigger value="latest">Latest Design</TabsTrigger>
                 <TabsTrigger value="past">Past Designs</TabsTrigger>
               </TabsList>

               <TabsContent value="latest" className="mt-6">
                 <div className="grid grid-cols-3 gap-6">
                   {/* Design Canvas */}
                   <div className="col-span-2">
                     <Card>
                       <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <Palette className="h-5 w-5" />
                           Latest Design v3.2
                         </CardTitle>
                         <CardDescription>Click on the design to add annotations</CardDescription>
                       </CardHeader>
                       <CardContent>
                         <div 
                           className="relative w-full h-96 bg-muted rounded-lg overflow-hidden cursor-crosshair"
                           onClick={(e) => {
                             const rect = e.currentTarget.getBoundingClientRect();
                             const x = ((e.clientX - rect.left) / rect.width) * 100;
                             const y = ((e.clientY - rect.top) / rect.height) * 100;
                             setNewAnnotation({x, y});
                           }}
                         >
                           {/* Placeholder Design Image */}
                           <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                             <div className="text-center text-muted-foreground">
                               <Palette className="h-16 w-16 mx-auto mb-4" />
                               <p className="text-lg font-medium">Design Canvas</p>
                               <p className="text-sm">Click anywhere to add annotations</p>
                             </div>
                           </div>
                           
                           {/* Existing Annotations */}
                           {annotations.map((annotation) => (
                             <div
                               key={annotation.id}
                               className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-white text-xs font-bold"
                               style={{ left: `${annotation.x}%`, top: `${annotation.y}%`, transform: 'translate(-50%, -50%)' }}
                               title={annotation.comment}
                             >
                               {annotations.indexOf(annotation) + 1}
                             </div>
                           ))}
                           
                           {/* New Annotation Input */}
                           {newAnnotation && (
                             <div
                               className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10"
                               style={{ left: `${newAnnotation.x}%`, top: `${newAnnotation.y}%`, transform: 'translate(-50%, -100%)', minWidth: '200px' }}
                             >
                               <Input
                                 placeholder="Add your comment..."
                                 autoFocus
                                 onKeyDown={(e) => {
                                   if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                     const newId = Date.now().toString();
                                     setAnnotations([...annotations, {
                                       id: newId,
                                       x: newAnnotation.x,
                                       y: newAnnotation.y,
                                       comment: e.currentTarget.value.trim()
                                     }]);
                                     setNewAnnotation(null);
                                   } else if (e.key === 'Escape') {
                                     setNewAnnotation(null);
                                   }
                                 }}
                                 onBlur={() => setNewAnnotation(null)}
                               />
                               <p className="text-xs text-muted-foreground mt-1">Press Enter to save, Esc to cancel</p>
                             </div>
                           )}
                         </div>
                       </CardContent>
                     </Card>
                   </div>

                   {/* Annotations & Feedback Panel */}
                   <div className="space-y-4">
                     {/* Annotations List */}
                     <Card>
                       <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <MessageSquare className="h-5 w-5" />
                           Annotations ({annotations.length})
                         </CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-3">
                         {annotations.length === 0 ? (
                           <p className="text-sm text-muted-foreground text-center py-4">
                             No annotations yet. Click on the design to add one.
                           </p>
                         ) : (
                           annotations.map((annotation, index) => (
                             <div key={annotation.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                               <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                 {index + 1}
                               </div>
                               <div className="flex-1">
                                 <p className="text-sm">{annotation.comment}</p>
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => {
                                     setAnnotations(annotations.filter(a => a.id !== annotation.id));
                                   }}
                                   className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive mt-1"
                                 >
                                   <X className="h-3 w-3" />
                                 </Button>
                               </div>
                             </div>
                           ))
                         )}
                       </CardContent>
                     </Card>

                      {/* Feedback Section */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Overall Feedback
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <textarea
                            className="w-full h-32 p-3 border border-input rounded-md resize-none text-sm"
                            placeholder="Write your overall feedback about this design..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => {
                                console.log("Design approved");
                                setFeedback("");
                              }}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              className="flex-1"
                              onClick={() => {
                                console.log("Design rejected");
                                setFeedback("");
                              }}
                            >
                              Reject
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                   </div>
                 </div>
               </TabsContent>

                <TabsContent value="past" className="mt-6">
                  {!selectedPastDesign ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Past Design Versions */}
                      {[
                        { 
                          version: "v3.1", 
                          date: "Jan 10, 2024", 
                          status: "Reviewed",
                          feedback: "The color scheme needs adjustment. Consider using warmer tones to match the brand identity better.",
                          annotations: [
                            { id: "1", x: 30, y: 40, comment: "Logo size too small" },
                            { id: "2", x: 70, y: 20, comment: "Text alignment issue" }
                          ]
                        },
                        { 
                          version: "v3.0", 
                          date: "Jan 8, 2024", 
                          status: "Approved",
                          feedback: "Excellent work! The design perfectly captures our brand essence.",
                          annotations: []
                        },
                        { 
                          version: "v2.2", 
                          date: "Jan 5, 2024", 
                          status: "Rejected",
                          feedback: "The layout doesn't work well for our target audience. Please reconsider the hierarchy.",
                          annotations: [
                            { id: "1", x: 50, y: 30, comment: "Poor readability" },
                            { id: "2", x: 25, y: 60, comment: "Colors clash" },
                            { id: "3", x: 80, y: 80, comment: "Missing call-to-action" }
                          ]
                        },
                        { 
                          version: "v2.1", 
                          date: "Jan 3, 2024", 
                          status: "Reviewed",
                          feedback: "Good progress but needs refinement in typography and spacing.",
                          annotations: [
                            { id: "1", x: 40, y: 50, comment: "Font too bold" }
                          ]
                        },
                        { 
                          version: "v2.0", 
                          date: "Dec 30, 2023", 
                          status: "Approved",
                          feedback: "This version successfully addresses all previous concerns.",
                          annotations: []
                        },
                        { 
                          version: "v1.0", 
                          date: "Dec 25, 2023", 
                          status: "Initial",
                          feedback: "Initial concept looks promising. Good foundation to build upon.",
                          annotations: [
                            { id: "1", x: 60, y: 40, comment: "Initial feedback point" }
                          ]
                        }
                      ].map((design) => (
                        <Card key={design.version} className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                              <Palette className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">{design.version}</h4>
                                <Badge variant={design.status === 'Approved' ? 'default' : design.status === 'Rejected' ? 'destructive' : 'secondary'}>
                                  {design.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{design.date}</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => setSelectedPastDesign(design)}
                              >
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    /* Past Design Detail View */
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPastDesign(null)}
                          className="flex items-center gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to Past Designs
                        </Button>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">{selectedPastDesign.version}</h3>
                          <Badge variant={selectedPastDesign.status === 'Approved' ? 'default' : selectedPastDesign.status === 'Rejected' ? 'destructive' : 'secondary'}>
                            {selectedPastDesign.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{selectedPastDesign.date}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6">
                        {/* Past Design Canvas */}
                        <div className="col-span-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Design {selectedPastDesign.version}
                              </CardTitle>
                              <CardDescription>Historical design version</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                                {/* Placeholder Past Design Image */}
                                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                  <div className="text-center text-muted-foreground">
                                    <Palette className="h-16 w-16 mx-auto mb-4" />
                                    <p className="text-lg font-medium">Design {selectedPastDesign.version}</p>
                                    <p className="text-sm">{selectedPastDesign.date}</p>
                                  </div>
                                </div>
                                
                                {/* Past Design Annotations */}
                                {selectedPastDesign.annotations.map((annotation: any, index: number) => (
                                  <div
                                    key={annotation.id}
                                    className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-white text-xs font-bold"
                                    style={{ left: `${annotation.x}%`, top: `${annotation.y}%`, transform: 'translate(-50%, -50%)' }}
                                    title={annotation.comment}
                                  >
                                    {index + 1}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Past Design Annotations & Feedback Panel */}
                        <div className="space-y-4">
                          {/* Past Annotations List */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Annotations ({selectedPastDesign.annotations.length})
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {selectedPastDesign.annotations.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                  No annotations for this version.
                                </p>
                              ) : (
                                selectedPastDesign.annotations.map((annotation: any, index: number) => (
                                  <div key={annotation.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm">{annotation.comment}</p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </CardContent>
                          </Card>

                          {/* Past Design Feedback */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Feedback
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                {selectedPastDesign.feedback}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
             </Tabs>
           </SheetContent>
          </Sheet>

          {/* Edit Project Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogDescription>
                  Make changes to your project here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Project Name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Enter project description"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditProject}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Project</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{editingProject?.name}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteProject}>
                  Delete Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
       </main>
     );
   };

export default Projects;

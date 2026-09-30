"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Search,
  Printer,
  Monitor,
  Scissors,
  Globe,
  Package,
  Layers,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AdminEmptyState,
  AdminPageContainer,
  AdminPageHeader,
  AdminSectionCard,
  AdminToolbar,
} from "@/components/admin/admin-page"
import { AdminConfirmDialog } from "@/components/admin/admin-confirm"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  parentId?: string
  children?: ProductCategory[]
  productCount?: number
  isActive: boolean
  sortOrder: number
}

const iconOptions = [
  { value: "Printer", label: "Printer", icon: Printer },
  { value: "Monitor", label: "Monitor", icon: Monitor },
  { value: "Scissors", label: "Scissors", icon: Scissors },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Package", label: "Package", icon: Package },
  { value: "Layers", label: "Layers", icon: Layers },
]

export default function CategoriesAdminPage() {
  const { data: session, status } = useSession()
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    parentId: "",
    sortOrder: 0,
    isActive: true
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products/categories?includeCounts=true')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Auto-generate slug from name if not provided
      const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      
      const url = '/api/products/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      // Clean up form data - convert empty strings to null/undefined for optional fields
      const cleanedFormData = {
        ...formData,
        slug,
        description: formData.description || undefined,
        icon: formData.icon || undefined,
        parentId: formData.parentId || undefined,
      }
      const body = editingCategory 
        ? { ...cleanedFormData, id: editingCategory.id }
        : cleanedFormData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: editingCategory 
            ? "Category updated successfully" 
            : "Category created successfully"
        })
        setIsDialogOpen(false)
        setEditingCategory(null)
        resetForm()
        fetchCategories()
      } else {
        throw new Error(data.error || "Failed to save category")
      }
    } catch (error) {
      console.error('Error saving category:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save category",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/products/categories?id=${categoryId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully"
        })
        fetchCategories()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      })
    } finally {
      setDeleteId(null)
    }
  }

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || "",
      parentId: category.parentId || "",
      sortOrder: category.sortOrder,
      isActive: category.isActive
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      parentId: "",
      sortOrder: 0,
      isActive: true
    })
  }

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const renderCategoryIcon = (iconName?: string) => {
    if (!iconName) return <Package className="h-4 w-4" />
    const iconOption = iconOptions.find(opt => opt.value === iconName)
    if (!iconOption) return <Package className="h-4 w-4" />
    const IconComponent = iconOption.icon
    return <IconComponent className="h-4 w-4" />
  }

  const renderCategory = (category: ProductCategory, level: number = 0) => {
    const isExpanded = expandedCategories.has(category.id)
    const hasChildren = category.children && category.children.length > 0

    return (
      <div key={category.id} className="space-y-2">
        <div className="flex items-center justify-between rounded-lg border border-border/80 bg-card p-3 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <div style={{ paddingLeft: `${level * 20}px` }} className="flex items-center gap-2">
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleCategory(category.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              )}
              {renderCategoryIcon(category.icon)}
              <div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.slug}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={category.isActive ? "default" : "secondary"}>
              {category.isActive ? "Active" : "Inactive"}
            </Badge>
            {category.productCount !== undefined && (
              <Badge variant="outline">
                {category.productCount} products
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteId(category.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4 space-y-2">
            {category.children!.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (status === "loading" || loading) {
    return (
      <AdminPageContainer>
        <Skeleton className="h-24 w-full max-w-2xl rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </AdminPageContainer>
    )
  }

  if (!session || session.user.role !== "ADMIN") {
    return null
  }

  // Flatten categories for parent selection (exclude the category being edited and its children)
  const getAvailableParents = () => {
    // Helper to flatten all categories including children
    const flattenCategories = (cats: ProductCategory[]): ProductCategory[] => {
      const result: ProductCategory[] = []
      cats.forEach(cat => {
        result.push(cat)
        if (cat.children && cat.children.length > 0) {
          result.push(...flattenCategories(cat.children))
        }
      })
      return result
    }
    
    const allCategories = flattenCategories(categories)
    
    if (!editingCategory) {
      // When creating new, only show root categories as parents
      return allCategories.filter(c => !c.parentId)
    }
    
    // Exclude the category being edited and all its descendants
    const excludeIds = new Set([editingCategory.id])
    const collectDescendants = (cat: ProductCategory) => {
      if (cat.children) {
        cat.children.forEach(child => {
          excludeIds.add(child.id)
          collectDescendants(child)
        })
      }
    }
    collectDescendants(editingCategory)
    
    // Return all categories except the one being edited and its descendants
    return allCategories.filter(c => !excludeIds.has(c.id))
  }

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return categories
    const filterTree = (cats: ProductCategory[]): ProductCategory[] =>
      cats.reduce<ProductCategory[]>((acc, cat) => {
        const selfMatch = cat.name.toLowerCase().includes(q) || cat.slug.toLowerCase().includes(q)
        const kids = cat.children?.length ? filterTree(cat.children) : []
        if (selfMatch) {
          acc.push({ ...cat, children: cat.children })
        } else if (kids.length) {
          acc.push({ ...cat, children: kids })
        }
        return acc
      }, [])
    return filterTree(categories)
  }, [categories, searchQuery])

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Product categories"
        description="Manage taxonomy for marketplace listings — hierarchy, icons, and visibility."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Platform data" },
          { label: "Categories" },
        ]}
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingCategory(null)
                  resetForm()
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    // Auto-generate slug if not editing or if slug is empty
                    if (!editingCategory || !formData.slug) {
                      const autoSlug = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                      setFormData(prev => ({ ...prev, slug: autoSlug }))
                    }
                  }}
                  placeholder="Category name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                  placeholder="category-slug"
                  required
                />
                <p className="text-xs text-muted-foreground">URL-friendly identifier (auto-generated from name)</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={formData.icon || "none"}
                  onValueChange={(value) => setFormData({ ...formData, icon: value === "none" ? "" : value })}
                >
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="Select an icon (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No icon</SelectItem>
                    {iconOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parentId">Parent Category</Label>
                <Select
                  value={formData.parentId || "none"}
                  onValueChange={(value) => setFormData({ ...formData, parentId: value === "none" ? "" : value })}
                >
                  <SelectTrigger id="parentId">
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent (Root category)</SelectItem>
                    {getAvailableParents().map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Select "No parent" to create a root category</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                  Active (visible to users)
                </Label>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingCategory ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    editingCategory ? "Update Category" : "Create Category"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingCategory(null)
                    resetForm()
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
            </DialogContent>
          </Dialog>
        }
      />

      <AdminToolbar>
        <div className="relative min-w-0 flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by name or slug…"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Showing {filteredCategories.length} root{filteredCategories.length === 1 ? "" : "s"} (filtered tree)
        </p>
      </AdminToolbar>

      <AdminSectionCard
        title="Category tree"
        description="Expand rows to manage subcategories. Active categories appear in marketplace navigation and filters."
      >
        <div className="p-4">
          {categories.length === 0 ? (
            <AdminEmptyState
              title="No categories yet"
              description="Create a root category to start building your product taxonomy."
            />
          ) : filteredCategories.length === 0 ? (
            <AdminEmptyState title="No matches" description="Try a different search term." />
          ) : (
            <div className="space-y-2">{filteredCategories.map((category) => renderCategory(category))}</div>
          )}
        </div>
      </AdminSectionCard>

      <AdminConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete category?"
        description="This removes the category from the taxonomy. Products may lose this classification — confirm before continuing."
        confirmLabel="Delete category"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={async () => {
          if (!deleteId) return
          await handleDelete(deleteId)
        }}
      />
    </AdminPageContainer>
  )
}

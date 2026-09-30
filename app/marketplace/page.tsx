"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"
import { CheckCircle, Filter, MapPin, Printer, Store, Shield, BadgeCheck, Search as SearchIcon, X, Building2, SlidersHorizontal } from "lucide-react"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/marketplace/product-card"
import { ProductCategoryFilter, ProductCategoryChips } from "@/components/marketplace/product-category-filter"
import { VendorCard } from "@/components/marketplace/vendor-card"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

function MarketplaceContent() {
  const searchParams = useSearchParams()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
  const [activeTab, setActiveTab] = useState<"products" | "companies">(() => {
    const tabParam = searchParams.get("activeTab")
    return (tabParam === "products" || tabParam === "companies") ? tabParam : "products"
  })

  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [vendors, setVendors] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterLoading, setFilterLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  
  // Additional filter states
  const [marketTypes, setMarketTypes] = useState<string[]>(["local", "international"])
  const [showVerifiedOnly, setShowVerifiedOnly] = useState<boolean>(false)
  const [condition, setCondition] = useState<"NEW" | "USED" | "ALL">("ALL")
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>()
  
  // Search states
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [vendorSearchResults, setVendorSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [searchTab, setSearchTab] = useState<"products" | "companies">("products")
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pagination, setPagination] = useState<any>(null)
  const itemsPerPage = 24

  // Fetch products with filters and pagination
  const fetchProducts = async (page: number = 1) => {
    setFilterLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategoryId) params.append('categoryId', selectedCategoryId)
      if (condition && condition !== 'ALL') params.append('condition', condition)
      if (selectedBrand) params.append('brand', selectedBrand)
      params.append('page', page.toString())
      params.append('limit', itemsPerPage.toString())

      const productsResponse = await fetch(`/api/products?${params.toString()}`)
      const productsData = await productsResponse.json()
      if (productsData.success) {
        setProducts(productsData.data)
        setPagination(productsData.pagination)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setFilterLoading(false)
      setPageLoading(false)
    }
  }

  // Fetch brands for selected category (or all brands if no category selected)
  const fetchBrands = async () => {
    try {
      const url = selectedCategoryId 
        ? `/api/products/brands?categoryId=${selectedCategoryId}`
        : `/api/products/brands`
      const brandsResponse = await fetch(url)
      const brandsData = await brandsResponse.json()
      if (brandsData.success) {
        setBrands(brandsData.data)
      } else {
        setBrands([])
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
      setBrands([])
    }
  }

  // Fetch categories, products, and vendors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/products/categories?includeCounts=true')
        const categoriesData = await categoriesResponse.json()
        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }

        // Fetch products
        await fetchProducts(1)

        // Fetch vendors
        const vendorsResponse = await fetch('/api/vendors')
        const vendorsData = await vendorsResponse.json()
        if (vendorsData.success) {
          setVendors(vendorsData.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Refetch products when filters change
  useEffect(() => {
    if (!loading) {
      setCurrentPage(1)
      fetchProducts(1)
    }
  }, [selectedCategoryId, condition, selectedBrand])

  // Fetch brands when category changes or on initial load
  useEffect(() => {
    fetchBrands()
    if (selectedCategoryId) {
      setSelectedBrand(undefined) // Reset brand when category changes
    }
  }, [selectedCategoryId])

  // Also fetch all brands on initial load if no category is selected
  useEffect(() => {
    if (!loading && !selectedCategoryId) {
      fetchBrands()
      }
  }, [loading])

  // Search products and vendors function
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setVendorSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const searchTerm = query.trim()
      
      // Search products
      const productParams = new URLSearchParams()
      productParams.append('search', searchTerm)
      productParams.append('limit', '20')
      const productResponse = await fetch(`/api/products?${productParams.toString()}`)
      const productData = await productResponse.json()
      if (productData.success) {
        setSearchResults(productData.data)
      } else {
        setSearchResults([])
      }

      // Search vendors
      const vendorParams = new URLSearchParams()
      vendorParams.append('search', searchTerm)
      const vendorResponse = await fetch(`/api/vendors?${vendorParams.toString()}`)
      const vendorData = await vendorResponse.json()
      if (vendorData.success) {
        setVendorSearchResults(vendorData.data)
      } else {
        setVendorSearchResults([])
      }
    } catch (error) {
      console.error('Error searching:', error)
      setSearchResults([])
      setVendorSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search input change with debounce
  useEffect(() => {
    if (!isSearchOpen) return

    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchProducts(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery, isSearchOpen])

  // Helper function to get all category IDs including subcategories
  const getCategoryAndSubcategoryIds = (categoryId: string): string[] => {
    const category = categories.find(cat => cat.id === categoryId)
    if (!category) return [categoryId]
    
    const allIds = [categoryId]
    if (category.children) {
      category.children.forEach((child: any) => {
        allIds.push(child.id)
      })
    }
    return allIds
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setPageLoading(true)
    fetchProducts(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Products are already filtered by the API, so we use them directly
  const filteredProducts = products

  // Pagination helpers
  const totalPages = pagination?.totalPages || 1
  // Use pagination.total if available and > 0, otherwise use filteredProducts.length
  const totalProducts = (pagination?.total && pagination.total > 0) 
    ? pagination.total 
    : filteredProducts.length

  // Helper function to map product categories to vendor roles
  const getVendorRolesForCategory = (categoryId: string): string[] => {
    const category = categories.find(cat => cat.id === categoryId)
    if (!category) return []
    
    // Map product categories to relevant vendor roles
    const categoryToRolesMap: Record<string, string[]> = {
      // Press Equipment
      'Press': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'COMMERCIAL_PRINTER'],
      'Offset Press': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'COMMERCIAL_PRINTER'],
      'Digital Press': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'DIGITAL_PRINTER'],
      'Screen Press': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'SCREEN_PRINTER'],
      'UV Printers': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'LARGE_FORMAT_PRINTER'],
      
      // Pre press
      'Pre Press': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'GRAPHIC_DESIGNER', 'SOFTWARE_DEVELOPER'],
      'CTP Systems': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER'],
      'Proofing Systems': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER'],
      'Pre-press Software': ['SOFTWARE_DEVELOPER', 'GRAPHIC_DESIGNER'],
      
      // Post press
      'Post Press': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'COMMERCIAL_PRINTER'],
      'Cutting Equipment': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER'],
      'Folding Equipment': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER'],
      'Binding Equipment': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER'],
      
      // Digital printing
      'Digital Printing': ['DIGITAL_PRINTER', 'EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER'],
      'Inkjet Printers': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'LARGE_FORMAT_PRINTER'],
      'Laser Printers': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'DIGITAL_PRINTER'],
      
      // Web printing
      'Web Printing': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'COMMERCIAL_PRINTER'],
      'Web Offset': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'COMMERCIAL_PRINTER'],
      'Web Digital': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'DIGITAL_PRINTER'],
      
      // Flexo printing
      'Flexo Printing': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'PACKAGING_PRINTER'],
      'Flexo Presses': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'PACKAGING_PRINTER'],
      'Flexo Plates': ['CONSUMABLES_MANUFACTURER', 'EQUIPMENT_DEALER'],
      
      // Software
      'Software': ['SOFTWARE_DEVELOPER', 'PRINT_CONSULTANT'],
      'Design Software': ['GRAPHIC_DESIGNER', 'SOFTWARE_DEVELOPER'],
      'RIP Software': ['SOFTWARE_DEVELOPER'],
      'Workflow Software': ['SOFTWARE_DEVELOPER', 'PRINT_CONSULTANT'],
      
      // Consumables
      'Consumables': ['CONSUMABLES_MANUFACTURER', 'EQUIPMENT_DEALER'],
      'Inks': ['CONSUMABLES_MANUFACTURER', 'EQUIPMENT_DEALER'],
      'Papers': ['CONSUMABLES_MANUFACTURER', 'EQUIPMENT_DEALER'],
      'Plates': ['CONSUMABLES_MANUFACTURER', 'EQUIPMENT_DEALER'],
      'Chemicals': ['CONSUMABLES_MANUFACTURER', 'EQUIPMENT_DEALER'],
      
      // Others
      'Others': ['EQUIPMENT_MANUFACTURER', 'EQUIPMENT_DEALER', 'PRINT_CONSULTANT', 'TRAINING_PROVIDER'],
      'Spare Parts': ['EQUIPMENT_DEALER'],
      'Accessories': ['EQUIPMENT_DEALER'],
      'Services': ['PRINT_CONSULTANT', 'TRAINING_PROVIDER']
    }
    
    // Get the category name and find matching roles
    const categoryName = category.name
    const matchingRoles = categoryToRolesMap[categoryName] || []
    
    // Also check child categories
    if (category.children) {
      category.children.forEach((child: any) => {
        const childRoles = categoryToRolesMap[child.name] || []
        matchingRoles.push(...childRoles)
      })
    }
    
    return [...new Set(matchingRoles)] // Remove duplicates
  }

  const hasActiveFilters =
    selectedCategoryId ||
    condition !== "ALL" ||
    selectedBrand ||
    showVerifiedOnly ||
    marketTypes.length < 2

  const resetFilters = () => {
    setSelectedCategoryId(undefined)
    setCondition("ALL")
    setSelectedBrand(undefined)
    setShowVerifiedOnly(false)
    setMarketTypes(["local", "international"])
    setFilterLoading(true)
    setCurrentPage(1)
    setTimeout(() => {
      fetchProducts(1)
      setFilterLoading(false)
    }, 200)
    setFiltersOpen(false)
  }

  const filteredVendors = vendors.filter((vendor) => {
    // Category filter - filter by vendor role based on selected product category
    if (selectedCategoryId) {
      const allowedRoles = getVendorRolesForCategory(selectedCategoryId)
      if (allowedRoles.length > 0 && !allowedRoles.includes(vendor.role || '')) {
      return false
      }
    }

    // Market type filter
    if (marketTypes.length > 0) {
      const vendorLocation = vendor.location?.toLowerCase() || ''
      const vendorCountry = vendor.country?.toLowerCase() || ''
      
      const isLocal = vendorLocation.includes('nigeria') || vendorCountry.includes('nigeria')
      const isInternational = !isLocal && (vendorLocation || vendorCountry) // Has location but not Nigeria
      
      // Check if the vendor matches any of the selected market types
      const matchesLocal = marketTypes.includes('local') && isLocal
      const matchesInternational = marketTypes.includes('international') && isInternational
      
      if (!matchesLocal && !matchesInternational) {
        return false
      }
    }

    // Verification filter
    if (showVerifiedOnly && !vendor.isVerified) {
      return false
    }

    return true
  })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        {/* Premium discovery header with themed background */}
        <section className="w-full py-8 md:py-10 border-b relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/platform-images/Print%20shop%20with%20wide%20format.jpeg"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-foreground/70" aria-hidden />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white drop-shadow-sm">
                  Printing Industry Marketplace
                </h1>
                <p className="mt-1.5 text-sm text-white/90 max-w-2xl">
                  Discover products, machines, consumables, and trusted companies across the Local Market and International Market.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1 font-normal bg-white/20 text-white border-0 hover:bg-white/30">
                  Local Market
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1 font-normal bg-white/20 text-white border-0 hover:bg-white/30">
                  International Market
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1 font-normal bg-white/20 text-white border-0 hover:bg-white/30">
                  Verified Companies
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1 font-normal bg-white/20 text-white border-0 hover:bg-white/30">
                  New & Used Machines
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" className="bg-white text-foreground hover:bg-white/90">
                  <Link href="/marketplace/my-products/new">
                    Advertise a Listing
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="border-white/50 text-white hover:bg-white/10 hover:text-white">
                  <Link
                    href="#companies-section"
                    onClick={() => {
                      setActiveTab("companies")
                      setTimeout(() => document.getElementById("companies-section")?.scrollIntoView({ behavior: "smooth" }), 50)
                    }}
                  >
                    Browse Companies
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / industry strip */}
        <section className="w-full border-b border-blue-700/30 bg-primary" aria-label="Platform identity">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm font-medium text-white">
                Trusted printing industry marketplace — explore machines, consumables, services, and companies.
              </p>
              <div className="relative h-12 w-full sm:w-48 shrink-0 rounded-lg overflow-hidden bg-white/20">
                <Image
                  src="/platform-images/04_Gallus_One_r_16_9_res_960x540.jpg"
                  alt=""
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
                <div className="absolute inset-0 bg-muted/40" aria-hidden />
              </div>
            </div>
          </div>
        </section>

        {/* Sticky discovery bar: search + Products/Companies + Verified toggle */}
        <div className="sticky top-16 z-30 bg-background border-b shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="relative flex-1 min-w-0">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products and companies..."
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value
                    setSearchQuery(value)
                    if (value.trim()) setIsSearchOpen(true)
                    else setIsSearchOpen(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsSearchOpen(false)
                      setSearchQuery("")
                    }
                  }}
                  className="pl-9 pr-9 h-10 text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("")
                      setSearchResults([])
                      setVendorSearchResults([])
                      setIsSearchOpen(false)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => {
                    setFilterLoading(true)
                    setActiveTab(v as "products" | "companies")
                    setTimeout(() => setFilterLoading(false), 300)
                  }}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid grid-cols-2 h-10">
                    <TabsTrigger value="products" className="text-sm">
                      Products
                    </TabsTrigger>
                    <TabsTrigger value="companies" className="text-sm">
                      Companies
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap text-sm text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={showVerifiedOnly}
                    onChange={() => {
                      setFilterLoading(true)
                      setShowVerifiedOnly((prev) => !prev)
                      setTimeout(() => setFilterLoading(false), 300)
                    }}
                    className="rounded border-input"
                  />
                  <Shield className="h-4 w-4" />
                  <span className="hidden xs:inline">Verified only</span>
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setFiltersOpen(true)}
                  aria-label="Open filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Drawer */}
        <Drawer open={isSearchOpen} onOpenChange={setIsSearchOpen} dismissible={true}>
          <DrawerContent className="max-h-[85vh] h-auto">
            <DrawerHeader className="border-b pb-4">
              <DrawerTitle className="text-xl">Search Results</DrawerTitle>
              <DrawerDescription className="text-sm">
                {isSearching 
                  ? `Searching for "${searchQuery}"...` 
                  : searchQuery.trim() 
                    ? searchTab === "products"
                      ? `${searchResults.length} product${searchResults.length !== 1 ? 's' : ''} found for "${searchQuery}"`
                      : `${vendorSearchResults.length} compan${vendorSearchResults.length !== 1 ? 'ies' : 'y'} found for "${searchQuery}"`
                    : "Start typing to search for products and companies"
                }
              </DrawerDescription>
            </DrawerHeader>
            {searchQuery.trim() && (
              <div className="border-b px-6">
                <Tabs value={searchTab} onValueChange={(value) => setSearchTab(value as "products" | "companies")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="products">
                      Products ({searchResults.length})
                    </TabsTrigger>
                    <TabsTrigger value="companies">
                      Companies ({vendorSearchResults.length})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
            <div className="overflow-y-auto flex-1 p-6">
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Searching...</p>
                  </div>
                </div>
              ) : searchTab === "products" ? (
                searchResults.length === 0 && searchQuery.trim() ? (
                  <div className="text-center py-12">
                    <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/marketplace/product/${product.id}`}
                        onClick={() => {
                          setIsSearchOpen(false)
                          setSearchQuery("")
                        }}
                      >
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                          <div className="relative aspect-square">
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.title}
                              fill
                              className="object-cover rounded-t-lg"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            />
                          </div>
                          <CardContent className="p-2">
                            <h3 className="font-medium text-xs mb-1 line-clamp-2 leading-tight">{product.title}</h3>
                            <div className="flex items-center gap-1 flex-wrap mt-1">
                              <Badge variant="outline" className="text-[10px] px-1 py-0">
                                {product.category?.name || "Uncategorized"}
                              </Badge>
                              {product.condition && (
                                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                                  {product.condition}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Start typing to search for products</p>
                  </div>
                )
              ) : (
                vendorSearchResults.length === 0 && searchQuery.trim() ? (
                  <div className="text-center py-12">
                    <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No companies found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms</p>
                  </div>
                ) : vendorSearchResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {vendorSearchResults.map((vendor) => (
                      <Link
                        key={vendor.id}
                        href={`/marketplace/vendor/${vendor.id}`}
                        onClick={() => {
                          setIsSearchOpen(false)
                          setSearchQuery("")
                        }}
                      >
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                          <div className="relative aspect-square">
                            <Avatar className="w-full h-full rounded-t-lg rounded-b-none">
                              <AvatarImage src={vendor.image || "/placeholder-user.jpg"} alt={vendor.name} className="object-cover" />
                              <AvatarFallback className="rounded-t-lg rounded-b-none">
                                {vendor.name?.charAt(0) || vendor.companyName?.charAt(0) || "V"}
                              </AvatarFallback>
                            </Avatar>
                            {(vendor.verified || vendor.isVerified) && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-green-500 text-white text-[8px] px-1 py-0">
                                  <CheckCircle className="h-2 w-2 mr-1" />
                                  Verified
                                </Badge>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-2">
                            <h3 className="font-medium text-xs mb-1 line-clamp-2 leading-tight">{vendor.name || vendor.companyName}</h3>
                            <div className="flex items-center gap-1 flex-wrap mt-1">
                              <Badge variant="outline" className="text-[10px] px-1 py-0">
                                {vendor.location || "Location"}
                              </Badge>
                              {vendor.productCount > 0 && (
                                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                                  {vendor.productCount} products
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Start typing to search for companies</p>
                  </div>
                )
              )}
            </div>
          </DrawerContent>
        </Drawer>

        <div className="container py-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Category Filter Sidebar - hidden on mobile; use Sheet via Filters button */}
            <div className="hidden lg:block lg:w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {loading ? (
                  <div className="rounded-xl border bg-card text-card-foreground shadow w-full">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <div className="h-6 w-32 bg-muted animate-pulse rounded-md"></div>
                      <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
                    </div>
                    <div className="p-6 pt-0 space-y-2">
                      <div className="h-4 w-full bg-muted animate-pulse rounded-md"></div>
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md"></div>
                      <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Market Type Filter */}
                    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                      <div className="flex flex-col space-y-1.5 p-4">
                        <h3 className="text-sm font-semibold leading-none tracking-tight">Market Type</h3>
                        <p className="text-xs text-muted-foreground">Local and international</p>
                      </div>
                      <div className="px-4 pb-4 space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium sr-only">Market Type</label>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                checked={marketTypes.includes("local")}
                                onChange={async (e) => {
                                  setFilterLoading(true)
                                  if (e.target.checked) {
                                    setMarketTypes([...marketTypes, "local"])
                                  } else {
                                    setMarketTypes(marketTypes.filter(type => type !== "local"))
                                  }
                                  // Add a small delay to show loading state
                                  setTimeout(() => setFilterLoading(false), 300)
                                }}
                              />
                              <span className="text-sm">Local Market</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                checked={marketTypes.includes("international")}
                                onChange={async (e) => {
                                  setFilterLoading(true)
                                  if (e.target.checked) {
                                    setMarketTypes([...marketTypes, "international"])
                                  } else {
                                    setMarketTypes(marketTypes.filter(type => type !== "international"))
                                  }
                                  // Add a small delay to show loading state
                                  setTimeout(() => setFilterLoading(false), 300)
                                }}
                              />
                              <span className="text-sm">International Market</span>
                            </label>
                          </div>
                        </div>
                        

                      </div>
                    </div>

                    {/* Verification Filter */}
                    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                      <div className="flex flex-col space-y-1.5 p-4">
                        <h3 className="text-sm font-semibold leading-none tracking-tight flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          Verification
                        </h3>
                        <p className="text-xs text-muted-foreground">Verified companies only</p>
                      </div>
                      <div className="px-4 pb-4">
                        <label className="flex items-center justify-between cursor-pointer group p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="relative inline-block w-11 h-6">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={showVerifiedOnly}
                              onChange={async (e) => {
                                setFilterLoading(true)
                                setShowVerifiedOnly(e.target.checked)
                                setTimeout(() => setFilterLoading(false), 300)
                              }}
                            />
                              <div className={`relative w-11 h-6 rounded-full transition-all duration-300 ease-in-out ${
                                showVerifiedOnly ? 'bg-primary' : 'bg-gray-300'
                            }`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${
                                  showVerifiedOnly ? 'translate-x-5' : 'translate-x-0'
                              }`}></div>
                            </div>
                          </div>
                          <div className="flex-1">
                              <span className="text-sm font-medium text-foreground block">Verified only</span>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {showVerifiedOnly ? "Verified companies only" : "All companies"}
                            </p>
                          </div>
                          </div>
                          {showVerifiedOnly && (
                            <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Condition Filter - New/Used */}
                    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                      <div className="flex flex-col space-y-1.5 p-4">
                        <h3 className="text-sm font-semibold leading-none tracking-tight">Machine Condition</h3>
                        <p className="text-xs text-muted-foreground">New and used machines</p>
                      </div>
                      <div className="px-4 pb-4">
                        <Tabs value={condition} onValueChange={(value) => setCondition(value as "NEW" | "USED" | "ALL")}>
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="ALL" className="text-xs">All</TabsTrigger>
                            <TabsTrigger value="NEW" className="text-xs">New Machines</TabsTrigger>
                            <TabsTrigger value="USED" className="text-xs">Used Machines</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </div>

                    <ProductCategoryFilter
                      categories={categories}
                      selectedCategory={selectedCategoryId}
                      onCategorySelect={(categoryId) => {
                        setFilterLoading(true)
                        setSelectedCategoryId(categoryId)
                        // Add a small delay to show loading state
                        setTimeout(() => setFilterLoading(false), 300)
                      }}
                    />

                    {/* Brand Filter */}
                    {brands.length > 0 && (
                      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-semibold leading-none tracking-tight">Brand</h3>
                              <p className="text-sm text-muted-foreground">
                                {selectedCategoryId ? "Filter by brand in this category" : "Filter by brand"}
                              </p>
                            </div>
                            {selectedBrand && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedBrand(undefined)
                                  setFilterLoading(true)
                                }}
                                className="h-8 text-xs"
                              >
                                Clear
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="px-4 pb-4 space-y-2 max-h-64 overflow-y-auto">
                          <label className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors">
                            <input
                              type="radio"
                              name="brand"
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              checked={!selectedBrand}
                              onChange={() => {
                                setSelectedBrand(undefined)
                                setFilterLoading(true)
                              }}
                            />
                            <span className="text-sm font-medium">All Brands</span>
                            {!selectedCategoryId && (
                              <Badge variant="outline" className="ml-auto text-xs">
                                {brands.reduce((sum, b) => sum + b.count, 0)}
                              </Badge>
                            )}
                          </label>
                          {brands.map((brandItem) => (
                            <label 
                              key={brandItem.brand} 
                              className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                            >
                              <input
                                type="radio"
                                name="brand"
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                checked={selectedBrand === brandItem.brand}
                                onChange={() => {
                                  setSelectedBrand(brandItem.brand)
                                  setFilterLoading(true)
                                }}
                              />
                              <span className="text-sm flex-1">{brandItem.brand}</span>
                              <Badge variant="secondary" className="text-xs">
                                {brandItem.count}
                              </Badge>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    {hasActiveFilters && (
                      <Button variant="outline" className="w-full mt-4" onClick={resetFilters}>
                        Reset filters
                      </Button>
                    )}

                    {/* Sidebar support card */}
                    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                      <div className="relative h-24 w-full">
                        <Image
                          src="/platform-images/HEIDELBERG-Boardmaster-2-Annual-Report-1920.jpg"
                          alt=""
                          fill
                          className="object-cover"
                          sizes="320px"
                        />
                        <div className="absolute inset-0 bg-foreground/60" aria-hidden />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-medium text-foreground">Verify your company to build trust.</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Advertise to a wider audience.</p>
                        <Button asChild variant="outline" size="sm" className="mt-2 w-full">
                          <Link href="/verification">Get verified</Link>
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                  </div>
                </div>

            {/* Mobile filters sheet */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetContent side="left" className="w-full max-w-sm overflow-y-auto p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="p-4 space-y-6 lg:hidden">
                  <p className="text-sm text-muted-foreground">
                    Market type, condition, category, and verification.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Market Type</h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={marketTypes.includes("local")}
                            onChange={(e) => {
                              setFilterLoading(true)
                              setMarketTypes(e.target.checked ? [...marketTypes, "local"] : marketTypes.filter((t) => t !== "local"))
                              setTimeout(() => setFilterLoading(false), 300)
                            }}
                            className="rounded border-input"
                          />
                          <span className="text-sm">Local Market</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={marketTypes.includes("international")}
                            onChange={(e) => {
                              setFilterLoading(true)
                              setMarketTypes(e.target.checked ? [...marketTypes, "international"] : marketTypes.filter((t) => t !== "international"))
                              setTimeout(() => setFilterLoading(false), 300)
                            }}
                            className="rounded border-input"
                          />
                          <span className="text-sm">International Market</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Machine Condition</h3>
                      <Tabs value={condition} onValueChange={(v) => setCondition(v as "NEW" | "USED" | "ALL")}>
                        <TabsList className="grid grid-cols-3 w-full">
                          <TabsTrigger value="ALL" className="text-xs">All</TabsTrigger>
                          <TabsTrigger value="NEW" className="text-xs">New Machines</TabsTrigger>
                          <TabsTrigger value="USED" className="text-xs">Used Machines</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Verification</h3>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={showVerifiedOnly}
                          onChange={(e) => {
                            setFilterLoading(true)
                            setShowVerifiedOnly(e.target.checked)
                            setTimeout(() => setFilterLoading(false), 300)
                          }}
                          className="rounded border-input"
                        />
                        <span className="text-sm">Verified only</span>
                      </label>
                    </div>
                  </div>
                  {hasActiveFilters && (
                    <Button variant="outline" className="w-full" onClick={resetFilters}>
                      Reset filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  
                </div>

                {/* Results */}
                <div className="space-y-6">
                  {activeTab === "products" ? (
                    <div className="space-y-4">
                                            <div className="flex items-center justify-between flex-wrap gap-4">
                        <h2 className="text-2xl font-bold">Products</h2>
                        <div className="flex items-center gap-2 flex-wrap">
                          {selectedBrand && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                              Brand: {selectedBrand}
                              <button
                                onClick={() => {
                                  setSelectedBrand(undefined)
                                  setFilterLoading(true)
                                }}
                                className="ml-2 hover:text-blue-600 font-bold"
                                aria-label="Clear brand filter"
                              >
                                ×
                              </button>
                            </Badge>
                          )}
                          {condition !== "ALL" && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              {condition === "NEW" ? "New Machines" : "Used Machines"}
                            </Badge>
                          )}
                          {marketTypes.length < 2 && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {marketTypes.includes("local") ? "Local Market" : "International Market"}
                            </Badge>
                          )}
                          {hasActiveFilters && (
                            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={resetFilters}>
                              Reset filters
                            </Button>
                          )}
                          <p className="text-muted-foreground">
                            {pagination && pagination.total > 0 
                              ? `${pagination.total} products found` 
                              : filteredProducts.length > 0 
                                ? `${filteredProducts.length} products found` 
                                : "0 products found"}
                          </p>
                        </div>
                      </div>
                      {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-xl border bg-card text-card-foreground shadow relative overflow-hidden">
                              <div className="h-48 w-full bg-muted animate-pulse"></div>
                              <div className="p-4 space-y-3">
                                <div className="h-6 w-3/4 bg-muted animate-pulse rounded-md"></div>
                                <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md"></div>
                                <div className="h-4 w-full bg-muted animate-pulse rounded-md"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="relative mx-auto w-48 h-32 mb-6 rounded-xl overflow-hidden bg-muted">
                            <Image
                              src="/platform-images/04_Gallus_One_r_16_9_res_960x540.jpg"
                              alt=""
                              fill
                              className="object-cover opacity-80"
                              sizes="192px"
                            />
                            <div className="absolute inset-0 bg-muted/30" aria-hidden />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">No products found</h3>
                          <p className="text-muted-foreground max-w-sm mx-auto">Try adjusting your filters or search criteria.</p>
                        </div>
                      ) : (
                        <>
                          {(filterLoading || pageLoading) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {Array.from({ length: 6 }, (_, i) => (
                                <div key={i} className="rounded-xl border bg-card text-card-foreground shadow">
                                  <div className="p-6">
                                    <div className="h-48 bg-muted animate-pulse rounded-md mb-4"></div>
                                    <div className="space-y-2">
                                      <div className="h-4 bg-muted animate-pulse rounded-md"></div>
                                      <div className="h-4 bg-muted animate-pulse rounded-md w-3/4"></div>
                                      <div className="h-4 bg-muted animate-pulse rounded-md w-1/2"></div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                              ))}
                            </div>
                          )}
                          
                          {/* Pagination */}
                          {pagination && pagination.totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                              <Pagination>
                                <PaginationContent>
                                  <PaginationItem>
                                    {pagination.hasPrevPage ? (
                                      <PaginationPrevious 
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          handlePageChange(currentPage - 1)
                                        }}
                                      />
                                    ) : (
                                      <PaginationPrevious 
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className="pointer-events-none opacity-50"
                                      />
                                    )}
                                  </PaginationItem>
                                  
                                  {Array.from({ length: Math.min(pagination.totalPages, 10) }, (_, i) => {
                                    let page: number
                                    if (pagination.totalPages <= 10) {
                                      page = i + 1
                                    } else if (currentPage <= 5) {
                                      page = i + 1
                                    } else if (currentPage >= pagination.totalPages - 4) {
                                      page = pagination.totalPages - 9 + i
                                    } else {
                                      page = currentPage - 5 + i
                                    }
                                    return page
                                  }).map((page) => (
                                    <PaginationItem key={page}>
                                      <PaginationLink
                                        href="#"
                                        onClick={async (e) => {
                                          e.preventDefault()
                                          setPageLoading(true)
                                          setCurrentPage(page)
                                          // Add a small delay to show loading state
                                          setTimeout(() => setPageLoading(false), 300)
                                        }}
                                        isActive={currentPage === page}
                                      >
                                        {page}
                                      </PaginationLink>
                                    </PaginationItem>
                                  ))}
                                  
                                  <PaginationItem>
                                    {pagination.hasNextPage ? (
                                      <PaginationNext 
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          handlePageChange(currentPage + 1)
                                        }}
                                      />
                                    ) : (
                                      <PaginationNext 
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className="pointer-events-none opacity-50"
                                      />
                                    )}
                                  </PaginationItem>
                                </PaginationContent>
                              </Pagination>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div id="companies-section" className="space-y-4">
                                              <div className="flex items-center justify-between flex-wrap gap-4">
                          <h2 className="text-2xl font-bold">Companies</h2>
                          <div className="flex items-center gap-2 flex-wrap">
                            {selectedCategoryId && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Filtered by category
                              </Badge>
                            )}
                            {marketTypes.length < 2 && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {marketTypes.includes("local") ? "Local Market" : "International Market"}
                              </Badge>
                            )}
                            {showVerifiedOnly && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Verified only
                              </Badge>
                            )}
                            <p className="text-muted-foreground">{filteredVendors.length} companies found</p>
                          </div>
                        </div>
                                            {filteredVendors.length === 0 ? (
                                              <div className="text-center py-12">
                                                <div className="relative mx-auto w-48 h-32 mb-6 rounded-xl overflow-hidden bg-muted">
                                                  <Image
                                                    src="/platform-images/04_Gallus_One_r_16_9_res_960x540.jpg"
                                                    alt=""
                                                    fill
                                                    className="object-cover opacity-80"
                                                    sizes="192px"
                                                  />
                                                  <div className="absolute inset-0 bg-muted/30" aria-hidden />
                                                </div>
                                                <h3 className="text-lg font-semibold mb-2">No companies found</h3>
                                                <p className="text-muted-foreground max-w-sm mx-auto">Try adjusting your filters or search criteria.</p>
                                              </div>
                                            ) : (
                                              <>
                                                {(filterLoading || pageLoading) ? (
                                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {Array.from({ length: 6 }, (_, i) => (
                                                      <div key={i} className="rounded-xl border bg-card text-card-foreground shadow">
                                                        <div className="p-6">
                                                          <div className="flex items-center space-x-4 mb-4">
                                                            <div className="h-12 w-12 bg-muted animate-pulse rounded-full"></div>
                                                            <div className="space-y-2 flex-1">
                                                              <div className="h-4 bg-muted animate-pulse rounded-md"></div>
                                                              <div className="h-3 bg-muted animate-pulse rounded-md w-3/4"></div>
                                                            </div>
                                                          </div>
                                                          <div className="space-y-2">
                                                            <div className="h-4 bg-muted animate-pulse rounded-md"></div>
                                                            <div className="h-4 bg-muted animate-pulse rounded-md w-3/4"></div>
                                                            <div className="h-4 bg-muted animate-pulse rounded-md w-1/2"></div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    ))}
                                                  </div>
                                                ) : (
                                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((vendor) => (
                                                      <VendorCard key={vendor.id} vendor={vendor} viewMode="grid" />
                                                    ))}
                                                  </div>
                                                )}
                                                
                                                {/* Pagination */}
                                                {totalPages > 1 && (
                                                  <div className="flex justify-center mt-8">
                                                    <Pagination>
                                                      <PaginationContent>
                                                        <PaginationItem>
                                                          {currentPage > 1 ? (
                                                            <PaginationPrevious 
                                                              href="#"
                                                              onClick={async (e) => {
                                                                e.preventDefault()
                                                                setPageLoading(true)
                                                                setCurrentPage(Math.max(1, currentPage - 1))
                                                                // Add a small delay to show loading state
                                                                setTimeout(() => setPageLoading(false), 300)
                                                              }}
                                                            />
                                                          ) : (
                                                            <PaginationPrevious 
                                                              href="#"
                                                              onClick={(e) => e.preventDefault()}
                                                              style={{ opacity: 0.5, pointerEvents: 'none' }}
                                                            />
                                                          )}
                                                        </PaginationItem>
                                                        
                                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                          <PaginationItem key={page}>
                                                            <PaginationLink
                                                              href="#"
                                                              onClick={async (e) => {
                                                                e.preventDefault()
                                                                setPageLoading(true)
                                                                setCurrentPage(page)
                                                                // Add a small delay to show loading state
                                                                setTimeout(() => setPageLoading(false), 300)
                                                              }}
                                                              isActive={currentPage === page}
                                                            >
                                                              {page}
                                                            </PaginationLink>
                                                          </PaginationItem>
                                                        ))}
                                                        
                                                        <PaginationItem>
                                                          {currentPage < totalPages ? (
                                                            <PaginationNext 
                                                              href="#"
                                                              onClick={async (e) => {
                                                                e.preventDefault()
                                                                setPageLoading(true)
                                                                setCurrentPage(Math.min(totalPages, currentPage + 1))
                                                                // Add a small delay to show loading state
                                                                setTimeout(() => setPageLoading(false), 300)
                                                              }}
                                                            />
                                                          ) : (
                                                            <PaginationNext 
                                                              href="#"
                                                              onClick={(e) => e.preventDefault()}
                                                              style={{ opacity: 0.5, pointerEvents: 'none' }}
                                                            />
                                                          )}
                                                        </PaginationItem>
                                                      </PaginationContent>
                                                    </Pagination>
                                                  </div>
                                                )}
                                              </>
                                            )}
                  </div>
              )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function MarketplacePage() {
  return <MarketplaceContent />
}
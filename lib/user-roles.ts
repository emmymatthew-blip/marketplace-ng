// User role constants for better maintainability

export const USER_ROLES = {
  // Manufacturing & Equipment
  MANUFACTURING: [
    "EQUIPMENT_MANUFACTURER",
    "CONSUMABLES_MANUFACTURER", 
    "INK_MANUFACTURER",
    "PAPER_MANUFACTURER",
    "SUBSTRATE_MANUFACTURER",
    "MACHINE_PARTS_MANUFACTURER"
  ] as const,

  // Print Service Providers
  PRINT_SERVICES: [
    "COMMERCIAL_PRINTER",
    "DIGITAL_PRINTER",
    "SCREEN_PRINTER",
    "FLEXO_PRINTER",
    "OFFSET_PRINTER",
    "UV_PRINTER",
    "LARGE_FORMAT_PRINTER",
    "TEXTILE_PRINTER",
    "PACKAGING_PRINTER",
    "LABEL_PRINTER",
    "SIGN_PRINTER",
    "BANNER_PRINTER"
  ] as const,

  // Specialized Services
  SPECIALIZED_SERVICES: [
    "PREPRESS_SERVICE",
    "POSTPRESS_SERVICE",
    "FINISHING_SERVICE",
    "EMBROIDERY_SERVICE",
    "EMBOSSING_SERVICE",
    "FOIL_STAMPING_SERVICE",
    "DIE_CUTTING_SERVICE",
    "LAMINATION_SERVICE"
  ] as const,

  // Design & Creative
  DESIGN_CREATIVE: [
    "GRAPHIC_DESIGNER",
    "ART_DIRECTOR",
    "CREATIVE_AGENCY",
    "BRAND_AGENCY",
    "MARKETING_AGENCY",
    "ADVERTISING_AGENCY"
  ] as const,

  // Print Buyers & Clients
  PRINT_BUYERS: [
    "CORPORATE_BUYER",
    "GOVERNMENT_BUYER",
    "EDUCATIONAL_BUYER",
    "HEALTHCARE_BUYER",
    "RETAIL_BUYER",
    "EVENT_PLANNER",
    "WEDDING_PLANNER",
    "RESTAURANT_OWNER",
    "HOTEL_MANAGER",
    "REAL_ESTATE_AGENT"
  ] as const,

  // Distribution & Sales
  DISTRIBUTION_SALES: [
    "PRINT_BROKER",
    "PRINT_DEALER",
    "EQUIPMENT_DEALER",
    "CONSUMABLES_DEALER",
    "SOFTWARE_DEALER",
    "DISTRIBUTOR",
    "WHOLESALER",
    "RESELLER"
  ] as const,

  // Technology & Software
  TECHNOLOGY_SOFTWARE: [
    "SOFTWARE_DEVELOPER",
    "RIP_SOFTWARE_PROVIDER",
    "WORKFLOW_SOFTWARE_PROVIDER",
    "MIS_SOFTWARE_PROVIDER",
    "COLOR_MANAGEMENT_PROVIDER",
    "WEB_TO_PRINT_PROVIDER",
    "ECOMMERCE_PLATFORM"
  ] as const,

  // Consulting & Support
  CONSULTING_SUPPORT: [
    "PRINT_CONSULTANT",
    "COLOR_CONSULTANT",
    "WORKFLOW_CONSULTANT",
    "EQUIPMENT_CONSULTANT",
    "TECHNICAL_SUPPORT",
    "TRAINING_PROVIDER",
    "INSTALLATION_SERVICE"
  ] as const,

  // Media & Publishing
  MEDIA_PUBLISHING: [
    "PUBLISHER",
    "MAGAZINE_PUBLISHER",
    "NEWSPAPER_PUBLISHER",
    "BOOK_PUBLISHER",
    "CATALOG_PUBLISHER",
    "DIRECTORY_PUBLISHER"
  ] as const,

  // Promotional Products
  PROMOTIONAL_PRODUCTS: [
    "PROMOTIONAL_PRODUCTS_SUPPLIER",
    "APPAREL_SUPPLIER",
    "MERCHANDISE_SUPPLIER",
    "GIFT_SUPPLIER",
    "AWARD_SUPPLIER"
  ] as const,

  // Educational & Training
  EDUCATIONAL_TRAINING: [
    "PRINTING_SCHOOL",
    "TRAINING_CENTER",
    "EDUCATIONAL_INSTITUTION",
    "CERTIFICATION_PROVIDER"
  ] as const,

  // Industry Organizations
  INDUSTRY_ORGANIZATIONS: [
    "TRADE_ASSOCIATION",
    "PROFESSIONAL_ORGANIZATION",
    "STANDARDS_BODY",
    "CERTIFICATION_BODY"
  ] as const,

  // End Users (General)
  END_USERS: [
    "END_USER_PRINTER",
    "HOBBY_PRINTER",
    "STUDENT_PRINTER",
    "SMALL_BUSINESS_OWNER"
  ] as const,

  // Administrative
  ADMINISTRATIVE: ["ADMIN"] as const
} as const;

// Helper functions
export const ROLES_REQUIRING_COMPANY = [
  ...USER_ROLES.MANUFACTURING,
  ...USER_ROLES.DISTRIBUTION_SALES,
  ...USER_ROLES.TECHNOLOGY_SOFTWARE,
  ...USER_ROLES.DESIGN_CREATIVE,
  ...USER_ROLES.MEDIA_PUBLISHING,
  ...USER_ROLES.PROMOTIONAL_PRODUCTS,
  ...USER_ROLES.EDUCATIONAL_TRAINING,
  ...USER_ROLES.INDUSTRY_ORGANIZATIONS
] as const;

export const ROLES_REQUIRING_CIPPON = [
  ...USER_ROLES.PRINT_SERVICES,
  ...USER_ROLES.END_USERS
] as const;

// Type for all user roles
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES][number];

// Helper function to check if a role requires company name
export function requiresCompanyName(role: string): boolean {
  return (ROLES_REQUIRING_COMPANY as readonly string[]).includes(role);
}

// Helper function to check if a role requires CIPPON membership
export function requiresCipponMembership(role: string): boolean {
  return (ROLES_REQUIRING_CIPPON as readonly string[]).includes(role);
}

// Helper function to get role category
export function getRoleCategory(role: string): string {
  for (const [category, roles] of Object.entries(USER_ROLES)) {
    if ((roles as readonly string[]).includes(role)) {
      return category.replace(/_/g, ' ').toLowerCase();
    }
  }
  return 'other';
}

// Helper function to get display name for role
export function getRoleDisplayName(role: string): string {
  return role
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper function to check if a user is a seller (can list products/demonstrations)
// Note: There are only 2 user types: Seller or Buyer (excluding Admin)
// Sellers can list products and demonstrations, Buyers cannot
export function isSeller(role: string): boolean {
  // If role is ADMIN, they're not a seller
  if (role === "ADMIN") {
    return false;
  }
  
  // If role is in the buyer roles list, they're a buyer (not a seller)
  const buyerRoles = [...USER_ROLES.PRINT_BUYERS] as readonly string[];
  if (buyerRoles.includes(role)) {
    return false;
  }
  
  // All other roles are sellers
  return true;
}

/**
 * Can view "My demonstrations" and own DemoClass rows (sellers + admins testing/hosting demos).
 * `isSeller` alone excludes ADMIN, but demos are keyed by `manufacturerId` = session user id for admins too.
 */
export function canManageOwnDemonstrations(role: string): boolean {
  if (role === "ADMIN") {
    return true
  }
  return isSeller(role)
}
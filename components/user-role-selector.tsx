"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { USER_ROLES, getRoleDisplayName, type UserRole } from "@/lib/user-roles"

interface UserRoleSelectorProps {
  value: UserRole
  onValueChange: (value: UserRole) => void
  placeholder?: string
}

export function UserRoleSelector({ value, onValueChange, placeholder = "Select your role" }: UserRoleSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-blue-50 border-blue-200">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* End Users - Most Common */}
        <SelectItem value="END_USER_PRINTER">End User (Printer)</SelectItem>
        
        {/* Print Service Providers */}
        <SelectItem value="COMMERCIAL_PRINTER">Commercial Printer</SelectItem>
        <SelectItem value="DIGITAL_PRINTER">Digital Printer</SelectItem>
        <SelectItem value="SCREEN_PRINTER">Screen Printer</SelectItem>
        <SelectItem value="FLEXO_PRINTER">Flexo Printer</SelectItem>
        <SelectItem value="OFFSET_PRINTER">Offset Printer</SelectItem>
        <SelectItem value="UV_PRINTER">UV Printer</SelectItem>
        <SelectItem value="LARGE_FORMAT_PRINTER">Large Format Printer</SelectItem>
        <SelectItem value="TEXTILE_PRINTER">Textile Printer</SelectItem>
        <SelectItem value="PACKAGING_PRINTER">Packaging Printer</SelectItem>
        <SelectItem value="LABEL_PRINTER">Label Printer</SelectItem>
        <SelectItem value="SIGN_PRINTER">Sign Printer</SelectItem>
        <SelectItem value="BANNER_PRINTER">Banner Printer</SelectItem>
        
        {/* Manufacturing & Equipment */}
        <SelectItem value="EQUIPMENT_MANUFACTURER">Equipment Manufacturer</SelectItem>
        <SelectItem value="CONSUMABLES_MANUFACTURER">Consumables Manufacturer</SelectItem>
        <SelectItem value="INK_MANUFACTURER">Ink Manufacturer</SelectItem>
        <SelectItem value="PAPER_MANUFACTURER">Paper Manufacturer</SelectItem>
        <SelectItem value="SUBSTRATE_MANUFACTURER">Substrate Manufacturer</SelectItem>
        <SelectItem value="MACHINE_PARTS_MANUFACTURER">Machine Parts Manufacturer</SelectItem>
        
        {/* Specialized Services */}
        <SelectItem value="PREPRESS_SERVICE">Prepress Service</SelectItem>
        <SelectItem value="POSTPRESS_SERVICE">Postpress Service</SelectItem>
        <SelectItem value="FINISHING_SERVICE">Finishing Service</SelectItem>
        <SelectItem value="EMBROIDERY_SERVICE">Embroidery Service</SelectItem>
        <SelectItem value="EMBOSSING_SERVICE">Embossing Service</SelectItem>
        <SelectItem value="FOIL_STAMPING_SERVICE">Foil Stamping Service</SelectItem>
        <SelectItem value="DIE_CUTTING_SERVICE">Die Cutting Service</SelectItem>
        <SelectItem value="LAMINATION_SERVICE">Lamination Service</SelectItem>
        
        {/* Design & Creative */}
        <SelectItem value="GRAPHIC_DESIGNER">Graphic Designer</SelectItem>
        <SelectItem value="ART_DIRECTOR">Art Director</SelectItem>
        <SelectItem value="CREATIVE_AGENCY">Creative Agency</SelectItem>
        <SelectItem value="BRAND_AGENCY">Brand Agency</SelectItem>
        <SelectItem value="MARKETING_AGENCY">Marketing Agency</SelectItem>
        <SelectItem value="ADVERTISING_AGENCY">Advertising Agency</SelectItem>
        
        {/* Print Buyers & Clients */}
        <SelectItem value="CORPORATE_BUYER">Corporate Buyer</SelectItem>
        <SelectItem value="GOVERNMENT_BUYER">Government Buyer</SelectItem>
        <SelectItem value="EDUCATIONAL_BUYER">Educational Buyer</SelectItem>
        <SelectItem value="HEALTHCARE_BUYER">Healthcare Buyer</SelectItem>
        <SelectItem value="RETAIL_BUYER">Retail Buyer</SelectItem>
        <SelectItem value="EVENT_PLANNER">Event Planner</SelectItem>
        <SelectItem value="WEDDING_PLANNER">Wedding Planner</SelectItem>
        <SelectItem value="RESTAURANT_OWNER">Restaurant Owner</SelectItem>
        <SelectItem value="HOTEL_MANAGER">Hotel Manager</SelectItem>
        <SelectItem value="REAL_ESTATE_AGENT">Real Estate Agent</SelectItem>
        
        {/* Distribution & Sales */}
        <SelectItem value="PRINT_BROKER">Print Broker</SelectItem>
        <SelectItem value="PRINT_DEALER">Print Dealer</SelectItem>
        <SelectItem value="EQUIPMENT_DEALER">Equipment Dealer</SelectItem>
        <SelectItem value="CONSUMABLES_DEALER">Consumables Dealer</SelectItem>
        <SelectItem value="SOFTWARE_DEALER">Software Dealer</SelectItem>
        <SelectItem value="DISTRIBUTOR">Distributor</SelectItem>
        <SelectItem value="WHOLESALER">Wholesaler</SelectItem>
        <SelectItem value="RESELLER">Reseller</SelectItem>
        
        {/* Technology & Software */}
        <SelectItem value="SOFTWARE_DEVELOPER">Software Developer</SelectItem>
        <SelectItem value="RIP_SOFTWARE_PROVIDER">RIP Software Provider</SelectItem>
        <SelectItem value="WORKFLOW_SOFTWARE_PROVIDER">Workflow Software Provider</SelectItem>
        <SelectItem value="MIS_SOFTWARE_PROVIDER">MIS Software Provider</SelectItem>
        <SelectItem value="COLOR_MANAGEMENT_PROVIDER">Color Management Provider</SelectItem>
        <SelectItem value="WEB_TO_PRINT_PROVIDER">Web-to-Print Provider</SelectItem>
        <SelectItem value="ECOMMERCE_PLATFORM">E-commerce Platform</SelectItem>
        
        {/* Consulting & Support */}
        <SelectItem value="PRINT_CONSULTANT">Print Consultant</SelectItem>
        <SelectItem value="COLOR_CONSULTANT">Color Consultant</SelectItem>
        <SelectItem value="WORKFLOW_CONSULTANT">Workflow Consultant</SelectItem>
        <SelectItem value="EQUIPMENT_CONSULTANT">Equipment Consultant</SelectItem>
        <SelectItem value="TECHNICAL_SUPPORT">Technical Support</SelectItem>
        <SelectItem value="TRAINING_PROVIDER">Training Provider</SelectItem>
        <SelectItem value="INSTALLATION_SERVICE">Installation Service</SelectItem>
        
        {/* Media & Publishing */}
        <SelectItem value="PUBLISHER">Publisher</SelectItem>
        <SelectItem value="MAGAZINE_PUBLISHER">Magazine Publisher</SelectItem>
        <SelectItem value="NEWSPAPER_PUBLISHER">Newspaper Publisher</SelectItem>
        <SelectItem value="BOOK_PUBLISHER">Book Publisher</SelectItem>
        <SelectItem value="CATALOG_PUBLISHER">Catalog Publisher</SelectItem>
        <SelectItem value="DIRECTORY_PUBLISHER">Directory Publisher</SelectItem>
        
        {/* Promotional Products */}
        <SelectItem value="PROMOTIONAL_PRODUCTS_SUPPLIER">Promotional Products Supplier</SelectItem>
        <SelectItem value="APPAREL_SUPPLIER">Apparel Supplier</SelectItem>
        <SelectItem value="MERCHANDISE_SUPPLIER">Merchandise Supplier</SelectItem>
        <SelectItem value="GIFT_SUPPLIER">Gift Supplier</SelectItem>
        <SelectItem value="AWARD_SUPPLIER">Award Supplier</SelectItem>
        
        {/* Educational & Training */}
        <SelectItem value="PRINTING_SCHOOL">Printing School</SelectItem>
        <SelectItem value="TRAINING_CENTER">Training Center</SelectItem>
        <SelectItem value="EDUCATIONAL_INSTITUTION">Educational Institution</SelectItem>
        <SelectItem value="CERTIFICATION_PROVIDER">Certification Provider</SelectItem>
        
        {/* Industry Organizations */}
        <SelectItem value="TRADE_ASSOCIATION">Trade Association</SelectItem>
        <SelectItem value="PROFESSIONAL_ORGANIZATION">Professional Organization</SelectItem>
        <SelectItem value="STANDARDS_BODY">Standards Body</SelectItem>
        <SelectItem value="CERTIFICATION_BODY">Certification Body</SelectItem>
        
        {/* End Users (General) */}
        <SelectItem value="HOBBY_PRINTER">Hobby Printer</SelectItem>
        <SelectItem value="STUDENT_PRINTER">Student Printer</SelectItem>
        <SelectItem value="SMALL_BUSINESS_OWNER">Small Business Owner</SelectItem>
      </SelectContent>
    </Select>
  )
} 
interface VendorProfileProps {
  vendor: {
    id: string
    name: string
    companyName: string
    role: string
    location: string
    isVerified: boolean
    cipponId?: string
    bio?: string
    phone?: string
    email?: string
  }
}

export function VendorProfile({ vendor }: VendorProfileProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">About {vendor.companyName}</h2>

      {vendor.bio ? (
        <div 
          className="prose prose-sm sm:prose-base max-w-none text-gray-700 mb-6 [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-1 [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:mb-2 [&_blockquote]:my-2"
          dangerouslySetInnerHTML={{ __html: vendor.bio }}
        />
      ) : (
        <p className="text-gray-500 italic mb-6">No bio information available.</p>
      )}

      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">Business Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Business Type</p>
            <p className="font-medium">
              {vendor.role === "END_USER_PRINTER" ? "Printing Service Provider" : "Equipment Manufacturer"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{vendor.location}</p>
          </div>

          {vendor.isVerified && vendor.cipponId && (
            <div>
              <p className="text-sm text-gray-500">CIPPON ID</p>
              <p className="font-medium">{vendor.cipponId}</p>
            </div>
          )}
        </div>
      </div>

      {vendor.isVerified && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
          <h3 className="font-medium text-green-800 mb-2">Verified Business</h3>
          <p className="text-sm text-green-700">
            This business has been verified by CIPPON (Chartered Institute of Professional Printers of Nigeria).
            Verified businesses have undergone a verification process to confirm their identity and credentials.
          </p>
        </div>
      )}
    </div>
  )
}

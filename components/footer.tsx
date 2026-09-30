import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#3976e8] w-full">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hidden items-center space-x-2 md:flex">
                  <Image
                    src="/images/Nig-Print-Logo.png"
                    alt="PrintMarket NG Logo"
                    width={40}
                    height={40}
                    className="h-10 w-auto"
                  />
                  <span className="hidden font-bold text-sm sm:inline-block text-white">PrintMarket NG</span>
                </Link>
              </li>
              <li><Link href="/terms" className="text-white text-sm hover:underline">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-white text-sm hover:underline">Privacy Policy</Link></li>
              <li><Link href="/billing" className="text-white text-sm hover:underline">Billing Policy</Link></li>
              <li><Link href="/copyright" className="text-white text-sm hover:underline">Copyright Infringement Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 text-lg tracking-wide">SUPPORT</h3>
            <ul className="space-y-2">
              <li><a href="mailto:support@printmarketng.com" className="text-white text-sm hover:underline">support@printmarketng.com</a></li>
              <li><Link href="/contact" className="text-white text-sm hover:underline">Contact Us</Link></li>
              <li><Link href="/faq" className="text-white text-sm hover:underline">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 text-lg tracking-wide">OUR RESOURCES</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-white text-sm hover:underline">Our Blog</Link></li>
              <li><Link href="/social" className="text-white text-sm hover:underline">Our Social Media Channels</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 text-lg tracking-wide">HOT LINKS</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white text-sm hover:underline">Our address</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-end items-end mt-8">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <span className="text-white text-xs">© 2024</span>
            <span>
              <img src="https://flagcdn.com/us.svg" alt="US Flag" className="inline-block w-5 h-4 ml-2 mr-1" />
            </span>
            <span className="text-white text-sm">English</span>
            <svg className="inline-block w-4 h-4 text-white ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>
    </footer>
  )
} 
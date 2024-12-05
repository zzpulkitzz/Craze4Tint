import { Facebook, Instagram, Twitter, Youtube, Music } from 'lucide-react';
export default function Footer(){
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle newsletter submission
    };
    return <footer className=" py-16 px-4 md:px-8 text-gray-100 bg-[rgb(18,18,18)] relative w-[100vw] h-screen top-[50vh] left-[50vw] translate-x-[-50vw] translate-y-[-50vh]">
    {/* Main Content */}
    <div className="max-w-6xl mx-auto">
        {/* Newsletter Section */}
        <div className="text-center mb-16 font-light font-roboto">
            <h3 className="text-lg mb-6 tracking-wide font-[100] font-roboto">JOIN OUR NEWSLETTER</h3>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="flex-1 border border-white bg-transparent px-4 py-2 focus:outline-none w-[100px]"
                    />
                    <button type="submit" className=" border-white border px-4 py-2 group   hover:scale-110 transition-all">
                  
                        Subscribe
                   
                    </button>
                </div>
            </form>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm text-gray-300">
            <a href="/search" className="hover:underline">Search</a>
            <a href="/contact" className="hover:underline">Contact Information</a>
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/refund" className="hover:underline">Refund Policy</a>
            <a href="/shipping" className="hover:underline">Shipping Policy</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-8 mb-12">
            <a href="/instagram" className="hover:text-gray-600">
                <Instagram className="w-5 h-5 hover:scale-125 transition-all" />
            </a>
            <a href="/facebook" className="hover:text-gray-600">
                <Facebook className="w-5 h-5 hover:scale-125 transition-all" />
            </a>
            <a href="/twitter" className="hover:text-gray-600">
                <Twitter className="w-5 h-5 hover:scale-125 transition-all" />
            </a>
            <a href="/youtube" className="hover:text-gray-600">
                <Youtube className="w-5 h-5 hover:scale-125 transition-all" />
            </a>
            <a href="/spotify" className="hover:text-gray-600">
                <Music className="w-5 h-5 hover:scale-125 transition-all" />
            </a>
        </div>

        {/* Company Info */}
        <div className="text-center text-xs text-gray-500 space-y-2">
            <p>© 2024, Craze4Tint</p>
            <p className="max-w-lg mx-auto">
                NAME AND ADDRESS OF THE MANUFACTURER:<br />
                INDUSTRIA DE DISENO TEXTIL, S.A. (INDITEX, S.A.)<br />
                AVENIDA DE LA DIPUTACIÓN, EDIFICIO INDITEX, 15143, ARTEIXO (A CORUÑA), SPAIN
            </p>
        </div>
    </div>
</footer>
}
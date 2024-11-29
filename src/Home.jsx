import React, { useState, useContext, useEffect, useRef } from "react";
import splash from "./assets/splash.png";
import Banner from "./assets/banner.jpg";
import { ScrollContext, ChangeScrollContext } from "./contextProvider";
import { Button } from "./components/ui/button";
import { Link, redirect } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Music } from 'lucide-react';
import { AuthContext } from './contextProvider';
import diwali from "./assets/diwali.jpg";
import sale from "./assets/sale.jpg";
import banner from "./assets/banner.png";
import { fetchPlease } from "./Fetch";

export default function Home() {
    const mainRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const isScroll = useContext(ScrollContext);
    const setIsScroll = useContext(ChangeScrollContext);
    const { currentUser } = useContext(AuthContext);
    const [prodCarousel, setProdCarousel] = useState([]);

    const containerRef = useRef(null);

    const images = [
        banner, diwali, sale
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle newsletter submission
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        }, 3000);

        let apiToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
        const fetchProducts = async () => {
            try {
                const data = await fetchPlease(null,"tag:feature",null)

                
                console.log(data)
                if (data.errors) {
                    throw new Error(data.errors[0].message);
                }
                setProdCarousel([...data.products.edges])
            } catch (err) {
                console.log(err);
            }
        }
        fetchProducts()
        return () => clearInterval(interval)
    }, [])

    const handleScroll = (direction) => {
        if (direction === 'left') {
            containerRef.current.scrollLeft -= 300;
        } else {
            containerRef.current.scrollLeft += 300;
        }
    };

    return <main className="absolute sm:top-[120px] top-[100px]" ref={mainRef}>
        <div className="relative w-full  overflow-hidden">
            <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((src, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                        <img
                            src={src}
                            alt={`Clothing brand image ${index + 1}`}
                            className="w-full "
                        />
                    </div>
                ))}
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                            index === currentIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>

        <div className="w-[100vw]  px-4 py-8 mb-[200px] ">
            <h1 className="hidden sm:block text-4xl font-bold mb-8 text-center">Premium Collections</h1>
            <div className="w-full overflow-hidden">
                <div
                    ref={containerRef}
                    className="scroll_container flex flex-row gap-4 py-8 transition-all duration-300 ease-linear overflow-x-auto w-[100%]"
                >
                    {prodCarousel.map((product, index) => (
                        <div
                            key={`${product.node.id}-${index}`}
                            className=" bg-white rounded-lg shadow-md  flex-shrink-0 sm:w-[30vw] w-[38vw]" onClick={() => window.location.href = `/shop/${product.node.id}?name=${product.node.title}`}
                        >
                            <div className="relative w-[100%]">
                                <img
                                    src={product.node.images.edges[0].node.url}
                                    alt={product.node.images.edges[0].node.altText}
                                    className="w-[100%] object-cover"
                                />
                                <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                                    Sale
                                </span>
                            </div>
                            <div className="sm:p-4 p-2">
                                <h3 className="text-lg font-medium  text-gray-900 sm:block hidden">{product.node.title}</h3>
                                <div className="sm:mt-2  flex items-center justify-between">
                                    <div className="mx-auto sm:mx-[0px]  text-sm sm:text-xl">
                                        <span className="text-gray-500 line-through  ">
                                        ₹ {product.node.variants.edges[0].node.compareAtPrice.amount}
                                        </span>
                                        <span className="ml-1 text-black sm:font-semibold font-[400]">
                                        ₹ {product.node.priceRange.minVariantPrice.amount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="text-center mt-8">
                <Button variant="outline" className="bg-black text-white hover:bg-gray-800 mb-[200px]" onClick={()=>{
                    navigate("/shop")
                    
                }}>
                    View all
                </Button>
            </div>
        </div>
        <footer className=" py-16 px-4 md:px-8 text-gray-100 bg-[rgb(18,18,18)]">
            {/* Main Content */}
            <div className="max-w-6xl mx-auto">
                {/* Newsletter Section */}
                <div className="text-center mb-16 font-light font-roboto">
                    <h3 className="text-lg mb-6 tracking-wide font-[100] font-roboto">JOIN OUR NEWSLETTER</h3>
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                        <div className="flex gap-4 w-[]">
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
    </main>
}
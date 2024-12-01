import React, { useState, useContext, useEffect, useRef } from "react";
import splash from "./assets/splash.png";
import Banner from "./assets/banner.jpg";
import { ScrollContext, ChangeScrollContext } from "./contextProvider";
import { Button } from "./components/ui/button";
import { Link, redirect } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Music } from 'lucide-react';
import { AuthContext } from './contextProvider';
import winterPoster from "./assets/winterPoster.jpg";
import endOfSeason from "../public/endOfSeason.jpg";
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
    const [winterCarousel, setWinterCarousel] = useState([]);
    const iframeRef = useRef(null)
    const containerRef = useRef(null);
    

    const images = [
        banner, endOfSeason, winterPoster
    ]
    

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

        const fetchWinterProducts = async () => {
            try {
                const data = await fetchPlease("hoddie",null,null)

                
                console.log(data)
                if (data.errors) {
                    throw new Error(data.errors[0].message);
                }
                setWinterCarousel([...data.products.edges])
            } catch (err) {
                console.log(err);
            }
        }
        fetchWinterProducts()

        return () => clearInterval(interval)
    }, [])

    const handleScroll = (direction) => {
        if (direction === 'left') {
            containerRef.current.scrollLeft -= 300;
        } else {
            containerRef.current.scrollLeft += 300;
        }
    };

    useEffect(() => {

        const handlePlayPause = (entry) => {
            const iframe = iframeRef.current;
            if (iframe && iframe.contentWindow) {
              if (entry.isIntersecting) {
                // Play the video
                iframe.contentWindow.postMessage(
                  JSON.stringify({ event: "command", func: "playVideo" }),
                  "*"
                );
              } else {
                console.log("hey")
                // Pause the video
                iframe.contentWindow.postMessage(
                  JSON.stringify({ event: "command", func: "pauseVideo" }),
                  "*"
                );
              }
            }
          };

        const observer = new IntersectionObserver(
            
          ([entry]) => {
            handlePlayPause(entry)},
      { threshold: 0.25 }
        );
    
        if (iframeRef.current) {
          observer.observe(iframeRef.current);
        }
    
        return () => {
          if (iframeRef.current) {
            observer.unobserve(iframeRef.current);
          }
        };
      }, [0]);


    return <main className="absolute sm:top-[120px] top-[100px] font-raleway" ref={mainRef}>
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

        
        
        <div className="w-[100vw]  px-4   ">
        <h1 className="hidden sm:block text-4xl tracking-wide mt-4 text-center font-semibold">Winter Collections</h1>
            <div className="w-full overflow-hidden">
                <div
                    ref={containerRef}
                    className="scroll_container flex flex-row justify-around py-8 transition-all duration-300 ease-linear overflow-x-auto w-[100%]"
                >
                    {winterCarousel.map((product, index) => (
                        <div
                            key={`${product.node.id}-${index}`}
                            className=" bg-white rounded-lg shadow-md  flex-shrink-0 xsm:w-[30vw] lg:w-[25vw] xl:w-[20vw]" onClick={() => window.location.href = `/shop/${product.node.id}?name=${product.node.title}`}
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
                            <div className="sm:p-1  sm:pl-[12px]">
                                <h3 className="md:text-lg xsm:text-sm sm:text-md  lg:text-xl font-medium  text-gray-900 sm:block hidden">{product.node.title}</h3>
                                <div className="sm:mt-2  flex-col ">
                                <div className="ml-1 text-black font-[500] md:text-lg lg:text-xl">
                                        ₹{product.node.priceRange.minVariantPrice.amount}
                                        </div>
                                    <div className="sm:mx-[0px]  text-[0.78rem] sm:text-xl  flex flex-row justify-between items-center w-[115px] lg:w-[140px] mb-[5px] ml-[5px]">
                                   

                                        <span className="text-gray-500 line-through md:text-md xsm:text-sm lg:text-[1.1rem] ">
                                        ₹{product.node.variants.edges[0].node.compareAtPrice.amount}
                                        </span>

                                        <span className="text-xs text-green-600 ml-2">
                        {Math.round((1 - product.node.priceRange.minVariantPrice.amount / product.node.variants.edges[0].node.compareAtPrice.amount) * 100)}% OFF
                      </span>
                                       
                                        
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>
            
            <div className="w-[100vw]  px-4   ">
            <h1 className="hidden sm:block text-4xl tracking-wide mt-4 text-center font-semibold">Premium Collections</h1>
            <div className="w-full overflow-hidden">
                <div
                    ref={containerRef}
                    className="scroll_container flex flex-row gap-4 py-8 transition-all duration-300 ease-linear overflow-x-auto w-[100%]"
                >
                    {prodCarousel.map((product, index) => (
                        <div
                            key={`${product.node.id}-${index}`}
                            className=" bg-white rounded-lg shadow-md  flex-shrink-0 xsm:w-[30vw] lg:w-[25vw] xl:w-[20vw]" onClick={() => window.location.href = `/shop/${product.node.id}?name=${product.node.title}`}
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
                            <div className="sm:p-1  sm:pl-[12px]">
                                <h3 className="md:text-lg xsm:text-sm sm:text-md  lg:text-xl font-medium  text-gray-900 sm:block hidden">{product.node.title}</h3>
                                <div className="sm:mt-2  flex-col ">
                                <div className="ml-1 text-black font-[500] md:text-lg lg:text-xl">
                                        ₹{product.node.priceRange.minVariantPrice.amount}
                                        </div>
                                    <div className="sm:mx-[0px]  text-[0.78rem] sm:text-xl  flex flex-row justify-between items-center w-[115px] lg:w-[140px] mb-[5px] ml-[5px]">
                                   

                                        <span className="text-gray-500 line-through md:text-md xsm:text-sm lg:text-[1.1rem] ">
                                        ₹{product.node.variants.edges[0].node.compareAtPrice.amount}
                                        </span>

                                        <span className="text-xs text-green-600 ml-2">
                        {Math.round((1 - product.node.priceRange.minVariantPrice.amount / product.node.variants.edges[0].node.compareAtPrice.amount) * 100)}% OFF
                      </span>
                                       
                                        
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="text-center mt-8">
                <Button variant="outline" className="bg-black text-white hover:bg-gray-800 mb-[20px]" onClick={()=>{
                    navigate("/shop")
                    
                }}>
                    View all
                </Button>
            </div>
        </div>
        

        <div  style={{ width: "100%", height: "100%" } } >
     
        <iframe
          ref={iframeRef}
          className="mx-auto mb-[20px] h-[44.96vw] w-[80vw]"
         
          src={`https://www.youtube.com/embed/Cz8S9JgP4JE?mute=1&playlist=Cz8S9JgP4JE&loop=1&enablejsapi=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

    </div>


        <footer className=" py-16 px-4 md:px-8 text-gray-100 bg-[rgb(18,18,18)]">
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
    </main>
}
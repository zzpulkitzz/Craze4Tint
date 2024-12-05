import { useEffect } from "react";
import { motion, useAnimation } from 'framer-motion';
import logo_white from "./assets/logo_white_.png"
import logo_black from "./assets/logo_black.png"
import React, { useState, useContext } from "react";
import { useRef } from 'react';
import { ScrollContext, ChangeScrollContext } from "./contextProvider";
import { Outlet, Link,useNavigate } from "react-router-dom"
import WhatsAppChat from "./Whatsapp";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClicked,setIsClicked]=useState(false)
    const isScroll = useContext(ScrollContext);
    const setIsScroll = useContext(ChangeScrollContext);
    const headRef = useRef();
    const marqueeRef = useRef(null);
    const subNavRef = useRef(null);
    const [searchText,setSearchText]=useState("")
    const [isTshirtOpen_mobile,setIsTshirtOpen_mobile]=useState(false)
    console.log(typeof searchText)
    const headerVariant1 = { hidden: { opacity: 0.4 }, visible: { backgroundColor: "rgb(18,18,18)", opacity: 1, transition: { duration: 0.5 } } };
    const headerVariant2 = { hidden: { opacity: 0.4 }, visible: { backgroundColor: "rgba(255,255,255,0)", opacity: 1, transition: { duration: 0.5 } } };
    const marqueeVariant1 = { "hidden": { height: 0, padding: 0, backgroundColor: "rgb(255, 255, 255, 0)", opacity: 0.4 }, "visible": { height: 20, padding: 4, opacity: 1, transition: { duration: 0.3 }, backgroundColor: 'rgba(18,18,18)' } };
    const marqueeVariant2 = { "hidden": { height: 20, opacity: 1, backgroundColor: "rgb(18,18,18)", padding: 4 }, "visible": { height: 0, opacity: 0.4, backgroundColor: "rgba(255,255,255,0)", transition: { duration: 0.3 }, padding: 0 } };
    const [isTshirtOpen, setIsTshirtOpen] = useState(false);

    const categoryContainerVariants = {
        hidden: { 
            opacity: 0,
            y: -20,
            display: "none"
        },
        visible: {
            opacity: 1,
            y: 0,
            display: "block",
            transition: {
                duration: 0.3
            }
        }
    };
    
    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (isScroll === false) {
                if (window.scrollY >= 104) {
                    setIsScroll(true)
                }
            } else {
                if (window.scrollY <= 104) {
                    setIsScroll(false)
                }
            }
        })
    }, [isScroll])
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault()
      if(searchText!==""){
        navigate(`/shop?search=${searchText}`, { replace: true })
        navigate(0)}
    
    }

    console.log(isClicked,isTshirtOpen_mobile)

    return <div className="">
        <motion.header className="w-[100vw] z-[10] fixed text-white" ref={headRef} key={isScroll}
            variants={isScroll ? headerVariant2 : headerVariant1}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="bg-[rgb(18,18,18)] p-1 h-[20px] flex justify-center w-[100vw] overflow-hidden" ref={marqueeRef}
                variants={isScroll ? marqueeVariant2 : marqueeVariant1} initial="hidden" animate="visible"
            >
                <div className="marquee flex flex-col justify-center items-center  h-[110px]">
                    <div className="mb-2">FLASH SALE 20%</div>
                    <div className="mb-2">WEAR YOUR CONFIDENCE</div>
                    <div className="mb-2">FLASH SALE 20%</div>
                    <div className="mb-2">WEAR YOUR CONFIDENCE</div>
                </div>
            </motion.div>
            <nav>
                <div className=" px-4 sm:px-6 lg:px-8 h-[100%] "  ref={subNavRef}>
                    <div className="flex items-center justify-between h-full ">
                        <div className="flex items-center justify-between w-[calc(50vw+95px)]">
                            <div className="md:block hidden ml-[20px]  ">
                                <div className={`font_target ml-10 flex items-baseline space-x-4 relative z-10 tracking-wide ${isScroll ? "text-black font-[500]" : "text-white font-light"}`}>
                                    <Link to="/" className={`px-0 py-1 text-sm border-0 hover:border-b-[1px] transition-all hover:border-solid ${isScroll ? "hover:border-black" : "hover:border-white"} hover:scale-110 transition-all`}>
                                        HOME
                                    </Link>
                                     <div className="relative group" onMouseEnter={() => setTimeout(()=>{
                                            setIsOpen(true)
                                     },[100])} onMouseLeave={() => setTimeout(()=>{
                                        setIsTshirtOpen(false)
                                        setIsOpen(false)
                                 },[110])}>
            <Link to="/shop" className={`px-0 py-1 text-sm border-0 hover:border-b-[1px] hover:border-solid ml-[5px] ${isScroll ? "hover:border-black" : "hover:border-white"} transition-all `}>
                SHOP
            </Link>
            <motion.div
                className="absolute left-[-160.5px] top-[18px] w-[100vw] h-[70px]"
                variants={categoryContainerVariants}
                initial="hidden"
                animate={isOpen?"visible":"hidden"}
            >
                <div className={`categories font-raleway font-[200] ${isScroll ? "bg-none font-[400]" : "bg-[rgb(18,18,18)] shadow-lg"} rounded-sm mt-[35px] w-[110vw] pb-[10px]`}>
                    <div className={`category_container inline-flex flex-row justify-between items-center  ml-[40px] ${isScroll ? "border-[0.6px] shadow-sm bg-white py-[10px] px-[7px]" : "none"} pr-[20px]`}>
                        <button 
                            className="all border-[1px] border-white px-[10px] hover:text-white hover:bg-black hover:scale-105 transition-all duration-300 mr-[10px]"
                            onClick={() => {
                                navigate("/shop", { replace: true });
                                navigate(0);
                            }}
                        >
                            All
                        </button>

                        <div className="relative flex flex-row ">
                            <button 
                                className={`tshirts border-[1px] border-white px-[10px] hover:text-white hover:bg-black  transition-all duration-300 ${isTshirtOpen? "scale-[1.15]":"null"}`}
                                onMouseEnter={() => {
                                        console.log("cdsv")
                                        setIsTshirtOpen(true)
                                    }}
                                
                                
                                
                            >
                                T-shirts
                            </button>
                             {isTshirtOpen?(
                                <div 
                                    
                                    className=" flex flex-row "
                                    onMouseEnter={() => {
                                        setIsTshirtOpen(true)}}
                                    
                                    
                                >
                                    <motion.button 
                                        animate={{marginLeft:10,opacity:1}}
                                        initial={{opacity:0.1}}
                                        className={`block w-full text-left px-2  hover:bg-black hover:text-white transition-all duration-150  ${isScroll?null:"border-white border-[1px]"} hover:scale-105`}
                                        onClick={() => {
                                            navigate("/shop?type=frontpage", { replace: true });
                                            navigate(0);
                                        }}
                                    >
                                        Solid
                                    </motion.button>
                                    <motion.button 
                                        animate={{marginLeft:10,opacity:1,transitionDuration:'1s'}}
                                        initial={{opacity:0.1}}
                                        className="block w-full text-left px-2  hover:bg-black hover:text-white transition-all duration-150 border-[1px] border-white hover:scale-105"
                                        onClick={() => {
                                            navigate("/shop?type=printed-oversized-t-shirts", { replace: true });
                                            navigate(0);
                                        }}
                                    >
                                        Printed
                                    </motion.button>
                                </div>
                            ):null}
                        </div>

                        <motion.button 
                            initial={isTshirtOpen?{position:'relative',left:-100}:null}
                            animate={isTshirtOpen?{position:'relative',left:0}:null}
                            className="hoodies border-[1px] border-white px-[10px] hover:text-white hover:bg-black hover:scale-105 transition-all duration-300 mr-[20px] ml-[10px]"
                            onClick={() => {
                                navigate("/shop?type=hoodie", { replace: true });
                                navigate(0);
                            }}
                        >
                            Hoodies
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
                                    <Link to="/contact" className={`px-0 py-1 text-sm border-0 hover:border-b-[1px] transition-all hover:border-solid ml-[10px] ${isScroll ? "hover:border-black" : "hover:border-white"} hover:scale-110 transition-all`}>
                                        CONTACT
                                    </Link>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                <img className="text-xl font-bold sm:h-[85px] relative top-[10px] sm:left-[0px] left-[0px] h-[45px]" src={isScroll ? logo_black : logo_white} alt="Logo" />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="search hover:border-white hover:border-solid hover:border-[0.7px] w-[150px] flex flex-row justify-between">
                                <input className="search_input w-[110px] bg-inherit" value={searchText} onChange={(event)=>{
                                    setSearchText(()=>event.target.value)
                                    
                                }} />
                                <Link className="p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"  onClick={handleSearch} key={searchText}>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={isScroll ? "black" : 'currentColor'} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </Link>
                            </div>
                            <Link to="/profile" className="ml-3 p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={isScroll ? "black" : 'currentColor'} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                            <Link to="/cart" className="ml-3 p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={isScroll ? "black" : 'currentColor'} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="block md:hidden sm:ml-[20px] pb-[10px] ml-[0px]">
                                <div className={`font_target  ml-[15px] flex items-baseline space-x-4 relative z-10 tracking-wide ${isScroll ? "text-black font-[500]" : "text-white font-light"}`}>
                                    <Link to="/" className={`px-0 py-1 text-sm border-0 hover:border-b-[1px] transition-all hover:border-solid ${isScroll ? "hover:border-black" : "hover:border-white"} hover:scale-110 transition-all`}>
                                        HOME
                                    </Link>
                                    <div className="relative group"
                                        >
                                        <div  className={`px-0 py-1 text-sm border-0   ${isScroll ? "hover:border-black" : "hover:border-white"} ${isClicked?"hover:border-b-[1px] hover:border-solid ml-[5px] ":""}transition-all `} onClick={()=>{
                                            setIsClicked((prev)=>{
                                                return !prev
                                            })
                                        }}>
                                            SHOP
                                        </div>
                                        <motion.div
                                            className="absolute left-[-100px] top-[30px] w-[100vw] "
                                            variants={categoryContainerVariants}
                                            initial="hidden"
                                            animate={isClicked? "visible":"hidden"}
                                        >
                                            <div className={`categories font-raleway font-[200] ${isScroll? "bg-none font-[400]" : "bg-[rgb(18,18,18)] shadow-lg "} rounded-sm   pb-[10px] w-[110vw] py-[10px]`}>
                                                <div className={`category_container inline-flex flex-row justify-between items-center  ml-[40px]
                                                ${isScroll?"border-[0.6px] shadow-sm bg-white  py-[10px] px-[7px] ":"none"}`}>
                                                   
                                                   <button className="all border-[1px] border-white px-[10px] hover:text-white hover:bg-black hover:scale-105 transition-all duration-300 mr-[10px]" onClick={()=>{
                                                            console.log("heyyy")
                                                            navigate("/shop", { replace: true })
                                                        navigate(0)
                                                        }}>
                                                            All
                                                        </button>

                                                        <div className="relative flex flex-row ">
                            <button 
                                className={`tshirts border-[1px] border-white px-[10px] hover:text-white hover:bg-black  transition-all duration-300 ${isTshirtOpen? "scale-[1.15]":"null"}`}
                                onClick={() => {
                                        
                                        setIsTshirtOpen_mobile((prev)=>!prev)
                                    }}
                                
                                
                            >
                                T-shirts
                            </button>
                             {isTshirtOpen_mobile?(
                                <div 
                                    
                                    className=" flex flex-row "
                                    
                                    
                                    
                                >
                                    <motion.button 
                                        animate={{marginLeft:10,opacity:1}}
                                        initial={{opacity:0.1}}
                                        className={`block w-full text-left px-2  hover:bg-black hover:text-white transition-all duration-150  ${isScroll?null:"border-white border-[1px]"} hover:scale-105`}
                                        onClick={() => {
                                            navigate("/shop?type=frontpage", { replace: true });
                                            navigate(0);
                                        }}
                                    >
                                        Solid
                                    </motion.button>
                                    <motion.button 
                                        animate={{marginLeft:10,opacity:1,transitionDuration:'1s'}}
                                        initial={{opacity:0.1}}
                                        className="block w-full text-left px-2  hover:bg-black hover:text-white transition-all duration-150 border-[1px] border-white hover:scale-105"
                                        onClick={() => {
                                            navigate("/shop?type=printed-oversized-t-shirts", { replace: true });
                                            navigate(0);
                                        }}
                                    >
                                        Printed
                                    </motion.button>
                                </div>
                            ):null}
                        </div>


                                                      
                                                        <button className="hoodies border-[1px] border-white px-[10px] hover:text-white hover:bg-black hover:scale-105 transition-all duration-300 mr-[20px] ml-[10px]" onClick={()=>{
                                                            console.log("heyyy")
                                                            navigate("/shop?type=hoodie", { replace: true })
                                                        navigate(0)
                                                        }}>
                                                            Hoodies
                                                        </button>
                                                 
                                                
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                    <Link to="/contact" className={`px-0 py-1 text-sm border-0 hover:border-b-[1px] transition-all hover:border-solid ml-[10px] ${isScroll ? "hover:border-black" : "hover:border-white"} hover:scale-110 transition-all`}>
                                        CONTACT
                                    </Link>
                                </div>
                            </div>
        </motion.header>
        <WhatsAppChat/>
        <Outlet />
    </div>
}
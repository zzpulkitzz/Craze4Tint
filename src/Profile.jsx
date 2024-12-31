import React, { useContext, useState,useRef } from 'react';
import { User, MapPin, ShoppingBag, Heart, Users, Lock, LogOut } from 'lucide-react';
import { useNavigate ,Outlet,Link} from 'react-router-dom';
import {  Clock, Settings } from 'lucide-react'
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut 
} from 'firebase/auth';


const UserProfile = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyD3AWLH7wYyVy7USofDvCLmiE3_u0q4RPo",
    authDomain: "craze4tint-d7bed.firebaseapp.com",
    projectId: "craze4tint-d7bed",
    storageBucket: "craze4tint-d7bed.firebasestorage.app",
    messagingSenderId: "786218460338",
    appId: "1:786218460338:web:02df030c31eb0f5863d5ab",
    measurementId: "G-X1J18V9CZW"
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const [activeTab, setActiveTab] = useState('My Profile');

  const [activeSlide, setActiveSlide] = useState(0)
  const scrollRef = useRef(null)
  const sidebarItems = [
    { name: 'My Profile', icon: User ,path:"/profile"},
    { name: 'Delivery Address', icon: MapPin, count: 1,path:"addresses" },
    { name: 'My Orders', icon: ShoppingBag, count: 1 ,path:"myorders"},
    { name: 'My Wishlist', icon: Heart, count: 0 ,path:"mywishlist"},
    
    { name: 'Change Password', icon: Lock ,path:"changepass"},
  ];
  const currentUser=JSON.parse(localStorage.getItem('currentUser'))
  console.log(currentUser)
  const navigate=useNavigate()

  const handleSignOutWithFirebase = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Firebase Logout error:', error);
      throw error;
    }
  };


  const scrollTo = (index) => {
    setActiveSlide(index)
    const container = scrollRef.current
    const itemWidth = container.children[0].offsetWidth
    container.scrollTo({
      left: itemWidth * index,
      behavior: 'smooth'
    })
  }

  const handleScroll = (e) => {
    const container = e.target
    const scrollPosition = container.scrollLeft
    const itemWidth = container.children[0].offsetWidth
    const newActiveSlide = Math.round(scrollPosition / itemWidth)
    setActiveSlide(newActiveSlide)
  }
  
  async function logOut(){
    const accessToken = localStorage.getItem('token');
      
    const SHOPIFY_STORE_URL = 'https://ecf084-fb.myshopify.com/api/2024-01/graphql.json';
    const apiToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
    const mutation = `
      mutation customerAccessTokenDelete($customerAccessToken: String!) {
        customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
          deletedAccessToken
          deletedCustomerAccessTokenId
          userErrors {
            field
            message
          }
        }
      }
    `;
  console.log(accessToken)
    try {
      const response = await fetch(SHOPIFY_STORE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': apiToken
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            customerAccessToken: accessToken,
          },
        }),
      });
  
      const data = await response.json();
  
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
  
      if (data.data.customerAccessTokenDelete.userErrors.length > 0) {
        throw new Error(data.data.customerAccessTokenDelete.userErrors[0].message);
      }
      await handleSignOutWithFirebase()
      localStorage.setItem('token',"null")
      localStorage.setItem('currentUser', "null")
      localStorage.setItem("cartId","null")
      navigate("/login")
      return data.data.customerAccessTokenDelete;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  
      }

  return (
    <div className="flex h-screen bg-white text-black font-raleway w-full">
      {/* Sidebar */}
      <div className="sm:block hidden w-64 bg-white p-4 text-gray-800 font-extralight absolute top-[210px] left-[35px] rounded-2xl shadow-lg">
        <div className="mb-8">
         {currentUser.firstName}
          <h2 className="mt-4 text-xl font-semibold">{currentUser?"":currentUser["firstName"]}</h2>
          <p className="text-black text-sm">04:41:38 AM</p>
        </div>
        <nav>
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              className={`w-full flex items-center justify-between p-2 rounded mb-2 ${
                activeTab === item.name ? 'bg-white-700' : 'hover:bg-gray-200'
              }`}
              to={`${item.path}`}
              onClick={() => setActiveTab(item.name)}
            >
              <div className="flex items-center">
                <item.icon className="mr-2 h-5 w-5" />
                <span>{item.name}</span>
              </div>
              {item.count !== undefined && (
                <span className="bg-g px-2 py-1 rounded-full text-xs">{item.count}</span>
              )}
            </Link>
          ))}
          <button className="w-full flex items-center p-2 rounded mb-2 hover:bg-gray-200" onClick={logOut}>
            <LogOut className="mr-2 h-5 w-5" />
            <span>Log Out</span>
          </button>
        </nav>
      </div>
      
      <div className="sm:hidden block max-w-3xl mx-auto px-3 absolute top-[140px]">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory border border-white shadow-md"
        style={{ scrollbarWidth: 'none' }}
        onScroll={handleScroll}
      >
        {sidebarItems.map((item, index) => (
          <Link 
            key={item.label}
            className="flex-none w-1/3 snap-start px-2"
            to={`${item.path}`}
          >
            <div className="flex flex-col items-center p-4 cursor-pointer hover:bg-gray-50 rounded-lg">
              <div className="relative">
                <item.icon className="w-6 h-6 text-navy-600" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-2 text-sm font-medium text-gray-900">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {[1,2].map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              activeSlide === index 
                ? 'bg-gray-900 w-4' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>         

      {/* Main Content */}
      <div className="flex-1 p-8 absolute sm:top-[200px] top-[250px] sm:left-[270px] left-[0px] sm:w-[70%] w-[100%] block">
       <Outlet/>
      </div>
    </div>
  );
};

export default UserProfile;
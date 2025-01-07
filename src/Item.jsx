import { useState, useEffect,useRef,useContext } from 'react';
import { getFirestore, doc, setDoc ,getDoc} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { Button } from '@/components/ui/button';
import { AuthContext } from './contextProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams,useLocation } from 'react-router-dom';
import { fetchPlease } from './Fetch';
import { ChevronUp, ChevronDown } from 'lucide-react'
// Shopify Storefront API configuration
import { AddToCartButton } from "./components/ui/AddToCartButton.jsx"
const apiToken=import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
import Footer from './Footer';
import measure from "./assets/measure.png"
import sizeChart from "./assets/sizeChart.png"
import {X} from "lucide-react"
import Carousel from './components/ui/Carousel.jsx';


const createStorefrontClient = () => {
  
  return {
    query: async (query, variables = {}) => {

      try {
        const response = await fetch(`https://ecf084-fb.myshopify.com/api/2024-01/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': apiToken,
          },
          body: JSON.stringify({ query, variables }),
        });
        console.log("ses")
      
        return response.json();
      } catch (error) {
        console.error('Shopify API Error:', error);
        throw error;
      }
    },
  };
};

export default function Item() {
  
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
  const db = getFirestore(app);
  const {setCartId}=useContext(AuthContext)
  let cartId=localStorage.getItem("cartId")
  console.log(cartId)
  let currentUser=localStorage.getItem("currentUser")
  currentUser=JSON.parse(currentUser)
  const handleCartAction =async ()=>{
    const auth = getAuth();
    const currentUser = auth.currentUser;
    let token=await currentUser.getIdToken()
    console.log(token)
    let cartId=localStorage.getItem("cartId")
   
    if(cartId!=="null"){
      await addToCart(variantId[sizes.indexOf(selectedSize)].node.id,quantity) 
    }else{
      await createCart(variantId[sizes.indexOf(selectedSize)].node.id,quantity)
   
    }
  }
  const { gid } = useParams(); // Expects the GID in the URL like: /products/gid://shopify/Product/1234567890
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [variantId, setVariantId] = useState(null);
  const [variantsProd, setVariantsProd] = useState(null);
  const client = createStorefrontClient();
  const [selectedImage, setSelectedImage] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const thumbnailsRef = useRef(null)
  const [quantity,setQuantity]=useState(1)
  console.log(gid)
  const urlObj = new URL(window.location.href);
  const [extraProd,setExtraProd]=useState([])
  const [isFade,setIsFade]=useState(false)
  const [activeTab, setActiveTab] = useState('size')
  const [selectedSize, setSelectedSize] = useState(null)
  
  const sizes = ['S', 'M', 'L', 'XL']
// Get the 'name' parameter from the URL
const productName = urlObj.searchParams.get("name");
const visibleThumbnails = 4
// Decode the parameter (to handle URL-encoded characters)
const prodName = decodeURIComponent(productName);



  useEffect(() => {
    if (thumbnailsRef.current) {
      thumbnailsRef.current.style.transform = `translateY(-${startIndex * 88}px)`
    }
  }, [startIndex])

  useEffect(() => {
    if (!gid) return;
    
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      
      
      try {
        // Decode the GID from the URL if needed
     
        
        const { data } = await client.query(`
          query getProduct($id: ID!) {
            product(id: $id) {
              id
              title
              description
              handle
              availableForSale
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 10) {
                edges {
                  node {
                    url
                    altText
                    width
                    height
                  }
                }
              }
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    priceV2 {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              options {
                name
                values
              }
            }
          }
        `, {
          id: `gid://shopify/Product/${gid}`,
        });

        if (data?.product) {
          const formattedProduct = {
            ...data.product,
            images: data.product.images.edges.map(({ node }) => node),
            variants: data.product.variants.edges.map(({ node }) => node),
          };
          formattedProduct.options.push({name:"Quantity",values:[1,2,3,4,5,6,7,8,9,10]})
          console.log(formattedProduct)
          setProduct(formattedProduct);
          // Set the first available variant as selected by default
          if (formattedProduct.variants.length > 0) {
            setSelectedVariant(formattedProduct.variants[0]);
          }
        } else {
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    
    


    const getVariantID=async()=>{
      let variantQuery=`query getVariantID($id: ID!) {
        product(id: $id) {
          id
          title
          variants(first: 5) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }`
      try{
        const data = await client.query(variantQuery,{
          id:`gid://shopify/Product/${gid}`
      })

      console.log(data.data.product.variants.edges)
      setVariantId(()=>{
        return data.data.product.variants.edges
      })
    }catch(error){
      console.log(error)
    }
  }
  getVariantID()
  
  const fetchVariants=async()=>{
      try{
        let data=await fetchPlease(null,prodName,null)
        console.log(data)
        console.log("fejdbsnvjebdsvjbs")
        console.log("jsjvnjs")
        setVariantsProd(()=>{
        console.log(data.products.edges)
        return data.products.edges.map(edge => {
          return {
            id: edge.node.id,
            name: edge.node.title,
            price: parseFloat(edge.node.priceRange.minVariantPrice.amount),
            originalPrice: edge.node.variants.edges[0]?.node.compareAtPrice?.amount || 
                          (parseFloat(edge.node.priceRange.minVariantPrice.amount) * 1.5),
            image: edge.node.images.edges[0]?.node.url,
            image2: edge.node.images.edges[1]?.node.url,
            
            isBestSeller: edge.node.tags.includes('best-seller')
        
            
        }})})
      }catch(error){
        console.log(error)
        console.log("jhodvs")
      }
  }
  fetchVariants()
   const fetchExtraProd=async()=>{
      try{
        let data=await fetchPlease(null,null,null,"12","BEST_SELLING")
        console.log(data)
        console.log("fejdbsnvjebdsvjbs")
        console.log("jsjvnjs")
        setExtraProd(()=>{
          
        console.log(data.products.edges)
        return data.products.edges.map(edge => {
          return {
            id: edge.node.id,
            name: edge.node.title,
            price: parseFloat(edge.node.priceRange.minVariantPrice.amount),
            originalPrice: edge.node.variants.edges[0]?.node.compareAtPrice?.amount || 
                          (parseFloat(edge.node.priceRange.minVariantPrice.amount) * 1.5),
            image: edge.node.images.edges[0]?.node.url,
            image2: edge.node.images.edges[1]?.node.url,
            isBestSeller: edge.node.tags.includes('best-seller')
        
            
        }})})
      }catch(error){
        console.log(error)
        console.log("jhodvs")
      }
  }
  fetchExtraProd()
  
  }, [gid]);
  
  
 
  console.log(extraProd)
  const getOptionValues = (optionName) => {
    return product?.options.find(opt => opt.name === optionName)?.values || [];
  };

  const findVariantByOptions = (selectedOptions) => {
    return product?.variants.find(variant => 
      variant.selectedOptions.every(
        option => selectedOptions[option.name] === option.value
      )
    );
  };

  const handleOptionChange = (optionName, value) => {
    const currentOptions = selectedVariant?.selectedOptions.reduce(
      (acc, opt) => ({ ...acc, [opt.name]: opt.value }),
      {}
    ) || {};

    const newOptions = {
      ...currentOptions,
      [optionName]: value,
    };

    const newVariant = findVariantByOptions(newOptions);
    if (newVariant) {
      setSelectedVariant(newVariant);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const createCart = async (variantId, quantity) => {
    console.log(variantId);
    try {
      const  {data}  = await client.query(`
        mutation createCart($input: CartInput!) {
          cartCreate(input: $input) {
            cart {
              id
            }
            userErrors {
              message
            }
          }
        }
      `, {
        input: {
          lines: [
            {
              quantity,
              merchandiseId:variantId ,
            },
          ],
        },
      });
      console.log(data)

      if (data?.cartCreate?.cart?.id) {
        localStorage.setItem("cartId",data.cartCreate.cart.id)
        
      if (currentUser) {
        console.log(currentUser.email)
        console.log(data.cartCreate.cart.id)
        // Store cart ID in Firestore
        try {
          const auth = getAuth();
          const currentUser = auth.currentUser;
          let token=await currentUser.getIdToken()
          console.log(token)
          setCartId(currentUser.email,data.cartCreate.cart.id)
        } catch (error) { 
          console.log(error)
        }
      } else {
        console.log('No user found in localStorage');
      }
    }
  } catch (error) {
    if (error.code === 'permission-denied') {
      console.error('Permission denied:', {
        message: error.message,
        details: error.details,
        timestamp: new Date().toISOString(),
        operation: 'read',
        collection: 'users',
        docId: '123'
      });
      
   
    }
  }
};
      
      

  // Add item to existing cart
  

  

  const addToCart = async (variantId, quantity) => {
    console.log(variantId)
    console.log(cartId)
    

    try {
      const { data } = await client.query(`
        mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              id
            }
            userErrors {
              message
            }
          }
        }
      `, {
        cartId,
        lines: [
          {
            quantity,
            merchandiseId: variantId,
          },
        ],
      });

     console.log(data)
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

 

  const handlePrevious = () => {
    setStartIndex(Math.max(0, startIndex - 1))
  }

  const handleNext = () => {
    setStartIndex(Math.min(product.images.length - visibleThumbnails, startIndex + 1))
  }
 
 

 

  return (
 
    <div className="w-screen  px-4 sm:px-6 lg:px-8  py-8 absolute sm:top-[120px] md:top-[110px] top-[90px] xl:flex xl:justify-center xl:items-center xl:flex-col overflow-x-hidden">
      <div className="w-[100%] xl:max-w-[1532px] ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}


        <div className='block sm:hidden w-[100%]'>
        <Carousel images={product.images} />
        </div>


        <div className='hidden sm:block'>
        <div className="flex gap-4 w-[100%]  ">
      {/* Thumbnails */}
      
      <div className=" ">
     
     
        <div className="overflow-hidden relative">
          <div
            ref={thumbnailsRef}
            className="flex flex-col gap-2 transition-transform duration-300 ease-in-out"
          >
        {product.images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-20 h-20 border-2 rounded overflow-hidden ${
              selectedImage === index 
                ? 'border-blue-500' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              className=" w-[80px]"
            />
          </button>
        ))}
      </div>
      </div>
       
      </div>
      {/* Main Image */}
      
      <div className="  rounded   ">
        <img
          src={product.images[selectedImage].url}
          alt={product.images[selectedImage].alt}
          className=" main_image w-[100%] sticky top-10"
        />
      </div>
     
    </div>
    </div>

        {/* Product Details */}
        <div className="space-y-4 font-raleway">
          <div className="text-3xl xl:text-4xl font-bold">{product.title}</div>
          <div className="text-xl font-[600] font-roboto flex flex-col ">
            <div>
            {selectedVariant
              ? `${selectedVariant.priceV2.currencyCode} ${selectedVariant.priceV2.amount}`
              : `From ${product.priceRange.minVariantPrice.currencyCode} ${product.priceRange.minVariantPrice.amount}`}
              </div>
              <span className='text-[12px] font-thin'>
              (incl. of all taxes)
              </span>
          </div>
         
      <div className='font-bold font-raleway'>Colors: <span className='font-normal'>{product.title}</span></div>
      <div className='extra_prod_container grid grid-cols-5 gap-x-4 gap-y-2'>
      {variantsProd?variantsProd.map((product, index) => 
            
            {
              console.log(product.name)
              return (
              <div
                key={`${product.id}-${index}`}
               
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-110 transition-all duration-150"
                onClick={() => window.location.href = `/shop/${product.id}?name=${product.name}`}
              >
                <div className="relative">
                  <img src={product.image} alt={product.name} className="  object-cover" />
                  {product.isBestSeller && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
                      BEST SELLER
                    </div>
                  )}
               
                </div>
               
              </div>
              )}):""}
           
                </div>

          

          

          {/* Product Options */}
          <div className="space-y-4">
            
          <div className="max-w-md  py-6">
      <h2 className="text-sm xl:text-lg font-medium tracking-wider mb-4">SELECT A SIZE</h2>
      <div className="flex gap-4">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`
              w-9 h-10 xl:w-14 xl:h-14 
              flex items-center justify-center 
              rounded-lg 
              border-[1.6px]
              font-[500]
              transition-all 
              duration-200 
              hover:border-black 
              hover:bg-black
              hover:text-white text-[12px]
              ${
                selectedSize === size
                  ? 'border-black bg-black text-white'
                  : 'border-black '
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
          
          </div>
          
          <div className="size_chart px-1 py-2 bg-[rgb(245,244,244)] border border-solid border-black w-[100%] flex justify-center items-center tracking-wider text-[14px] flex-row " onClick={()=>setIsFade(()=>true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ruler"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>
            <span className='ml-[6px] font-[400] mr-[5px] font-raleway'>SIZE CHART</span>
          </div>

          {selectedVariant?.availableForSale? (selectedSize?<div onClick={handleCartAction} disabled={!selectedVariant?.availableForSale} ><AddToCartButton item={product}  className="w-full"/>
            </div>:
            <div >
            <Button className="w-[100%]"> SELECT A SIZE 
            </Button>
            </div>
            ):<div>OUT OF STOCK</div>}

          {/* Additional product details */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg xl:text-xl font-medium">Product Details</h3>
            <div className="mt-4 space-y-2 xl:text-xl">
            <div className="prose  xl:text-lg font-raleway"  >

            <ul className='list-disc pl-[10px]'>
              <li>
                Printed Oversized T-shirts Made.</li>
                <li>Crafted from soft, breathable fabric </li>
                <li>For maximum comfort </li>
                <li>Perfect for any occasion – dress up or keep it casual </li>
                <li>Available in Small, Medium, Large, and Extra Large sizes </li>
                <li>Relaxed fit designed to flatter every body type </li>
                <li>Wear Your Confidence with this versatile wardrobe staple </li>
                <li>Shop now and check the size chart image to find your perfect fit. </li>
                <li>7 Days Return Policy</li>
                <li>Availability: {selectedVariant?.availableForSale ? 'In Stock' : 'Out of Stock'}</li>
            </ul>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-[7vh]">
        <h1 className='font-smeibold text-3xl xl:text-4xl my-[20px] mx-auto flex justify-center'>YOU MAY ALSO LIKE</h1>
      <div className='extra_prod_container grid  grid-cols-4 gap-6 '>
      {extraProd.map((product, index) => 
            
            {
              console.log(product.name)
              return (
              <div
                key={`${product.id}-${index}`}
               
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                onClick={() => window.location.href = `/shop/${product.id}?name=${product.name}`}
              >
                <div className="relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="  object-cover opacity-100 hover:opacity-0" />
                  <img src={product.image2} alt={product.name} className="  object-cover absolute top-0 opacity-0 hover:opacity-100 transition-all duration-300" />

                  {product.isBestSeller && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
                      BEST SELLER
                    </div>
                  )}
               
                </div>
                <div className="sm:p-3 p-0">
                  <h3 className="hidden sm:block text-sm font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex justify-between items-center sm:mb-3 mb-1">
                    <div>
                      <span className="sm:text-lg text-[10px] sm:font-bold font-[300]">₹{product.price}</span>
                      <span className="text-[8px] sm:text-xs text-gray-500 line-through sm:ml-2 ml-1 inline ">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-xs text-green-600 ml-2 hidden sm:inline">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                 
                </div>
              </div>
              )})}

                </div>
                </div>
                </div>
    <div className='relative top-[32px] left-[-16px] sm:left-[-24px] lg:left-[-32px] '>
      
    <Footer/>
    </div>
    {isFade?(<div><div className=' flex justify-center items-center fixed top-0 w-screen h-screen z-50'>
    <div className='fade bg-black absolute top-[50%] left-[50%] translate-x-[-60vw] translate-y-[-60vh] h-[120vh] w-[120vw] z-50 opacity-45 '>
      
    

    </div>
    </div>
    
    <div className={`w-[70vw] h-[70vh] mx-auto px-4 pb-6 pt-3 bg-white fixed top-[50vh] left-[50vw] translate-x-[-35vw] translate-y-[-35vh] z-[60] flex flex-col  items-center font-raleway`}>
    
    <div className='className="text-gray-400 hover:text-gray-600 flex justify-end items-end w-[100%]'>
    <button onClick={() => {
        setActiveTab("size")
        setIsFade(false)
    }} >
                  <X size={20} />
      </button>
      </div>
      {/* Tab Headers */}
      <div className="flex space-x-12 border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('size')}
          className={`pb-4 relative ${
            activeTab === 'size' 
              ? 'text-black font-medium' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          SHIRT SIZE CHART
          {activeTab === 'size' && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('measure')}
          className={`pb-4 relative ${
            activeTab === 'measure' 
              ? 'text-black font-medium' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          HOW TO MEASURE
          {activeTab === 'measure' && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className='overflow-scroll'>
     <img src={activeTab==="size"?sizeChart:measure} className="w-[100%] object-contain">
     
     
     </img>
     </div>
      

      
      </div></div>):""}
    </div>
  );
}
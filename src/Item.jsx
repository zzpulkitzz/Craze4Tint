import { useState, useEffect,useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams,useLocation } from 'react-router-dom';
import { fetchPlease } from './Fetch';
import { ChevronUp, ChevronDown } from 'lucide-react'
// Shopify Storefront API configuration
import { AddToCartButton } from "./components/ui/AddToCartButton.jsx"
const apiToken=import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN




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
  const handleCartAction =async ()=>{
    console.log(localStorage.getItem("cartId"))
    if(localStorage.getItem("cartId")!=="null"){
      console.log("yo")
      await addToCart(variantId,1) 
    }else{
      console.log("trying")
      await createCart(variantId,1)
   
    }
  }
  const { gid } = useParams(); // Expects the GID in the URL like: /products/gid://shopify/Product/1234567890
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [variantId, setVariantId] = useState(null);
  const client = createStorefrontClient();
  const [selectedImage, setSelectedImage] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const thumbnailsRef = useRef(null)
  console.log(gid)
  const urlObj = new URL(window.location.href);
  const [extraProd,setExtraProd]=useState([])
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
          variants(first: 1) {
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

      console.log(data.data.product.variants.edges[0].node.id)
      setVariantId(()=>{
        return data.data.product.variants.edges[0].node.id
      })
    }catch(error){
      console.log(error)
    }
  }
  getVariantID()
  
  const fetchExtraProd=async()=>{
      try{
        let data=await fetchPlease(null,prodName,null)
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
        localStorage.setItem('cartId', data.cartCreate.cart.id);
        console.log(localStorage.getItem('cartId'))
      
      }
    } catch (error) {
      console.error('Error creating cart:', error);
    }
  };

  // Add item to existing cart
  

  

  const addToCart = async (variantId, quantity) => {
    const cartId = localStorage.getItem('cartId');
   

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 absolute sm:top-[120px] md:top-[110px] top-[90px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className=''>
        <div className="flex gap-4 max-w-4xl h-[420px] sticky top-[20px] ">
      {/* Thumbnails */}
      
      <div className="flex flex-col gap-2 h-[410px] ">
      <button
          onClick={handlePrevious}
          disabled={startIndex === 0}
          className="p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center mx-auto"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
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
        <button
          onClick={handleNext}
          disabled={startIndex >= product.images.length - visibleThumbnails}
          className="py-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center w-[30px] mx-auto"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      {/* Main Image */}
      <div className="flex-1 aspect-square rounded overflow-hidden">
        <img
          src={product.images[selectedImage].url}
          alt={product.images[selectedImage].alt}
          className="w-30vw "
        />
      </div>
    </div>
    </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          
         
      <div className='font-bold font-raleway'>Colors: <span className='font-normal'>{product.title}</span></div>
      <div className='extra_prod_container grid grid-cols-5 gap-x-4 gap-y-2'>
      {extraProd.map((product, index) => 
            
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
              )})}
           
                </div>

          <div className="text-2xl font-semibold">
            {selectedVariant
              ? `${selectedVariant.priceV2.currencyCode} ${selectedVariant.priceV2.amount}`
              : `From ${product.priceRange.minVariantPrice.currencyCode} ${product.priceRange.minVariantPrice.amount}`}
          </div>

          <div className="prose" dangerouslySetInnerHTML={{ __html: product.description }} />

          {/* Product Options */}
          <div className="space-y-4">
            {product.options.map((option) => (
              <div key={option.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {option.name}
                </label>
                <Select
                  value={selectedVariant?.selectedOptions.find(opt => opt.name === option.name)?.value}
                  onValueChange={(value) => handleOptionChange(option.name, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${option.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getOptionValues(option.name).map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {selectedVariant?.availableForSale? <div onClick={handleCartAction} disabled={!selectedVariant?.availableForSale} ><AddToCartButton item={product}  className="w-full"
            
            /></div>:<div>Out of Stock</div>}

          {/* Additional product details */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium">Product Details</h3>
            <div className="mt-4 space-y-2">
              <p>SKU: {selectedVariant?.id.split('/').pop()}</p>
              <p>Availability: {selectedVariant?.availableForSale ? 'In Stock' : 'Out of Stock'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="">
        <h1 className='font-smeibold text-3xl my-[20px] mx-auto flex justify-center'>YOU MAY ALSO LIKE</h1>
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
                <div className="relative">
                  <img src={product.image} alt={product.name} className="  object-cover" />
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
  );
}
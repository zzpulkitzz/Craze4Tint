import { useState, useEffect, useRef, useCallback } from 'react'
import { Star, Heart } from 'lucide-react'
import {redirect, useLocation,useNavigate} from "react-router-dom"
import {fetchPlease} from "./Fetch.jsx"
const PRODUCTS_PER_PAGE = 12;
import Error from './Error.jsx';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [openSection, setOpenSection] = useState("size"); // Track which filter section is open
  const location = useLocation();
  // Parse query parameters from the location.search string
  const queryParams = new URLSearchParams(location.search);
  const search= queryParams.get("search");
  const type=queryParams.get("type")
  const navigate=useNavigate()
  console.log(search,type)
  // Create an intersection observer reference
  const observer = useRef();

  function mergeSort(arr) {
    // Base case: Arrays with a single element are already sorted
    if (arr.length <= 1) {
      return arr;
    }
  
    // Split the array into two halves
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
  
    // Recursively sort both halves and then merge them
    return merge(mergeSort(left), mergeSort(right));
  }
  
  function merge(left, right) {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;
  
    // Compare elements from both arrays and merge them in sorted order
    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex].priority < right[rightIndex].priority) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }
  
    // Concatenate any remaining elements
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }

  const lastProductRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreProducts("retain");
      }
    });
    
    
      if (node) observer.current.observe(node)

    
        
  }, [loading, hasMore]);

  

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => {
      // If size exists in array, remove it; otherwise, add it
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
   

  };

  const handleColorChange = (color) => {
    setSelectedColors(prev => {
      // If color exists in array, remove it; otherwise, add it
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      } else {
        return [...prev, color];
      }
    });
    
  };

 


 
  // Function to fetch products with filters
  const fetchMoreProducts = async (msg) => {
    if (loading) return;
    
    setLoading(true);
    try {
      console.log(selectedColors,selectedSizes)
      
  
      let data = msg==="retain"? await fetchPlease(type,search,cursor): await fetchPlease(type,search,null)
      
      console.log(data)
      
     
      const filteredProducts = data.products.edges
      .map(edge => {

        let price=parseInt(edge.node.priceRange.minVariantPrice.amount)
        if(price>priceRange[1]){
          return null
        }
        const variants = edge.node.variants.edges;
        const availableSizes = []; // Changed from Set to Array
        const availableColors = []; // Changed from Set to Array
        
        variants.forEach(variant => {
          variant.node.selectedOptions.forEach(option => {
            if (option.name === 'Size' && !availableSizes.includes(option.value)) {
              availableSizes.push(option.value);
            }
            if (option.name === 'Color' && !availableColors.includes(option.value)) {
              availableColors.push(option.value);
            }
          });
        });
       
        // Filter based on selected sizes and colors
        if (
          (selectedSizes.length > 0 && !selectedSizes.some(size => availableSizes.includes(size))) ||
          (selectedColors.length > 0 && !selectedColors.some(color => availableColors.includes(color)))
        ) {
          return null;
        }

        
        
        return {
          id: edge.node.id,
          name: edge.node.title,
          price: parseFloat(edge.node.priceRange.minVariantPrice.amount),
          originalPrice: edge.node.variants.edges[0]?.node.compareAtPrice?.amount || 
                        (parseFloat(edge.node.priceRange.minVariantPrice.amount) * 1.5),
          image: edge.node.images.edges[0]?.node.url,
          image2:edge.node.images.edges[1]?.node.url,
          isBestSeller: edge.node.tags.includes('best-seller'),
       
          availableSizes,
          availableColors,
          priority:parseInt(edge.node.tags[0])
        };
      })
      .filter(product => product !== null);
      console.log(filteredProducts)
      if(msg==="retain"){
        setProducts(prevProducts => {
        if (!data.products.pageInfo.hasNextPage) {
          console.log("no neext page")
          setCursor(null);
          
            return [...prevProducts, ...filteredProducts];
        
          
        }
          setCursor(data.products.pageInfo.endCursor);
          return [...prevProducts, ...filteredProducts];
    
      })
      }else{
        setProducts(prevProducts => {
          
            setCursor(data.products.pageInfo.endCursor);
            return [ ...filteredProducts];
      
        })
      }

    
    
    setHasMore(data.products.pageInfo.hasNextPage);
  } catch (error) {
    console.log("Error:", error.message);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};


  
  useEffect(() => {
    fetchMoreProducts("clear");
    console.log(priceRange)
  }, [selectedColors,selectedSizes,priceRange]); 
  console.log(products)
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = ["White", "Black", "Pink", "Red", "Blue", "Green"];

  if (error) return <div className='absolute  w-[100vw]'><Error/></div>;

  return (
    <div className="mx-auto px-6 py-8 absolute md:top-[140px] top-[90px] w-full font-raleway">
      <div className="flex flex-col lg:flex-row lg:justify-between w-full lg:gap-4">
        {/* Sidebar with filters */}
        <aside className="w-full lg:w-56 space-y-2 mb-[15px] font-light ">
         
          <div className="border rounded-lg overflow-hidden">
            <button 
              className="w-full px-4 py-2 text-left  flex justify-between items-center"
              onClick={() => setOpenSection(openSection === "size" ? "" : "size")}
            >
              Size
              <span>{openSection === "size" ? "−" : "+"}</span>
            </button>
            {openSection === "size" && (
              <div className="p-4 border-t">
                {sizes.map((size) => (
                  <label key={size} className="flex items-center space-x-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{size}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="border rounded-lg overflow-hidden">
            <button 
              className="w-full px-4 py-2 text-left flex justify-between items-center"
              onClick={() => setOpenSection(openSection === "price" ? "" : "price")}
            >
              Price
              <span>{openSection === "price" ? "-" : "+"}</span>
            </button>
            {openSection === "price" && (
              <div className="p-4 border-t">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            )}
          </div>

          {/* Color Filter */}
          <div className="border rounded-lg overflow-hidden">
            <button 
              className="w-full px-4 py-2 text-left  flex justify-between items-center"
              onClick={() => setOpenSection(openSection === "color" ? "" : "color")}
            >
              Color
              <span>{openSection === "color" ? "−" : "+"}</span>
            </button>
            {openSection === "color" && (
              <div className="p-4 border-t">
                {colors.map((color) => (
                  <label key={color} className="flex items-center space-x-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      
                      onChange={() => {
                        console.log(color)
                        navigate(`/shop?search=${color}`)
                        navigate(0)
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{color}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Product grid */}
        <main className="flex-1">
          <div className="grid xsm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xsm:gap-3">
            {products.map((product, index) => 
            
            {
              console.log(product.name)
              return (
              <div
                key={`${product.id}-${index}`}
                ref={index === products.length - 1 ? lastProductRef : null}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                onClick={() => window.location.href = `/shop/${product.id}?name=${product.name}`}
              >
                <div className="relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full xsm:h-[220px] md:h-[430px] object-cover xl:h-[27vw] opacity-100 hover:opacity-0" />
                  <img src={product.image2} alt={product.name} className="absolute top-0 w-full xsm:h-[220px] md:h-[430px] object-cover xl:h-[27vw] opacity-0 hover:opacity-100 transition-all duration-300" />
                  {/* {product.isBestSeller && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
                      BEST SELLER
                    </div>
                  )} */}
               
                </div>
                <div className="p-[6px] pl-[9px]">
                  <h3 className="xl:text-[1.15rem] text-lg xsm:text-[1rem] leading-[1.4rem] font-normal mb-1 line-clamp-2">{product.name}</h3>
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="xl:text-2xl font-normal xsm:text-sm">₹{product.price}</span>
                      <span className="text-xs text-gray-500 line-through ml-2">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-xs text-green-600 ml-2">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                 
                </div>
              </div>
            )})}
          </div>
          {loading && (
            <div className="text-center py-4">
              Loading more products...
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
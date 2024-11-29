import { useState, useEffect, useRef, useCallback } from 'react'
import { Star, Heart } from 'lucide-react'
import {redirect, useLocation,useNavigate} from "react-router-dom"
import {fetchPlease} from "./Fetch.jsx"
const PRODUCTS_PER_PAGE = 12;

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

 


  let apiToken=import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
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
          isBestSeller: edge.node.tags.includes('best-seller'),
       
          availableSizes,
          availableColors
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
    console.error("Error:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};


  
  useEffect(() => {
    fetchMoreProducts("clear");
  }, [selectedColors,selectedSizes]); 
  console.log(products)
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = ["White", "Black", "Pink", "Red", "Blue", "Green"];

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mx-auto px-6 py-8 absolute top-[220px] w-full">
      <div className="flex flex-col lg:flex-row lg:justify-between w-full lg:gap-4">
        {/* Sidebar with filters */}
        <aside className="w-full lg:w-56 space-y-6">
          <h2 className="text-2xl font-bold">FILTERS</h2>
          {/* Size Filter */}
          <div className="border rounded-lg overflow-hidden">
            <button 
              className="w-full px-4 py-2 text-left font-medium flex justify-between items-center"
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
              className="w-full px-4 py-2 text-left font-medium flex justify-between items-center"
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
              className="w-full px-4 py-2 text-left font-medium flex justify-between items-center"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-[430px] object-cover" />
                  {product.isBestSeller && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
                      BEST SELLER
                    </div>
                  )}
               
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-lg font-bold">₹{product.price}</span>
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
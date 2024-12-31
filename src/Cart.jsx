import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, MessageSquare } from 'lucide-react'

import { useEffect,createContext } from 'react'
import secureCheckout from "./assets/secureCheckout.png"
import Footer from "./Footer"
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
        return response.json();
      } catch (error) {
        console.error('Shopify API Error:', error);
        throw error;
      }
    },
  };
};

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const client = createStorefrontClient();

  // Fetch or create cart on component mount
  useEffect(() => {
    const initializeCart = async () => {
      const cartId = localStorage.getItem('cartId');
      console.log(cartId)
      if (cartId) {
        await fetchCart(cartId);
      } 
    };

    initializeCart();
  }, []);
  
  // Fetch existing cart
  const fetchCart = async (cartId) => {
    setIsLoading(true);
    try {
      const { data } = await client.query(`
        query getCart($cartId: ID!) {
          cart(id: $cartId) {
            id
            checkoutUrl
            lines(first: 50) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      priceV2 {
                        amount
                        currencyCode
                      }
                      product {
                        id
                        title
                        featuredImage {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `, {
        cartId,
      });
      
      if (data?.cart) {
        const formattedItems = data.cart.lines.edges.map(({ node }) => ({
          merchandiseId:node.merchandise.id,
          id: node.id,
          productId:node.merchandise.product.id,
          name: node.merchandise.product.title,
          price: parseFloat(node.merchandise.priceV2.amount),
          quantity: node.quantity,
          image: node.merchandise.product.featuredImage?.url,
          size: node.merchandise.title.split(' / ')[0],
          color: node.merchandise.title.split(' / ')[1],
        }));
        console.log(data)
        localStorage.setItem('checkoutUrl',data.cart.checkoutUrl);

        console.log(formattedItems)
        setCartItems(formattedItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
    setIsLoading(false);
  };

  // Create new cart
  const onCheckout=()=>{
    fetchCart()
    let checkoutUrl=localStorage.getItem("checkoutUrl")
    console.log(checkoutUrl)
    window.location.href=checkoutUrl
  }
  const updateQuantity = async (id, newQuantity) => {
    console.log(Math.max(1, newQuantity))
    const cartId = localStorage.getItem('cartId');
    setCartItems((prev)=>{

      let f=prev.map((item)=>{
        if(item.id===id){
          item.quantity= Math.max(1, newQuantity)
        }
        return item
      })
      return f
    })
    if (!cartId) return;

    try {
      let {data}=await client.query(`
        mutation updateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) {
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
            id:id,
            quantity: Math.max(1, newQuantity),
          },
        ],
      });
      console.log(cartId)
      console.log(id)
      console.log(data);
      
      
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (id) => {
    const cartId = localStorage.getItem('cartId');
    console.log(cartId)
    if (!cartId) return;

    try {
      let res=await client.query(`
        mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
        lineIds: [id],
      });
      
      console.log(res)
      await fetchCart(cartId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if(isLoading) {
    console.log("dsvd")
    return <div className="flex justify-center items-center h-screen">No items added in the cart</div>;
  }else{
  console.log(isLoading)
  return (
    <div className="max-w-[100vw] mx-auto px-[16px] sm:px-[24px] lg:px-[32px] absolute top-[150px]  w-[100%]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">SHOPPING BAG ({cartItems.length})</h1>
        
      </div>
      
      <div className="space-y-6">
        {cartItems.map(item => (
          <div key={item.id} className="flex border-b pb-6" >
            <img src={item.image} alt={item.name} className="w-40 h-52 object-cover mr-6 " onClick={() => window.location.href = `/shop/${item.productId}?name=${item.name}`}/>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-lg">₹ {item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{item.size} | {item.color}</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-center mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8"
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="no-arrows w-12 h-8 text-center mx-2"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      
      
      <div className="flex justify-between items-center mt-6">
        <div>
          <p className="font-semibold">TOTAL</p>
          <p className="text-sm text-gray-600">INCLUDING GST</p>
          <p className="text-sm text-gray-600">* EXCL SHIPPING COST</p>
        </div>
        <p className="text-xl font-semibold">₹ {total.toFixed(2)}</p>
      </div>
      
      <Button className="w-full mt-6 bg-black text-white hover:bg-gray-800 tracking-widest font-raleway font-[500]" onClick={onCheckout}>
        CHECKOUT
      </Button>
      <div className="secureCheckout">
        <img src={secureCheckout} className="w-[40%] mx-auto mt-[10px]"/>
      </div>
      <div className='relative top-[32px] left-[-16px] sm:left-[-24px] lg:left-[-32px] '>
        <Footer/>
    </div>
    </div>
  )}
}
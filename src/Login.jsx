import { useState, useContext, createContext } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Outlet } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import Signup from './Signup';
import Footer from './Footer';
import { getFirestore, doc, setDoc ,getDoc} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { AuthContext } from './contextProvider';
export const HandleLoginContext = createContext()

export default function Login() {
  

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

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isReg, setIsReg] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    const {currentUser,changeCurrentUser}=useContext(AuthContext)
   
    const apiToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    const onsubmit = async(e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        await handleLogin(email, password);
      } catch (err) {
        // Error is handled in handleLogin
      } finally {
        setIsLoading(false);
      }
    }

    let chngIsLoading=(bla)=>{
      setIsLoading(()=>bla)
    }
    const handleLogin = async (email, password) => {
      const loginMutation = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;
  
      try {
          const response = await fetch("https://ecf084-fb.myshopify.com/api/2024-01/graphql.json", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': apiToken
            },
            body: JSON.stringify({
              query: loginMutation,
              variables: {
                input: {
                  email,
                  password,
                },
              },
            }),
          });
          let data = await response.json();
          console.log(data);
          console.log(data.data.customerAccessTokenCreate);
          if (data.data.customerAccessTokenCreate.customerUserErrors.length === 0) {
            localStorage.setItem("token", data.data.customerAccessTokenCreate.customerAccessToken.accessToken);
            await getUserInfo(data.data.customerAccessTokenCreate.customerAccessToken.accessToken);
            
            return null;
          } else {
            throw new Error(data.data.customerAccessTokenCreate.customerUserErrors[0].message);
          }
      } catch (error) {
          console.log('Login error:', error);
          setError(error.message);
          setTimeout(() => {
            setError(null);
          }, 3000);
      }
    }

    async function getUserInfo(token) {
      console.log(token);
      const userInfoQuery = `query {
        customer(customerAccessToken: "${token}") {
          id
          firstName
          lastName
          email
          phone
          addresses(first: 5) {
            edges {
              node {
                address1
                city
                country
              }
            }
          }
        }
      }`;
            
      try {
        const response = await fetch("https://ecf084-fb.myshopify.com/api/2024-01/graphql.json", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': apiToken
          },
          body: JSON.stringify({
            query: userInfoQuery,
            variables: {
              input: {
                token
              },
            },
          }),
        });
        let data = await response.json();
        changeCurrentUser(data.data.customer);
        console.log(data.data.customer);
        let userInfo = JSON.stringify(data.data.customer);
        localStorage.setItem("currentUser", userInfo);
        let cartId= await getCartIdForUser(data.data.customer.email)
        console.log(cartId)
        localStorage.setItem('cartId', cartId);
        navigate("/");
        return null;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    }

    const getCartIdForUser = async (email) => {
      try {
        // Get reference to the user's document
        const userCartRef = doc(db, 'userCarts', email);
        
        // Get the document
        const docSnap = await getDoc(userCartRef);
        
        if (docSnap.exists()) {
          // Document exists - return the cartId
          return docSnap.data().cartId;
        } else {
          // No document found for this email
          console.log("No cart found for this user");
          return null;
        }
      } catch (error) {
        console.error("Error fetching cart ID:", error);
        return null;
      }
    }

    

  return (
    <HandleLoginContext.Provider value={{handleLogin, getUserInfo,isLoading,chngIsLoading}}>
      <div className='absolute top-[calc(50vh-150px)] flex flex-col gap-y-32'>
        <div className="w-[100%] flex justify-center flex-col">
          <div className='flex flex-col items-center'>
            {isReg ? 
              <div className="px-[30px] py-[10px] w-[350px] md:w-[450px]">
                <h1 className="text-l font-light text-center text-gray-700">LOGIN</h1>
                
                <form className="flex flex-col justify-between gap-y-10 mt-[20px]">
                  <div>
                    <Label htmlFor="email" className="text-sm font-light text-gray-700">
                      EMAIL
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="mt-1 w-full border-gray-400 border-0 border-b-[1px] focus:border-black rounded-[0px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-light text-gray-700">
                      PASSWORD
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="mt-1 w-full border-gray-400 focus:border-black focus:ring-0 border-0 border-b-[1px] rounded-[0px]"
                    />
                  </div>
                  <div className="text-sm mt-[10px]">
                    <a href="#" className="font-light text-gray-600 hover:text-gray-500">
                      FORGOT YOUR PASSWORD?
                    </a>
                  </div>
                  <Button 
                    type="submit" 
                    onClick={onsubmit} 
                    disabled={isLoading}
                    className="w-full bg-black text-white hover:bg-gray-800 font-light"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'SIGN IN'
                    )}
                  </Button>
                </form>
              </div> 
              : 
              <Signup/>
            }
            <div className="font-[200] w-[50px] text-gray-600" onClick={() => !isLoading && setIsReg((prev) => !prev)}>
              {isReg ? <span className='hover:underline'>REGISTER</span> : <span className='hover:underline'>LOGIN</span>}
            </div>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-600 text-[16px] text-center mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                {error=="Unidentified customer"?"Wrong Credentials":error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <Footer/>
      </div>
    </HandleLoginContext.Provider>
  );
}
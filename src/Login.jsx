import { useState, useContext,createContext } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate,Outlet } from 'react-router-dom';
import {createStorefrontApiClient} from '@shopify/storefront-api-client';
import { AuthContext } from './contextProvider';
import Signup from './Signup';

export const HandleLoginContext=createContext()
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isReg,setIsReg]=useState(true)
    const navigate = useNavigate();
    const {currentUser,changeCurrentUser}=useContext(AuthContext)
   
    const apiToken=import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
    const onsubmit=async(e)=>{
      e.preventDefault()
      await handleLogin(email,password)
      
    }
    const handleLogin= async (email,password) => {
      

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
          let data=await response.json();
          console.log(data);
          console.log(data.data.customerAccessTokenCreate);
          if(data.data.customerAccessTokenCreate.customerUserErrors!==[]){
            localStorage.setItem("token",data.data.customerAccessTokenCreate.customerAccessToken.accessToken)

            await getUserInfo(data.data.customerAccessTokenCreate.customerAccessToken.accessToken)
            localStorage.setItem('cartItem', null)
            return null
          }else{
            throw new Error(data.data.customerAccessTokenCreate.customerUserErrors[0].message)
          }
          
          
          } catch (error) {
          console.log('Login error:', error);
          setError(error.message)
          setTimeout(()=>{
            setError(null)
          },[3000])
          
          }}

        
          async function getUserInfo(token){
            console.log(token)
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
            }
          `
            
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
              let data=await response.json();
              changeCurrentUser(data.data.customer)
              console.log(data.data.customer)
              let userInfo = JSON.stringify(data.data.customer)
              localStorage.setItem("currentUser", userInfo)
              localStorage.setItem("cartId", null)
              navigate("/")
              
              return null
              } catch (error) {
              console.error('Login error:', error);
              throw error;
              }}
      
     

 


  

  return (
    <HandleLoginContext.Provider value={{handleLogin,getUserInfo}}>
    <div className="absolute top-[200px] left-[50%] m-auto translate-x-[-50%]  ">
      <div className='flex flex-col'>
    {isReg? <div className="px-[30px] py-[10px] h-[340px] w-[350px] md:w-[450px]">
        <h1 className="text-l font-light text-center text-gray-700">LOGIN</h1>
        
        <form  className="flex flex-col justify-between h-[260px] mt-[20px]">
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
              className="mt-1  w-full border-gray-400   border-0 border-b-[1px] focus:border-black rounded-[0px]"
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
              className="mt-1 w-full border-gray-400 focus:border-black focus:ring-0 border-0 border-b-[1px] rounded-[0px]"
            />
          </div>
          <div className="text-sm mt-[10px]">
            <a href="#" className="font-light text-gray-600 hover:text-gray-500">
              FORGOT YOUR PASSWORD?
            </a>
          </div>
          <Button type="submit" onClick={onsubmit} className="w-full bg-black text-white hover:bg-gray-800 font-light">
            SIGN IN
          </Button>
        </form>
      </div>:<Signup/>}

      <div className="font-[200] w-[50px] text-gray-600 relative top-[0px] md:left-[190px] left-[139px]" onClick={()=>setIsReg((prev)=>!prev)}>{isReg?<span className='hover:underline'>REGISTER</span>:<span className='hover:underline'>LOGIN</span>}</div>
      </div>
      <AnimatePresence>
      {error && (
        <motion.p
          className="text-red-500 text-sm text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
    </div>
    </HandleLoginContext.Provider>
  );
}
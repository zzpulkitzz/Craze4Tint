import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useNavigate } from 'react-router-dom';
import {HandleLoginContext} from "./Login.jsx"
import { useContext } from 'react';
import { Loader2 } from "lucide-react";


export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const {handleLogin,getUseInfo,isLoading,chngIsLoading} = useContext(HandleLoginContext);

  const handleSubmit = async (e) => {

  
    chngIsLoading(true);
     


    e.preventDefault();
  
        const mutation = `
          mutation customerCreate($input: CustomerCreateInput!) {
            customerCreate(input: $input) {
              customer {
                id
                email
                firstName
                lastName
              }
              customerUserErrors {
                code
                field
                message
              }
            }
          }
        `;
        let apiToken=import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN

          console.log(apiToken)
        try {
            const response = await fetch("https://ecf084-fb.myshopify.com/api/2024-01/graphql.json", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': apiToken
              },
              body: JSON.stringify({
                query: mutation,
                variables: {
                  input: {
                    email,
                    password,
                    firstName: name.split(' ')[0],
                    lastName: name.split(' ')[1]
                  },
                },
              }),
            });
        
            const data = await response.json();
        
            if (data.errors) {
              throw new Error(data.errors[0].message);
            }
        
            if (data.data.customerCreate.customerUserErrors.length > 0) {
              throw new Error(data.data.customerCreate.customerUserErrors[0].message);
            }
            console.log(data)
            await handleLogin(email,password)
           
            return data.data.customerCreate;
          } catch (error) {
            console.error('Registration error:', error);
            setError(error.message)
            setTimeout(()=>{
            setError(null)
            },[3000])
            throw error;
          } finally {
            chngIsLoading(false);
          }

}

  return (
    
      <div className="p-[30px]  w-[350px] md:w-[450px]">
        <h1 className="text-l font-light text-center text-gray-700">Register</h1>
       
        <form onSubmit={handleSubmit} className="flex flex-col justify-between 
        h-[330px] mt-[20px]">
        <div>
            <Label htmlFor="Name" className="text-sm font-light text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className="mt-1  w-full border-gray-400   border-0 border-b-[1px] focus:border-black rounded-[0px]"
            />
          </div>

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
              disabled={isLoading}
              className="mt-1 w-full border-gray-400 focus:border-black focus:ring-0 border-0 border-b-[1px] rounded-[0px]"
            />
          </div>
          
          <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 font-light">
          {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      'REGISTER'
                    )}
          </Button>
        </form>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      </div>

  )}
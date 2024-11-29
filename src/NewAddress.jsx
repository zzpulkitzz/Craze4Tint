import { AuthContext } from './contextProvider';
import { useContext ,useRef,useState} from 'react';
import { useNavigate } from 'react-router-dom';

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
export default function NewAddress(){
    const client=createStorefrontClient()
    const [firstName,setFirstName]=useState()
    const [lastName,setLastName]=useState()
    const [address1,setAddressL1]=useState()
    const [address2,setAddressL2]=useState()
    const [zip,setZip]=useState()
    const [city,setCity]=useState()
    const [country,setCountry]=useState()
    const [tel,setTel]=useState()
    const currentUser=JSON.parse(localStorage.getItem('currentUser'))
    let token=localStorage.getItem('token')
    console.log(token)
    let navigate=useNavigate()
    console.log(currentUser)
    let ref_form=useRef()
    async function onSubmit(event){
      event.preventDefault();
      let oldData=JSON.parse(localStorage.getItem('currentUser'))
      console.log(oldData)
    let preparedAddress={firstName,lastName,
      address1,
      address2,
      zip,
      city,
      country,
      phone:tel}

    oldData["addresses"].edges.push(preparedAddress)

    let data=await client.query(`
    mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        customerAddress {
          id
          address1
          address2
          city
          country
          zip
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
    {customerAccessToken:token,address:preparedAddress})
    console.log(oldData,data.data)

    localStorage.setItem("currentUser",JSON.stringify(oldData))
    navigate("/profile/addresses")
    
     
    }
    
  
    
    return  <>
    <h1 className="text-3xl font-bold mb-8 mx-auto flex justify-center items-center">{`Good Evening! ${currentUser["firstName"]}`}</h1>
    <form className="bg-white p-6 rounded-lg border-[1px] shadow-md" ref={ref_form} >
      <div className="grid grid-cols-2 gap-6 bg-white ">
        <div>
          <label className="block text-sm font-medium text-black mb-1" name="firstName">First Name</label>
          <input
            type="text" 
            for="firstName"
            className="w-full bg-gray-100 rounded p-2 text-black"
            onChange={(e) => setFirstName(e.target.value)}

          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Last Name</label>
          <input
            type="text"
            className="w-full bg-gray-100 rounded p-2 text-black"
            onChange={(e) => setLastName(e.target.value)}

          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Address Line 1</label>
          <input
            type="email"
            className="w-full bg-gray-100 rounded p-2 text-black"
            onChange={(e) => setAddressL1(e.target.value)}
     
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Address Line 2</label>
          <input
            type="tel"

            className="w-full bg-gray-100 rounded p-2 text-black"
            onChange={(e) => setAddressL2(e.target.value)}
  
          />
        </div>
      </div>
      <div className="flex flex-row mt-[20px] gap-[26px]">
      <div className='grow'>
          <label className="block text-sm font-medium text-black mb-1">ZIP Code</label>
          <input
            type="number"
   
            className="w-full bg-gray-100 rounded p-2 text-black"
            onChange={(e) => setZip(e.target.value)}
        
          />
        </div>

        <div className='grow'>
          <label className="block text-sm font-medium text-black mb-1">Phone Number</label>
          <input
            type="tel"  
            className="w-full bg-gray-100 rounded p-2 text-black"
            onChange={(e) => setTel(e.target.value)}
          />
        </div>


        </div>
      
        <div className="flex flex-row mt-[20px] gap-[26px]">
      <div className='grow'>
          <label className="block text-sm font-medium text-black mb-1">CITY</label>
          <input
            type="text"
            className="w-full bg-gray-100 rounded p-2 text-black"
            onChange={(e) => setCity(e.target.value)}
            
          />
        </div>

        <div className='grow'>
          <label className="block text-sm font-medium text-black mb-1">COUNTRY</label>
          <input
            type="text"
            value="+918126293202"
            className="w-full bg-gray-100 rounded p-2 text-black"
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        </div>
       
    </form>
    <button className="w-full bg-black text-white hover:bg-gray-800 font-medium" onClick={onSubmit}>
                  ADD NEW ADDRESS
                </button>

    </>
}
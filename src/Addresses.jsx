import {Link} from 'react-router-dom'
import { Plus, Edit } from 'lucide-react'

export default function Addresses(){
    let currentUser=JSON.parse(localStorage.getItem("currentUser"))
    let addressArr=currentUser['addresses'].edges
    console.log( addressArr)
 

    let newArr=   addressArr.map((address)=>{
       
        return (
            <div className="bg-white rounded-lg shadow-md p-6 relative border-[1px]">
            {/* Default Label */}
            <div className="absolute top-[48px] left-[-5px] bg-black text-white text-xs py-1 px-3 transform -translate-y-1/2 -rotate-45 origin-left">
              DEFAULT
            </div>
            
            {/* Edit Button */}
            <button className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
              <Edit className="w-5 h-5 text-gray-600" />
            </button>
            <div className="mt-6 space-y-2 lg:text-[12px]">
        <p className="font-medium">{address.firstName}</p>
        <p className="text-gray-600">{address.lastName}</p>
        <p className="text-gray-600">{address.address1}</p>
        <p className="text-gray-600">{address.address2}</p>
        <p className="text-gray-600">{address.zip}</p>
        <p className="text-gray-600">{address.city}</p>
       
        <p className="text-gray-600">{address.country}</p>
      </div>
         
          </div>
         )} )
    
         console.log(newArr)
    
    
      return (
        <div className="container mx-auto p-6 max-w-[950px] ">
          <h1 className="text-2xl font-semibold text-center mb-8">{ `Good Afternoon ${currentUser.firstName }`}</h1>
          
          <div className="grid lg:grid-cols-3 gap-8 p-[30px] shadow-lg border-[0.7px]">
            {/* Add New Address Card */}
            <Link to="/profile/newAddress">
              <div className="bg-white rounded-lg shadow-md p-8 h-full flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow border-[1px]">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">Add New Address</span>
              </div>
            </Link>
    
            {/* Default Address Card */}
           {newArr}
          </div>
        </div>
      )}
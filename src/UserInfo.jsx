import { AuthContext } from './contextProvider';
import { useContext } from 'react';
export default function UserInfo(){
   
    
    const currentUser=JSON.parse(localStorage.getItem('currentUser'))
    console.log(currentUser)
    return  <>
    <h1 className="text-3xl font-bold mb-8 mx-auto flex justify-center items-center">{`Good Evening! ${currentUser["firstName"]}`}</h1>
    <div className="bg-white p-6 rounded-lg border-[1px] shadow-md ">
      <div className="grid grid-cols-2 gap-6 bg-white ">
        <div>
          <label className="block text-sm font-medium text-black mb-1">First Name</label>
          <input
            type="text" 
            value={currentUser["firstName"]}
            className="w-full bg-gray-100 rounded p-2 text-black"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Last Name</label>
          <input
            type="text"
            value={currentUser["firstName"]}
            className="w-full bg-gray-100 rounded p-2 text-black"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Email</label>
          <input
            type="email"
            value={currentUser.email}
            className="w-full bg-gray-100 rounded p-2 text-black"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">CONTACT </label>
          <input
            type="tel"
            value="+918126293202"
            className="w-full bg-gray-100 rounded p-2 text-black"
            readOnly
          />
        </div>
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-black mb-1">BIRTHDATE</label>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="DD"
            className="w-16 bg-gray-100 rounded p-2 text-black"
          />
          <input
            type="text"
            placeholder="MM"
            className="w-16 bg-gray-100 rounded p-2 text-black"
          />
          <input
            type="text"
            placeholder="YYYY"
            className="w-20 bg-gray-100 rounded p-2 text-black"
          />
        </div>
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-black mb-1">GENDER</label>
        <div className="flex gap-4">
          {['MALE', 'FEMALE', 'OTHER'].map((gender) => (
            <label key={gender} className="flex items-center">
              <input
                type="radio"
                name="gender"
                value={gender}
                className="mr-2"
              />
              {gender}
            </label>
          ))}
        </div>
      </div>
    </div>
    </>
}
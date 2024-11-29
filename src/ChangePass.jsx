import React, { useState } from 'react';
import { getAuth, updatePassword ,} from 'firebase/auth';
import {  Lock} from 'lucide-react'
import { useNavigate } from 'react-router-dom';
const ChangePass = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const token=localStorage.getItem('token');
  const apiToken=import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
    const navigate=useNavigate()
  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    console.log("yo")
    try {
      if (newPassword !== confirmPassword) {
        setError('New password and confirm password do not match.');
        return;
      }
     

      const response = await fetch('https://ecf084-fb.myshopify.com/api/2024-01/graphql.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': apiToken,
        },
        body: JSON.stringify({
          query: `
            mutation customerUpdatePassword(
              $customerAccessToken: String!,
              $password: String!
            ) {
              customerUpdate(
                customerAccessToken: $customerAccessToken,
                customer: { password: $password }
              ) {
                customerUserErrors {
                  code
                  field
                  message
                }
                customer {
                  id
                }
              }
            }
          `,
          variables: {
            customerAccessToken:token,
            password: newPassword,
          },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        setError(data.errors[0].message);
        return null
      }

      if (data.data.customerUpdate.customerUserErrors.length > 0) {
        setError(data.data.customerUpdate.customerUserErrors[0].message);
        return null
      }

      
        

      
     


      setSuccess(true);
      setError(null);
      navigate("/profile")
    } catch (error) {
      setError('Error changing password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  if(loading){
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin w-12 h-12 text-blue-500"></div>
    </div>
  }
  return <div>
    <h1 className="text-2xl font-bold mb-6">Good Morning! Pulkit</h1>
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <div className="flex justify-center mb-4">
        <Lock className="w-12 h-12 text-blue-600" />
      </div>
      <p className="text-center mb-6">
        Update your password for
        <br />
        <strong>gpulkitgupta72@gmail.com</strong>
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
            NEW PASSWORD
          </label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter New Password"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
            CONFIRM NEW PASSWORD
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm New Password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Password
        </button>
      </form>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Password changed successfully!
        </div>
      )}
    </div>

    </div>

  
};

export default ChangePass;
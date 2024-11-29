import React, { useState } from 'react';

const PassChange = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      // Get customer access token from your auth storage
      const customerAccessToken = localStorage.getItem('customerAccessToken');

      if (!customerAccessToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
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
            customerAccessToken,
            password: newPassword,
          },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      if (data.data.customerUpdate.customerUserErrors.length > 0) {
        throw new Error(data.data.customerUpdate.customerUserErrors[0].message);
      }

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'An error occurred while changing the password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>
      
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

     <div>
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
    </div>
    </div>
    </div>
  );
};

export default PassChange;
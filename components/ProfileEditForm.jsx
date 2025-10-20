'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfileEditForm({ user }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    full_name: '',
    email_memmessage_notification: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email_memmessage_notification:
          user.email_memmessage_notification || false,
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        // Refresh the page to show updated data
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to update profile',
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='max-w-md mx-auto'>
      <div className='bg-white p-6 rounded-lg shadow-md border'>
        <h2 className='text-2xl font-bold text-center mb-6'>Edit Profile</h2>

        {/* Account Information (Read-only) */}
        <div className='mb-6 p-4 bg-gray-50 rounded-md'>
          <h3 className='text-sm font-semibold text-gray-700 mb-3'>
            Account Information
          </h3>

          {/* Email Field (Read-only) */}
          <div className='mb-3'>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Email Address
            </label>
            <input
              type='email'
              value={user?.email || ''}
              disabled
              className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
              placeholder='No email on file'
            />
          </div>

          {/* Phone Number Field (Read-only) */}
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Phone Number
            </label>
            <input
              type='tel'
              value={user?.phone || ''}
              disabled
              className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
              placeholder='No phone number on file'
            />
          </div>

          <p className='text-xs text-gray-500 mt-2'>
            Email and phone number cannot be changed here. Contact support if
            you need to update these.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='space-y-6'
        >
          {/* Full Name Field */}
          <div>
            <label
              htmlFor='full_name'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Full Name
            </label>
            <input
              type='text'
              id='full_name'
              name='full_name'
              value={formData.full_name}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter your full name'
              maxLength={100}
            />
          </div>

          {/* Email Notification Checkbox */}
          <div className='flex items-center'>
            <input
              type='checkbox'
              id='email_memmessage_notification'
              name='email_memmessage_notification'
              checked={formData.email_memmessage_notification}
              onChange={handleInputChange}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label
              htmlFor='email_memmessage_notification'
              className='ml-2 block text-sm text-gray-700'
            >
              Receive email notifications when I get in-app messages
            </label>
          </div>

          {/* Message Display */}
          {message.text && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200'
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        {/* Info Section */}
        <div className='mt-6 p-4 bg-gray-50 rounded-md'>
          <h3 className='text-sm font-semibold text-gray-700 mb-2'>
            About Email Notifications
          </h3>
          <p className='text-xs text-gray-600'>
            When enabled, you'll receive email notifications when someone sends
            you a message through the platform. You can change this setting
            anytime.
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [coupons, setCoupons] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAdminStatus()
  }, [])

  // Fetch coupons only after admin status is confirmed
  useEffect(() => {
    if (isAdmin && !isLoading) {
      fetchCoupons()
    }
  }, [isAdmin, isLoading])

  const checkAdminStatus = async () => {
    try {
      setStatusMessage('Checking admin status...')
      const response = await fetch('/api/admin/status')
      const result = await response.json()

      if (result.success && result.isAdmin) {
        setIsAdmin(true)
        setStatusMessage('✅ Admin access confirmed!')
      } else {
        setIsAdmin(false)
        setStatusMessage(
          '❌ Admin access required. Please set up your admin account.'
        )
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
      setStatusMessage(`❌ Error checking status: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to refresh admin status after setup
  const refreshAdminStatus = async () => {
    setIsLoading(true)
    try {
      await checkAdminStatus()
    } catch (error) {
      console.error('Error refreshing admin status:', error)
    }
  }

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons')
      const result = await response.json()

      if (result.success) {
        setCoupons(result.coupons)
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
    }
  }

  const deleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setCoupons(coupons.filter((coupon) => coupon._id !== couponId))
        alert('Coupon deleted successfully')
      } else {
        alert(result.error || 'Failed to delete coupon')
      }
    } catch (error) {
      console.error('Error deleting coupon:', error)
      alert('Failed to delete coupon')
    }
  }

  const toggleCouponStatus = async (couponId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setCoupons(
          coupons.map((coupon) =>
            coupon._id === couponId
              ? { ...coupon, isActive: !currentStatus }
              : coupon
          )
        )
      } else {
        alert(result.error || 'Failed to update coupon')
      }
    } catch (error) {
      console.error('Error updating coupon:', error)
      alert('Failed to update coupon')
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-500'>Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Admin Access Required
            </h1>
            <p className='mt-2 text-gray-600'>
              You need admin privileges to access this page.
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Set Up Admin Account
            </h2>
            <p className='text-sm text-gray-600 mb-4'>
              To access the admin dashboard, you need to promote your account to
              admin.
            </p>

            {/* Status Message */}
            {statusMessage && (
              <div className='mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg'>
                <p className='text-sm text-gray-700'>{statusMessage}</p>
              </div>
            )}

            <div className='space-y-3'>
              <Link
                href='/admin/setup'
                className='w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-center block'
              >
                Set Up Admin Account
              </Link>

              <button
                onClick={refreshAdminStatus}
                disabled={isLoading}
                className='w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors duration-200'
              >
                {isLoading ? 'Checking...' : 'Check Admin Status'}
              </button>

              <Link
                href='/'
                className='w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-center block'
              >
                Back to Home
              </Link>
            </div>

            <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
              <p className='text-xs text-blue-800'>
                <strong>Note:</strong> You must be signed in with the email
                account you want to make admin.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto p-6'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Admin Dashboard
            </h1>
            <p className='text-gray-600 mt-2'>
              Manage coupons and site administration
            </p>
          </div>
          <Link
            href='/'
            className='bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200'
          >
            Back to Site
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className='mb-8'>
        <nav className='flex space-x-8'>
          <button className='border-b-2 border-blue-500 text-blue-600 font-medium pb-2'>
            Coupons
          </button>
          <button className='text-gray-500 hover:text-gray-700 font-medium pb-2'>
            Reports (Coming Soon)
          </button>
          <button className='text-gray-500 hover:text-gray-700 font-medium pb-2'>
            Users (Coming Soon)
          </button>
        </nav>
      </div>

      {/* Coupon Management */}
      <div className='bg-white rounded-lg shadow'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Coupon Management
            </h2>
            <button
              onClick={() => setShowCreateForm(true)}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200'
            >
              Create New Coupon
            </button>
          </div>
        </div>

        <div className='p-6'>
          {coupons.length === 0 ? (
            <div className='text-center py-8'>
              <div className='text-gray-500 text-lg mb-4'>
                No coupons created yet
              </div>
              <p className='text-gray-400'>
                Create your first coupon to get started
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Code
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Discount
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Usage
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {coupons.map((coupon) => (
                    <tr key={coupon._id}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>
                          {coupon.code}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {coupon.name}
                        </div>
                        {coupon.description && (
                          <div className='text-sm text-gray-500'>
                            {coupon.description}
                          </div>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}%`
                            : `$${coupon.discountValue}`}
                        </div>
                        {coupon.minimumOrderAmount > 0 && (
                          <div className='text-sm text-gray-500'>
                            Min: ${coupon.minimumOrderAmount}
                          </div>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {coupon.usageCount}
                          {coupon.usageLimit
                            ? ` / ${coupon.usageLimit}`
                            : ' / ∞'}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {coupon.usageLimitPerUser} per user
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center space-x-2'>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              coupon.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              coupon.isValid
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {coupon.isValid ? 'Valid' : 'Expired'}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() =>
                              toggleCouponStatus(coupon._id, coupon.isActive)
                            }
                            className={`${
                              coupon.isActive
                                ? 'text-red-600 hover:text-red-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {coupon.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteCoupon(coupon._id)}
                            className='text-red-600 hover:text-red-900'
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showCreateForm && (
        <CreateCouponModal
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false)
            fetchCoupons()
          }}
        />
      )}
    </div>
  )
}

// Create Coupon Modal Component
function CreateCouponModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minimumOrderAmount: '',
    usageLimit: '',
    usageLimitPerUser: '1',
    validFrom: '',
    validUntil: '',
    isActive: true,
    isPublic: true,
    applicableTo: 'all',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess()
        alert('Coupon created successfully!')
      } else {
        alert(result.error || 'Failed to create coupon')
      }
    } catch (error) {
      console.error('Error creating coupon:', error)
      alert('Failed to create coupon')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Create New Coupon
          </h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Coupon Code *
              </label>
              <input
                type='text'
                name='code'
                value={formData.code}
                onChange={handleChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='SAVE20'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Coupon Name *
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='20% Off Sale'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Description
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Optional description...'
            />
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Discount Type *
              </label>
              <select
                name='discountType'
                value={formData.discountType}
                onChange={handleChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value='percentage'>Percentage</option>
                <option value='fixed_amount'>Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Discount Value *
              </label>
              <input
                type='number'
                name='discountValue'
                value={formData.discountValue}
                onChange={handleChange}
                required
                min='0'
                max={formData.discountType === 'percentage' ? '100' : undefined}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder={
                  formData.discountType === 'percentage' ? '20' : '10'
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Min Order Amount
              </label>
              <input
                type='number'
                name='minimumOrderAmount'
                value={formData.minimumOrderAmount}
                onChange={handleChange}
                min='0'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='0'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Usage Limit
              </label>
              <input
                type='number'
                name='usageLimit'
                value={formData.usageLimit}
                onChange={handleChange}
                min='1'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Leave empty for unlimited'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Per User Limit
              </label>
              <input
                type='number'
                name='usageLimitPerUser'
                value={formData.usageLimitPerUser}
                onChange={handleChange}
                min='1'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Valid From *
              </label>
              <input
                type='datetime-local'
                name='validFrom'
                value={formData.validFrom}
                onChange={handleChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Valid Until *
              </label>
              <input
                type='datetime-local'
                name='validUntil'
                value={formData.validUntil}
                onChange={handleChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>

          <div className='flex items-center space-x-6'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                name='isActive'
                checked={formData.isActive}
                onChange={handleChange}
                className='mr-2'
              />
              <span className='text-sm text-gray-700'>Active</span>
            </label>
            <label className='flex items-center'>
              <input
                type='checkbox'
                name='isPublic'
                checked={formData.isPublic}
                onChange={handleChange}
                className='mr-2'
              />
              <span className='text-sm text-gray-700'>Public</span>
            </label>
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-200'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200'
            >
              {isSubmitting ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'

const FeedbackForm = ({ user }) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTitle('')
        setBody('')
      } else {
        setError(data.error || 'Failed to submit feedback')
      }
    } catch (err) {
      setError('An error occurred while submitting feedback')
      console.error('Error submitting feedback:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const remainingChars = 200 - body.length

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h3 className='text-xl font-bold text-gray-900 mb-4'>
        Submit Feedback to Site Admins
      </h3>

      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm'>
          {error}
        </div>
      )}

      {success && (
        <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm'>
          Feedback submitted successfully! Thank you for your input.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Feedback Title
          </label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Enter a title for your feedback'
            required
            maxLength={100}
          />
        </div>

        <div>
          <label
            htmlFor='body'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Feedback Body
            <span className='text-gray-500 text-xs ml-2'>
              ({remainingChars} characters remaining)
            </span>
          </label>
          <textarea
            id='body'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Describe your feedback...'
            required
            maxLength={200}
          />
          <p className='text-xs text-gray-500 mt-1'>Maximum 200 characters</p>
        </div>

        <button
          type='submit'
          disabled={isSubmitting || title.trim() === '' || body.trim() === ''}
          className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200'
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  )
}

export default FeedbackForm

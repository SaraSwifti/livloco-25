// components/DeleteProfileModal.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteProfileModal({ isOpen, onClose, onConfirm, profileType }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await onConfirm();
      if (result.ok) {
        // Redirect to profile page after successful deletion
        router.push('/businesses'); // or appropriate page
        router.refresh();
      } else {
        alert(result.error || 'Failed to delete profile');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting your profile');
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  const profileName = profileType === 'locobiz' ? 'LocoBusiness' : 'LocoMarket';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Delete {profileName}?
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-gray-700">
            Are you sure you want to delete your {profileName} profile?
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 font-semibold mb-2">
              Warning: This action cannot be undone!
            </p>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>All your {profileName} data and statistics (votes) will be permanently deleted.</li>
              <li> {profileName} will be removed from all listings.</li>
              <li>If you want to create a {profileName} again, you'll need to re-enter all information</li>
              <li>You will be reset to being a Co-op user and you can come back and add a new LocoBusiness or LocoMarket anytime you want. </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

// File: app/actions/updateUserProfileChoice.js

'use server';


import connectDB from '@/config/database'
import User from '@/models/User'

export default async function updateUserProfileChoice({ profile_choice, email }) {
  return fetch('/api/update-profile-choice', {
    method: 'POST',
    body: JSON.stringify({ profile_choice, email }),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}
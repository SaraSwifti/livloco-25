// File: app/actions/updateUserProfileChoice.js

export default async function updateUserProfileChoice({ profile_choice, email }) {
  const res = await fetch('/api/update-profile-choice', {
    method: 'POST',
    body: JSON.stringify({ profile_choice, email }),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to update profile choice')
  return res.json()
}

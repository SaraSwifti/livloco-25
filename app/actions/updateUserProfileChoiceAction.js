// File: app/actions/updateUserProfileChoice.js
// Client-side helper that hits your API route to update the user's profile_choice.
export default async function updateUserProfileChoice({ profile_choice }) {
  const res = await fetch('/api/update-profile-choice', {
    method: 'POST',
    body: JSON.stringify({ profile_choice, email }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to update profile choice');
  return res.json();
}

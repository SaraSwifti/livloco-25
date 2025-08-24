// components/AddressLink.jsx
'use client';

import { FaLocationArrow } from 'react-icons/fa';

export default function AddressLink({
  address = {},
  className = '',
  mode = 'directions', // 'directions' | 'map'
  children,            // optional custom label; otherwise we render the full address
}) {
  const line1 = address.add_line1 || address.line1 || '';
  const line2 = address.add_line2 || address.line2 || '';
  const city = address.city || '';
  const state =
    address.state_code || address.state_name || address.state || '';
  const zip = address.zipcode || address.zip || '';

  // Build a friendly label (what the user sees)
   
     // Show full address: "Line1, Line2, City, ST, ZIP"
 const fullAddress = [
   [line1, line2].filter(Boolean).join(', '),
   [city, state].filter(Boolean).join(', '),
   zip,
 ]
   .filter(Boolean)
   .join(', ');
 const label = children || fullAddress || 'View on map';


  // Build a single query string for the map provider
  const query = [line1, line2, city, state, zip].filter(Boolean).join(' ');
  const encoded = encodeURIComponent(query);

  // Google Maps universal links (works on desktop opens native app on phones)
  const href =
    mode === 'directions' // mode=== 'map' if you just want to show but not give directions. 
      ? `https://www.google.com/maps/search/?api=1&query=${encoded}`
      : `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 underline decoration-dotted underline-offset-4 text-indigo-700 hover:text-indigo-800 ${className}`}
      title="Open in Maps"
      aria-label={`Open in Maps: ${label}`}
    >
      <FaLocationArrow aria-hidden className="mt-0.5" />
      <span>{label}</span>
    </a>
  );
}

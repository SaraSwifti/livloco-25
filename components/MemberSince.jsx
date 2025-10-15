// components/MemberSince.jsx
/**
 * Displays "Livloco Co-op Member Since {Month Year}"
 * @param {string} createdAt - ISO timestamp from the database (user/business/market createdAt)
 * @param {string} className - Optional additional CSS classes
 */
const MemberSince = ({ createdAt, className = '' }) => {
  if (!createdAt) {
    return null;
  }

  // Parse the createdAt timestamp and format as "Month Year"
  const formatMemberSince = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const options = { year: 'numeric', month: 'long' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const formattedDate = formatMemberSince(createdAt);

  if (!formattedDate) {
    return null;
  }

  return (
    <h1 className={`text-xl italic ${className}`}>
      Livloco Co-op Member Since {formattedDate}
    </h1>
  );
};

export default MemberSince;

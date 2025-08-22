import { FaClipboardList, FaDollyFlatbed } from 'react-icons/fa';

export const ItemIcon = ({ type }) => {
  if (type === 'product') return <FaDollyFlatbed className='mr-1 mt-1.5 text-blue-800' />;
  if (type === 'service') return <FaClipboardList className='mr-1 mt-1.5 text-green-800' />;
  return null;
};

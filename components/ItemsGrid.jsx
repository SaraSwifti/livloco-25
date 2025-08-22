// components/ItemsGrid.jsx

import { ItemIcon } from '@/components/ItemIcon';
import SafeImage from '@/components/SafeImage';

export default function ItemsGrid({ title, entries, keys }) {
  return (
    <div className='p-4 border rounded shadow'>
      <h2 className='text-xl font-bold tracking-tight text-gray-900 mb-4'>{title}</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {keys.map((k) => {
          const it = entries?.[k];
          const hasDesc = (it?.description || '').trim() !== '';
          if (!hasDesc) return null;
          return (
            <div key={k} className='flex items-start gap-2'>
              
              <ItemIcon type={it.type} />
              <div className='flex flex-col'>
                <h3 className='text-xl text-left text-black'>{it.description}</h3>
                {it.price && <p className='text-sm font-medium text-gray-900'>{it.price}</p>}
           
                  <SafeImage
                    src={it.image}
                    alt={it.description || 'Item image'}
                    className='mt-2 object-cover w-full h-auto max-h-64 sm:max-h-80 rounded'
                    // width={600}
                    // height={400}
                    sizes='(max-width: 768px) 100vw, 33vw'
                  />
               
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
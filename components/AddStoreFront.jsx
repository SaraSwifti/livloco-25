'use Client'

import { useState } from 'react'



const AddStoreFront = () => {
    const [showStoreFrontForm, setShowStoreFrontForm ] = useState(false)
    
    return (  
         <div className='mt-6 border-t pt-4'>

        // Toggle for needing to post storefront
         <div className='flex items-center gap-3'>
        <label className='font-medium'>
          Add Selling needing profile to make your LivLoco pofile Active
        </label>
        <input
          type='checkbox'
          checked={showStoreFrontForm}
          onChange={(e) => setShowStoreFrontForm(e.target.checked)}
          className='w-5 h-5'
        />
            </div>
            </div>


    );
}
 
export default AddStoreFront;
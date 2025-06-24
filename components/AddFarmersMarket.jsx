'use client';

import { useEffect } from 'react';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const AddFarmersMarketForm = ({ data, onChange }) => {
    const [showFarmersMarketForm, setFarmersMarketForm] = useState(false);

    const handleToggle = (e) => {
    const checked = e.target.checked;
    onChange({
      ...data,
      fm_location_post: checked,
    });
  };

  const handleDayChange = (e, day) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [day]: {
        ...data[day],
        [name]: value,
      },
    });
  };

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={data.fm_location_post}
          onChange={handleToggle}
          className="w-5 h-5"
        />
        <label className="font-medium text-lg">
          Add Farmers Market locations?
        </label>
      </div>

      {data.fm_location_post && (
        <>
          <h2 className="text-xl font-bold mt-4">Farmers Market Locations</h2>

          {daysOfWeek.map((day) => (
            <div key={day} className="border rounded p-4 mb-4">
              <h3 className="text-lg font-semibold capitalize mb-2">{day}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">Market Name</label>
                  <input
                    type="text"
                    name="farmers_market_name"
                    value={data[day]?.farmers_market_name || ''}
                    onChange={(e) => handleDayChange(e, day)}
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    value={data[day]?.city || ''}
                    onChange={(e) => handleDayChange(e, day)}
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">State</label>
                  <input
                    type="text"
                    name="state"
                    value={data[day]?.state || ''}
                    onChange={(e) => handleDayChange(e, day)}
                    className="mt-1 w-full border rounded p-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default AddFarmersMarketForm;
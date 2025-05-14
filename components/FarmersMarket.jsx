// import LocoMem from "@/models/LocoMem";

const FarmersMarket = ({ locomem }) => {
    return ( 
        <div>
        <h1 className="text-xl text-green-900">Check out our Farmer's Market Schedule!</h1>
        <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Day of the Week
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Market Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      City
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      State
                    </th>
                   
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Monday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.monday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.monday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.monday.state}`}</td>
                    </tr>
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Tuesday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.tuesday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.tuesday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.tuesday.state}`}</td>
                    </tr>
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Wednesday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.wednesday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.wednesday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.wednesday.state}`}</td>
                    </tr>
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Thursday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.thursday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.thursday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.thursday.state}`}</td>
                    </tr>
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Friday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.friday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.friday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.friday.state}`}</td>
                    </tr>
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Saturday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.saturday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.saturday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.saturday.state}`}</td>
                    </tr>
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Sunday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.sunday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.sunday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.sunday.state}`}</td>
                    </tr>
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
            </div>
            </div>
     );
}
 
export default FarmersMarket ;
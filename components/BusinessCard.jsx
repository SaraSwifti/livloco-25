import Image from "next/image";
import Link from "next/link";


const BusinessCard = ({ business }) => {
  return (
    <>
      <div className="rounded-xl shadow-md relative bg-white">
        <Image
          src={`/images/locobizimages/${business.locobiz.locobiz_profile_image}`}
          // Make a component to insert alt tag for these per customer//

            alt=""
            width="0"
            height="0"
            sizes='100vw'
              className="w-full h-auto rounded-t-xl"
            />
            <div className="p-4">
              <div className="text-left md:text-center lg:text-left mb-6">
                {/* <div className="text-gray-600">Apartment</div> */}
            <h3 className="text-xl font-bold">{`${business.locobiz.locobiz_name}`}</h3>
              </div>
              <h3
                className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-green-900 font-bold text-right md:text-center lg:text-right"
              >
               {`${business.locobiz.locobiz_name}`}
              </h3>
{/* Selling list */}
              <div className="flex text-lg justify-center gap-4 text-black mb-4">
            <div className="flex text-lg justify-center gap-4 text-black mb-4">
              <p className="font-bold ">
                  {/* <i className="fa-solid fa-bed"></i> 3
                  <span className="md:hidden lg:inline">Beds</span> */}
              Selling
            </p>
            </div>
                
                <p>
               {`${business.locobiz.selling.selling1.description}`}
            </p>
            <p>
               {`${business.locobiz.selling.selling2.description}`}
            </p>
            <p>
               {`${business.locobiz.selling.selling3.description}`}
                </p>
                
              </div>
          {/* Needing list */}
          <div className="flex text-lg justify-center gap-4 text-black mb-4">
            <div className="flex text-lg justify-center gap-4 text-black mb-4">
              <p className="font-bold ">
              Needing
            </p>
            </div>
                
                <p>
               {`${business.locobiz.needs.need1.description}`}
            </p>
            <p>
               {`${business.locobiz.needs.need2.description}`}
            </p>
            <p>
               {`${business.locobiz.needs.need3.description}`}
                </p>
                
              </div>

             

              <div className="border border-gray-100 mb-5"></div>

              <div className="flex flex-col lg:flex-row justify-between mb-4">
                <div className="flex align-middle gap-2 mb-4 lg:mb-0">
                  <i
                    className="fa-solid fa-location-dot text-lg text-orange-700"
                  ></i>
                  <span className="text-orange-700"> Boston MA </span>
                </div>
                <a
                  href="property.html"
                  className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                >
                  Details
                </a>
              </div>
            </div>
          </div>
        </>
     );
}
 
export default BusinessCard;
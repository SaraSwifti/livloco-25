import Image from 'next/image';
import logo from '@/assets/images/newlivlocologo.png';

const Hero = () => {
  return (
    // <!--Hero-->
    <section className="py-0 mb-4">
      <div className="bg-gray-800 max-w-7xl py-3.5 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center">

        {/* Logo: top-center on mobile, right 1/4 on md+ */}
        <div className="order-1 md:order-2 w-full md:w-1/4 mb-4 md:mb-0 flex justify-center md:justify-end">
          {/* Swap src with your actual logo path or <Image /> */}
             <Image
                    src={logo}
                    alt='LivLoco logo'
                    className='h-auto w-auto object-contain'
                    width={200}
                    height={200}
                  />
        </div>

        {/* Text + Form: 3/4 on md+, full on mobile */}
        <div className="order-2 md:order-1 w-full md:w-3/4 md:pr-6 text-center md:text-left">
          <h1 className="text-4xl font-extrabold drop-shadow-2xl text-white sm:text-5xl md:text-6xl">
            Find Your LocoPeeps
          </h1>
          <p className="my-4 font-bold drop-shadow-2xl text-xl text-white">
            Local businesses finding local businessess. Creating local economies right where you live.
          </p>

          {/* Form stays under the text so it scales with the 3/4 column */}
          <form className="mt-3 mx-auto md:mx-0 max-w-2xl w-full flex flex-col md:flex-row items-center">
            <div className="w-full md:w-3/5 md:pr-2 mb-4 md:mb-0">
              <label htmlFor="location" className="sr-only">Location</label>
              <input
                type="text"
                id="location"
                alt="enter your city, state or zip"
                placeholder="Enter Location (City, State, Zip, etc"
                className="w-full px-4 py-3 rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-black"
              />
            </div>
            <div className="w-full md:w-2/5 md:pl-2">
              <label htmlFor="business-type" className="sr-only">LocoBusiness type</label>
              <select
                id="business-type"
                className="w-full px-4 py-3 rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-gray-900"
              >
                <option value="All" alt="search for all options available, both goods and services">All</option>
                <option value="Goods" alt="search for Goods only">Goods</option>
                <option value="Services" alt="search for services only">Services</option>
              </select>
            </div>
            <button
              alt="submit button for your search"
              type="submit"
              className="md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-black text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Search
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Hero;

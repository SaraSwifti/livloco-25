const AboutPage = () => {
    return (
        <div className="mx-auto -mt-12 max-w-7xl p-10 sm:mt-0 lg:px-8 xl:-mt-8">
        <div className="mx-auto rounded bg-white p-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <h2 className="text-pretty text-center text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Less is More</h2>
          <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
            <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
            <h3 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Less....</h3>
              <p className="text-xl/8 text-black">
                distance, transport, energy, waste, plastic, middle-men, stress, business margin, pollution.
              </p>
              <br/>
              <h3 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">More....</h3>
              <p className="text-xl/8 text-black">
                Knowing your neighbor, local business, community, sustainability, interdependence, ....peace.
              </p>
              
            </div>
            <div className="lg:flex lg:flex-auto lg:justify-center">
              <dl className="w-64 space-y-8 xl:w-80">
                
                  <div  className="flex flex-col-reverse gap-y-4">
                    <dt className="text-base/7 text-gray-600"></dt>
                    <dd className="text-5xl font-semibold tracking-tight text-gray-900">stat value</dd>
                  </div>
               
              </dl>
            </div>
          </div>
        </div>
      </div>
     );
}
 
export default AboutPage;
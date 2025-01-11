const AboutPage = () => {
    return (
        <div className="mx-auto -mt-12 max-w-7xl p-10 sm:mt-0 lg:px-8 xl:-mt-8">
        <div className="mx-auto rounded bg-white p-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Livloco's Mission</h2>
          <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
            <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
              <p className="text-xl/8 text-black">
                Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam
                eget aliquam. Quisque id at vitae feugiat egestas ac. Diam nulla orci at in viverra scelerisque eget.
                Eleifend egestas fringilla sapien.
              </p>
              <p className="mt-10 max-w-xl text-base/7 text-black">
                Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet
                vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque
                erat velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris
                semper sed amet vitae sed turpis id.
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
import SafeImage from "./SafeImage";

const BusinessHeaderImage = ({ image }) => {
    console.log('BusinessHeaderImage received image:', image); // Add this
  //  const isValidImage = typeof image === 'string' && image.trim().startsWith('https');
  return (
    <section>
      <div className='container-xl m-auto'>
        <div className='grid grid-cols-1'>
          { image ? (
            <SafeImage
              src={image}
              alt={`${biz.locobiz_name} header`}
              className='rounded-2xl'
              ratio="21/9"
            //   width={0}
            //   height={0}
            // sizes='100vw'
            // priority={true}
            />
           ) : (
            <div className="h-[400px] flex items-center justify-center border border-gray-300 text-gray-500 text-xl italic rounded">
              
            </div>
          )}
           
        </div>
      </div>
    </section>
  );
};

export default BusinessHeaderImage

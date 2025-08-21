import SafeImage from "./SafeImage";

const BusinessHeaderImage = ({ image }) => {
    console.log('BusinessHeaderImage received image:', image); // Add this
  //  const isValidImage = typeof image === 'string' && image.trim().startsWith('https');
  return (
    <section>
      <div className='container-xl m-auto'>
        <div className='grid grid-cols-1'>
          
            <SafeImage
              src={image}
              alt={`${biz.locobiz_name} header`}
              className='rounded-2xl'
              ratio="21/9"
                 sizes="100vw"            // full-width hero: tell Next it's viewport-wide
            priority={true}                 // heroes usually benefit from priority
            //   width={0}
            //   height={0}
            // sizes='100vw'
            // priority={true}
            />
          
           
        </div>
      </div>
    </section>
  );
};

export default BusinessHeaderImage

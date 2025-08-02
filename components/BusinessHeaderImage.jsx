import Image from 'next/image'

const BusinessHeaderImage = ({ image }) => {
  const isValidImage = image && image.trim() !== ''
  return (
    <section>
      <div className='container-xl m-auto'>
        <div className='grid grid-cols-1'>
          {isValidImage ? (
            <Image
              src={image}
              alt='business profile picture'
              className='object-cover h-[400px] w-full'
              width={0}
              height={0}
              sizes='100vw'
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center border border-gray-300 text-gray-500 text-xl italic rounded">
              No image available
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BusinessHeaderImage

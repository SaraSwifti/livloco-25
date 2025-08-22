import SafeImage from "./SafeImage";

const BusinessHeaderImage = ({ locobiz }) => {
   const alt = locobiz?.locobiz_name ? `${locobiz.locobiz_name} header` : 'Business header';
  const src = locobiz.locobiz_profile_image; // your 21:9 fallback

  return (
     <section>
      <div className="w-screen m-auto"> {/* full bleed hero */}
        <div className="relative">
          <SafeImage
            src={src}
            alt={alt}
            ratio="21/9"
            sizes="100vw"     // correct now that wrapper is full width
            priority
          />
          {/* Optional: move overlay here for guaranteed stacking */}
          {/* <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-7xl font-bold">{locobiz?.locobiz_name ?? ''}</h1>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default BusinessHeaderImage

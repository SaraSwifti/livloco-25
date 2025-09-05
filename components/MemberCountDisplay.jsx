const MemberCountDisplay = ({ total }) => {
    return (
      <>
    <h1 className="mt-2 text-black text-xl font-bold mb-4 text-center">
      Members who have joined so far!
            </h1>
             <h1 className="mt-2 text-black text-xl font-bold mb-4 text-center">
      {total}
     
            </h1>
            
      </>
      
  );
};

export default MemberCountDisplay;

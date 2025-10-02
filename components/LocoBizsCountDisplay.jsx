const LocoBizsCountDisplay = ({ total }) => {
  return (
    <>
      <h1 className='mt-2 text-black text-xl font-bold mb-4 text-center'>
        LocoBusinesses who are displaying so far!
      </h1>
      <h1 className='mt-2 text-blue-700 text-4xl font-bold mb-4 text-center'>
        {total}
      </h1>
    </>
  )
}

export default LocoBizsCountDisplay

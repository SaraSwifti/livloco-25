import FarmersMarket from '@/components/FarmersMarket'
import BusinessContact from '@/components/BusinessContact'
import StoreFront from '@/components/StoreFront'
import MappingPin from '@/components/MappingPin'
import VoteButton from '@/components/VoteButton'
import SaveButton from '@/components/SaveButton'
import MemberSince from '@/components/MemberSince'
import DistanceDisplay from '@/components/DistanceDisplay'
import { FaClipboardList, FaDollyFlatbed } from 'react-icons/fa'
import ItemsGrid from './ItemsGrid'

const BusinessDetails = ({
  locobiz,
  voteData,
  saveData,
  messageButtonProps,
}) => {
  const hasStoreFront = locobiz?.locobiz_address?.post_permission === true
  const hasFM = locobiz?.farmers_market_location?.fm_location_post === true
  const gridMdCols =
    hasStoreFront && hasFM ? 'md:grid-cols-2' : 'md:grid-cols-1'

  return (
    <article
      className='bg-white rounded-xl shadow-lg overflow-hidden'
      itemScope
      itemType='https://schema.org/LocalBusiness'
    >
      {/* Business Header Section */}
      <header className='bg-sky-600'>
        <div className='max-w-4xl mx-auto py-8 px-4 text-center'>
          <h1
            className='text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl'
            itemProp='name'
          >
            {locobiz.locobiz_name}
          </h1>

          {locobiz.locobiz_description && (
            <p
              className='text-xl text-white mb-6 drop-shadow-lg'
              itemProp='description'
            >
              {locobiz.locobiz_description}
            </p>
          )}

          <div className='flex flex-col items-center gap-4'>
            <MemberSince createdAt={locobiz.createdAt} />

            {/* Location */}
            <div
              className='flex items-center gap-2'
              aria-label='Business location'
            >
              <MappingPin
                memZip={locobiz?.mem_zip}
                city={locobiz?.locobiz_address?.city}
                stateName={locobiz?.locobiz_address?.state_name}
                className='text-white text-lg font-semibold hover:text-gray-200 underline decoration-dotted underline-offset-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded drop-shadow-lg'
                mode='modal'
                size='md'
              />
            </div>

            {/* Distance Display */}
            <DistanceDisplay
              businessId={locobiz._id}
              className='text-center text-white drop-shadow-lg'
            />
          </div>
        </div>
      </header>

      {/* Business Content */}
      <div className='p-8'>
        {/* Promotional & Actions Row */}
        <section className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
          {/* Promotional Section */}
          {(locobiz.current_promotional || '').trim() !== '' && (
            <div className='bg-yellow-600 p-6 rounded-lg border border-yellow-700'>
              <h2 className='text-lg font-semibold text-white mb-2'>
                Current Promotional
              </h2>
              <p className='text-xl text-white font-bold'>
                {locobiz.current_promotional}
              </p>
            </div>
          )}

          {/* Vote & Save Actions */}
          {voteData && (
            <div className='flex flex-col items-center justify-center bg-emerald-700 p-6 rounded-lg border border-emerald-700'>
              <h2 className='text-lg font-semibold text-white mb-4 drop-shadow-lg'>
                Community Support
              </h2>
              <div className='flex gap-4'>
                <VoteButton
                  id={voteData.id}
                  type='business'
                  initialVoteCount={voteData.voteCount}
                  initialHasVoted={voteData.hasVoted}
                  isLoggedIn={voteData.isLoggedIn}
                />
                {saveData && (
                  <SaveButton
                    id={saveData.id}
                    type='business'
                    initialHasSaved={saveData.hasSaved}
                    isLoggedIn={saveData.isLoggedIn}
                  />
                )}
              </div>
            </div>
          )}
        </section>

        {/* Selling & Seeking Section */}
        <section
          className='mb-12'
          aria-label='Products and services'
        >
          <header className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>
              What they're selling & seeking
            </h2>
            <p className='text-gray-600'>
              Discover what this business offers and what they're looking for
            </p>
          </header>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <ItemsGrid
              title='Selling'
              entries={locobiz.selling}
              keys={['selling1', 'selling2', 'selling3']}
            />
            <ItemsGrid
              title='Seeking'
              entries={locobiz.needs}
              keys={['need1', 'need2', 'need3']}
            />
          </div>
        </section>

        {/* Contact Section */}
        <section
          className='mb-12'
          aria-label='Contact information'
        >
          <BusinessContact
            locobiz={locobiz}
            messageButtonProps={messageButtonProps}
          />
        </section>

        {/* StoreFront & Farmers Market Section */}
        {(hasStoreFront || hasFM) && (
          <section
            className='grid grid-cols-1 lg:grid-cols-2 gap-8'
            aria-label='Additional locations'
          >
            {hasStoreFront && <StoreFront locobiz={locobiz} />}
            {hasFM && <FarmersMarket locobiz={locobiz} />}
          </section>
        )}
      </div>
    </article>
  )
}

export default BusinessDetails

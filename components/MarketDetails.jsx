import VoteButton from '@/components/VoteButton'
import SaveButton from '@/components/SaveButton'
import MemberSince from '@/components/MemberSince'
import MarketDistanceDisplay from '@/components/MarketDistanceDisplay'
import MessageButton from '@/components/MessageButton'
import AddressLink from '@/components/AddressLink'
import HostFMStallInfo from '@/components/HostFMStallInfo'
import HostFMarketWeeklySch from '@/components/HostFMarketWeeklySch'
import HostFMarketRandomDates from '@/components/HostFMarketRandomDates'
import { FaGlobe, FaExternalLinkAlt } from 'react-icons/fa'

// Helper functions
const normalizeUrl = (u) => {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  return `https://${u}`
}

const cleanPhone = (p) => (p ? String(p).replace(/[^\d]/g, '') : '')
const formatPhone = (p) => {
  const d = cleanPhone(p)
  if (d.length === 10)
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  return p || ''
}

const MarketDetails = ({ market, voteData, saveData, messageButtonProps }) => {
  const weekly = market?.hostfm_weekly_sched ?? {}
  const hasWeekly =
    weekly?.weekly_sched === true || weekly?.weekly_sched === 'true'

  const randomDatesObj = market?.hostfm_dates ?? {}
  const hasRandomFlag =
    randomDatesObj?.hostfm_randomdates === true ||
    randomDatesObj?.hostfm_randomdates === 'true'
  const hasRandomEntries =
    Array.isArray(randomDatesObj?.dates) && randomDatesObj.dates.length > 0

  const showWeekly = hasWeekly
  const showRandom = !hasWeekly && (hasRandomFlag || hasRandomEntries)

  const addr = market?.hostfm_address ?? {}
  const site = market?.hostfm_website ? normalizeUrl(market.hostfm_website) : ''
  const hasStall =
    market?.stall_avail === true || market?.stall_avail === 'true'

  return (
    <article
      className='bg-white rounded-xl shadow-lg overflow-hidden'
      itemScope
      itemType='https://schema.org/FarmersMarket'
    >
      {/* Market Header Section */}
      <header className='bg-sky-700'>
        <div className='max-w-4xl mx-auto py-8 px-4 text-center'>
          <h1
            className='text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl'
            itemProp='name'
          >
            {market.hostfm_name}
          </h1>

          {market?.hostfm_type && (
            <p
              className='text-xl text-white mb-6 drop-shadow-lg'
              itemProp='description'
            >
              {market.hostfm_type}
            </p>
          )}

          <div className='flex flex-col items-center gap-4'>
            <MemberSince createdAt={market.createdAt} />

            {/* Location */}
            <div
              className='flex items-center gap-2'
              aria-label='Market location'
            >
              <AddressLink
                className='text-white text-lg font-semibold hover:text-gray-200 underline decoration-dotted underline-offset-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded drop-shadow-lg'
                address={{
                  add_line1: addr?.add_line1,
                  add_line2: addr?.add_line2,
                  city: addr?.city,
                  state_name: addr?.state_name,
                  state_code: addr?.state_code,
                  zipcode: addr?.zipcode,
                }}
                mode='directions'
              />
            </div>

            {/* Distance Display */}
            <MarketDistanceDisplay
              marketId={market._id}
              className='text-center text-white drop-shadow-lg'
            />

            {/* Phone */}
            {addr?.hostfm_phone && (
              <a
                href={`tel:${cleanPhone(addr.hostfm_phone)}`}
                className='text-white hover:text-gray-200 underline decoration-dotted underline-offset-4 drop-shadow-lg'
              >
                {formatPhone(addr.hostfm_phone)}
              </a>
            )}

            {/* Website */}
            {site && (
              <div className='flex flex-col items-center'>
                <a
                  href={site}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 text-xl font-bold text-white hover:text-gray-200 underline drop-shadow-lg'
                  title={`Open website for ${market.hostfm_name}`}
                  aria-label={`Open website for ${market.hostfm_name}`}
                >
                  <FaGlobe
                    className='w-8 h-8'
                    aria-hidden
                  />
                  <span>Visit Website</span>
                  <FaExternalLinkAlt
                    className='w-4 h-4 opacity-80'
                    aria-hidden
                  />
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Market Content */}
      <div className='p-8'>
        {/* Actions Section */}
        {(voteData || saveData || messageButtonProps) && (
          <section className='mb-12'>
            <div className='bg-yellow-600 p-6 rounded-lg border border-yellow-700'>
              <h2 className='text-lg font-semibold text-white mb-4 drop-shadow-lg text-center'>
                Market Actions
              </h2>
              <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                {messageButtonProps && (
                  <MessageButton
                    postingType={messageButtonProps.postingType}
                    postingId={messageButtonProps.postingId}
                    recipientId={messageButtonProps.recipientId}
                    postingName={messageButtonProps.postingName}
                    currentUserId={messageButtonProps.currentUserId}
                  />
                )}
                {voteData && (
                  <VoteButton
                    id={voteData.id}
                    type='market'
                    initialVoteCount={voteData.voteCount}
                    initialHasVoted={voteData.hasVoted}
                    isLoggedIn={voteData.isLoggedIn}
                  />
                )}
                {saveData && (
                  <SaveButton
                    id={saveData.id}
                    type='market'
                    initialHasSaved={saveData.hasSaved}
                    isLoggedIn={saveData.isLoggedIn}
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Stall Availability Section */}
        <section className='mb-12'>
          {hasStall ? (
            <div className='bg-emerald-700 p-6 rounded-lg border border-emerald-700'>
              <HostFMStallInfo market={market} />
            </div>
          ) : (
            <div className='bg-emerald-700 p-6 rounded-lg border border-emerald-700 text-center'>
              <p className='text-lg text-white'>
                No stall availability for vendors at this time.
              </p>
            </div>
          )}
        </section>

        {/* Schedule Section */}
        <section className='mb-12'>
          <div className='bg-white p-6 rounded-lg shadow-lg border border-sky-200'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
              Market Schedule
            </h2>

            {showWeekly && <HostFMarketWeeklySch weekly={weekly} />}
            {showRandom && (
              <HostFMarketRandomDates
                datesArr={
                  Array.isArray(randomDatesObj?.dates)
                    ? randomDatesObj.dates
                    : []
                }
                legacyObj={randomDatesObj}
              />
            )}
            {!showWeekly && !showRandom && (
              <div className='text-center'>
                <p className='text-gray-700'>
                  No schedule information posted yet for this market.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </article>
  )
}

export default MarketDetails

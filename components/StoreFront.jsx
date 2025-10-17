import { formatPhone } from '@/utils/formatPhone'
import AddressLink from '@/components/AddressLink'

const DAYS = [
  ['monday', 'Monday'],
  ['tuesday', 'Tuesday'],
  ['wednesday', 'Wednesday'],
  ['thursday', 'Thursday'],
  ['friday', 'Friday'],
  ['saturday', 'Saturday'],
  ['sunday', 'Sunday'],
]

export default function StoreFront({ locobiz }) {
  const addr = locobiz?.locobiz_address ?? {}
  const hours = locobiz?.business_hours ?? {}
  const hasPhone = Boolean(addr?.biz_phone)

  return (
    <section
      aria-labelledby='storefront-heading'
      className='mt-6'
    >
      <h2
        id='storefront-heading'
        className='text-2xl pt-3 text-center font-bold text-black'
      >
        {locobiz?.locobiz_name ?? 'Storefront'}
      </h2>
      <p className='text-xl text-center text-black'>
        Physical Address and Hours of Farmstand or Storefront
      </p>

      {hasPhone && (
        <div className='flex justify-center items-center'>
          <a
            href={`tel:${addr.biz_phone}`}
            className='text-xl text-green-900 hover:underline'
          >
            {formatPhone(addr.biz_phone)}
          </a>
        </div>
      )}

      <div className='flex justify-center items-center'>
        <AddressLink
          address={addr}
          mode='directions'
          className='text-xl'
        />
      </div>

      {/* Only show hours table if there are actual hours specified */}
      {(() => {
        const hasAnyHours = DAYS.some(([key]) => {
          const value = String(hours?.[`${key}_hours`] ?? '').trim()
          return Boolean(value)
        })

        if (!hasAnyHours) return null

        return (
          <div className='mt-8'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='inline-block min-w-full align-middle sm:px-6 lg:px-8'>
                <div className='overflow-hidden sm:rounded-xl bg-white ring-1 ring-black/25 shadow-2xl transition-shadow duration-300'>
                  <table className='min-w-full'>
                    <caption className='sr-only'>
                      Weekly storefront hours
                    </caption>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th
                          scope='col'
                          className='py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-black'
                        >
                          Day
                        </th>
                        <th
                          scope='col'
                          className='py-3.5 px-3 text-left text-sm font-semibold text-black'
                        >
                          Hours
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 [&_tr:nth-child(odd)]:bg-gray-50 border-t-2 border-gray-700'>
                      {DAYS.map(([key, label]) => {
                        const value = String(
                          hours?.[`${key}_hours`] ?? ''
                        ).trim()
                        // Only render the row if there are actual hours specified
                        if (!value) return null

                        return (
                          <tr key={key}>
                            <th
                              scope='row'
                              className='whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900'
                            >
                              {label}
                            </th>
                            <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-900'>
                              {value}
                            </td>
                          </tr>
                        )
                      }).filter(Boolean)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </section>
  )
}

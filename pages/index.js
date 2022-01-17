import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Page() {
  const { data: session, status } = useSession()
  const [dateRange, setDateRange] = useState({ start: '2021-01-01', end: '2021-03-31' })
  const [reqres, setreqres] = useState({})
  const description = {
    3: 'Montant des ventes avec une TVA de 21% comprise',
    44: 'Montant des ventes Intracom (Service)',
    54: 'Montant de la TVA des grilles 01, 02, 03',
    55: 'Montant supposé (21%) de la TVA des grilles 86, 88',
    59: 'TVA déductible (achat be + 55 car intracom)',
    71: 'A payer (XX - YY)',
    82: 'Montant des dépenses HTVA en belgique et eu (! uniquement service et biens divers)',
    86: 'Montant des dépenses Intracom'
  }

  const request = () => {
    fetch(`/api/req?start=${dateRange.start}&end=${dateRange.end}`)
      .then((res) => {
        if (!res.ok) return signOut()
        return res.json()
      })
      .then(setreqres)
  }

  if (status === 'loading') return 'loading...'

  if (status === 'authenticated')
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1>Hello {session.user.name}</h1>
        <button onClick={() => signOut()}>Sign out</button>

        <div className="mt-8">
          <div className="flex">
            <div>
              <label htmlFor="startDate" className="block text-gray-700 text-sm font-medium">
                Start date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  id="startDate"
                  className="block w-full border-gray-300 focus:border-indigo-500 rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm"
                  placeholder="YYYY-MM-DD"
                  value={dateRange.start}
                  onChange={(el) => setDateRange((prev) => ({ ...prev, start: el.target.value }))}
                />
              </div>
            </div>
            <div>
              <label htmlFor="endDate" className="block text-gray-700 text-sm font-medium">
                End date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  id="endDate"
                  className="block w-full border-gray-300 focus:border-indigo-500 rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm"
                  placeholder="YYYY-MM-DD"
                  forma
                  value={dateRange.end}
                  onChange={(el) => setDateRange((prev) => ({ ...prev, end: el.target.value }))}
                />
              </div>
            </div>
          </div>
          <button onClick={request} className="mt-2 px-4 py-1 bg-blue-100 rounded">
            Generate VAT report
          </button>
          {reqres && (
            <table className="mt-4 divide-gray-200 divide-y">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-2 text-left text-gray-500 text-xs font-medium tracking-wider uppercase">Id</th>
                  <th className="px-6 py-2 text-left text-gray-500 text-xs font-medium tracking-wider uppercase">
                    Montant
                  </th>
                  <th className="px-6 py-2 text-left text-gray-500 text-xs font-medium tracking-wider uppercase">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-gray-200 divide-y">
                {Object.keys(reqres).map((thisKey) => {
                  const amont = reqres[thisKey]
                  const descriptionOfThisRow = description[thisKey]

                  return (
                    <tr>
                      <td className="px-6 py-2 text-gray-900 whitespace-nowrap text-sm font-medium">{thisKey}</td>
                      <td className="px-6 py-2 text-right text-gray-900 whitespace-nowrap font-mono text-sm font-medium">
                        <span className="select-all">{`${amont.toFixed(2)}`.replace('.', ',')}</span>€
                      </td>
                      <td className="px-6 py-2 text-gray-900 whitespace-nowrap text-sm font-medium">
                        {descriptionOfThisRow}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

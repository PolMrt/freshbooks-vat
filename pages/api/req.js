import { getSession } from 'next-auth/client'

export default async function helloAPI(req, res) {
  try {
    const session = await getSession({ req }) //r7owdo
    if (session) {
      const dataRaw = await fetch(
        /* 'https://api.freshbooks.com/accounting/account/r7owdo/reports/accounting/invoice_details?start_date=2021-01-01&end_date=2021-03-31' */
        'https://api.freshbooks.com/accounting/account/r7owdo/expenses/expenses',
        {
          headers: {
            Authorization: `Bearer ...`,
            'Api-Version': `alpha`,
            'Content-Type': `application/json`
          }
        }
      )

      const data = await dataRaw.json()

      res.status(200).json({ a: data, s: session })
    } else {
      res.status(401).json({ error: 'not authorized' })
    }
  } catch (e) {
    console.log('An error occured', e)
    res.status(500).json({ error: 'an error occured' })
  }
}

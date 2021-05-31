import { getSession } from 'next-auth/client'

export default async function helloAPI(req, res) {
  try {
    const session = await getSession({ req }) //r7owdo
    if (session) {
      const belgiumVatName = 'TVA BE'
      const intracomVatName = 'TVA Intracom'

      const dataRaw = await fetch(
        'https://api.freshbooks.com/accounting/account/r7owdo/reports/accounting/invoice_details?start_date=2021-01-01&end_date=2021-03-31',
        {
          headers: {
            Authorization: `Bearer ${process.env.Bearer}`,
            'Api-Version': `alpha`,
            'Content-Type': `application/json`
          }
        }
      )

      const data = await dataRaw.json()

      const totaleTVAOnSales = data.response.result.invoice_details.clients.reduce((prev, current) => {
        return (
          prev +
          current.invoices.reduce((previousInvoice, currentInvoice) => {
            return (
              previousInvoice +
              currentInvoice.tax_summaries
                .filter((thisTax) => thisTax.tax_name === belgiumVatName)
                .reduce((previousTax, currentTax) => previousTax + parseFloat(currentTax.tax_total.amount), 0)
            )
          }, 0)
        )
      }, 0)

      const totaleSalesIntracom = data.response.result.invoice_details.clients.reduce((prev, current) => {
        return (
          prev +
          current.invoices.reduce((previousInvoice, currentInvoice) => {
            return (
              previousInvoice +
              currentInvoice.lines
                .filter((line) => line.tax_name1 === intracomVatName || line.tax_name2 === intracomVatName)
                .reduce((previousLine, currentLine) => {
                  return previousLine + parseFloat(currentLine.total.amount)
                }, 0)
            )
          }, 0)
        )
      }, 0)

      const [totaleSalesWithoutTVA6, totaleSalesWithoutTVA12, totaleSalesWithoutTVA21] = ['6', '12', '21'].map(
        (TVARate) =>
          data.response.result.invoice_details.clients.reduce((prev, current) => {
            return (
              prev +
              current.invoices.reduce((previousInvoice, currentInvoice) => {
                return (
                  previousInvoice +
                  currentInvoice.tax_summaries
                    // .filter((thisTax) => thisTax.tax_name === belgiumVatName)
                    .filter((thisTax) => thisTax.tax_rate === TVARate)
                    .reduce(
                      (previousTax, currentTax) =>
                        previousTax + parseFloat(currentTax.tax_total.amount) * (1 / (parseFloat(TVARate) / 100)),
                      0
                    )
                )
              }, 0)
            )
          }, 0)
      )

      res.status(200).json({
        54: totaleTVAOnSales,
        '01': totaleSalesWithoutTVA6,
        '02': totaleSalesWithoutTVA12,
        '03': totaleSalesWithoutTVA21,
        44: totaleSalesIntracom,
        XX: totaleTVAOnSales,
        d: data
      })
    } else {
      res.status(401).json({ error: 'not authorized' })
    }
  } catch (e) {
    console.log('An error occured', e)
    res.status(500).json({ error: 'an error occured' })
  }
}

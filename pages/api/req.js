import { getSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'

export default async function helloAPI(req, res) {
  try {
    const userData = await getToken({ req, secret: process.env.JWT_SECRET })
    console.log(userData)

    if (!userData.accessToken) {
      return res.status(401).json({ error: 'You are not logged in', logout: 1 })
    }

    const session = await getSession({ req }) //r7owdo
    if (session) {
      const belgiumVatName = 'TVA BE'
      const intracomVatName = 'TVA Intracom'
      const startDate = req.query.start
      const endDate = req.query.end
      const headers = {
        Authorization: `Bearer ${userData.accessToken}`,
        'Api-Version': `alpha`,
        'Content-Type': `application/json`
      }

      const dataTaxRaw = await fetch(
        `https://api.freshbooks.com/accounting/account/r7owdo/reports/accounting/taxsummary?start_date=${startDate}&end_date=${endDate}`,
        {
          headers
        }
      )

      const dataTax = await dataTaxRaw.json()
      if (dataTax.response?.errors?.length > 0) return res.status(500).json(dataTax.response.errors)

      //BE
      const totaleSalesWithoutTVA21 = parseFloat(
        dataTax.response.result.taxsummary.taxes.find((thisTax) => thisTax.tax_name === belgiumVatName)
          .taxable_amount_collected.amount
      )
      const totaleTVAOnSales = parseFloat(
        dataTax.response.result.taxsummary.taxes.find((thisTax) => thisTax.tax_name === belgiumVatName).tax_collected
          .amount
      )
      const allTvaOnExpense = parseFloat(
        dataTax.response.result.taxsummary.taxes.find((thisTax) => thisTax.tax_name === belgiumVatName).tax_paid.amount
      )
      const totalExpenseWithVat = parseFloat(
        dataTax.response.result.taxsummary.taxes.find((thisTax) => thisTax.tax_name === belgiumVatName)
          .taxable_amount_paid.amount
      )

      //INTRA
      const totaleSalesIntracom = parseFloat(
        dataTax.response.result.taxsummary.taxes.find((thisTax) => thisTax.tax_name === intracomVatName)
          .taxable_amount_collected.amount
      )
      const intracomExpense = parseFloat(
        dataTax.response.result.taxsummary.taxes.find((thisTax) => thisTax.tax_name === intracomVatName)
          .taxable_amount_paid.amount
      )
      const totalSuposedVATOnIntracomSales = Math.floor(intracomExpense * 21) / 100

      //
      const fifthynine = allTvaOnExpense + totalSuposedVATOnIntracomSales

      const XX = Math.round((totaleTVAOnSales + totalSuposedVATOnIntracomSales) * 100) / 100
      const YY = fifthynine

      res.status(200).json({
        // '01': totaleSalesWithoutTVA6,
        // '02': totaleSalesWithoutTVA12,
        3: totaleSalesWithoutTVA21,
        44: totaleSalesIntracom,
        54: totaleTVAOnSales,
        55: totalSuposedVATOnIntracomSales,
        59: fifthynine,
        71: Math.round((XX - YY) * 100) / 100,
        82: Math.round((totalExpenseWithVat + intracomExpense) * 100) / 100,
        86: intracomExpense,
        XX,
        YY
      })

      /*const dataInvoiceRaw = await fetch(
        `https://api.freshbooks.com/accounting/account/r7owdo/reports/accounting/invoice_details?start_date=${startDate}&end_date=${endDate}`,
        {
          headers
        }
      )

      const dataInvoice = await dataInvoiceRaw.json()
      if (dataInvoice.response?.errors?.length > 0) return res.status(500).json(dataInvoice.response.errors)

      const dataExpenseRaw = await fetch(
        `https://api.freshbooks.com/accounting/account/r7owdo/reports/accounting/expense_details?start_date=${startDate}&end_date=${endDate}`,
        {
          headers
        }
      )

      const dataExpense = await dataExpenseRaw.json()
      if (dataExpense.response?.errors?.length > 0) return res.status(500).json(dataExpense.response.errors)

      // console.log(dataExpense.response.result.total)

      // let allExpense = [...dataExpense.response.result.expenses]

      // Logic for invoices

      const totaleTVAOnSales = dataInvoice.response.result.invoice_details.clients.reduce((prev, current) => {
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

      const totaleSalesIntracom = dataInvoice.response.result.invoice_details.clients.reduce((prev, current) => {
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
          dataInvoice.response.result.invoice_details.clients.reduce((prev, current) => {
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

      // Logic for expense

      const allTvaOnExpense = dataExpense.response.result.expense_details.data.reduce(
        (prevExpenseGroup, currentExpenseGroup) => {
          return (
            prevExpenseGroup +
            currentExpenseGroup.expenses.reduce((prevExpense, currentExpense) => {
              return (
                prevExpense +
                parseFloat(currentExpense.taxAmount1.amount) +
                parseFloat(currentExpense.taxAmount2.amount)
              )
            }, 0)
          )
        },
        0
      )

      // Send result

      const XX = totaleTVAOnSales
      const YY = allTvaOnExpense

      res.status(200).json({
        54: totaleTVAOnSales,
        '01': totaleSalesWithoutTVA6,
        '02': totaleSalesWithoutTVA12,
        '03': totaleSalesWithoutTVA21,
        44: totaleSalesIntracom,
        59: allTvaOnExpense,
        71: XX - YY,
        XX,
        YY
      })
      */
    } else {
      res.status(401).json({ error: 'not authorized' })
    }
  } catch (e) {
    console.log('An error occured', e)
    res.status(500).json({ error: 'an error occured' })
  }
}

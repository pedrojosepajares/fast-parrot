<template>
  <div id="app">
    <p> Stock Return: {{ stockReturn }}</p>
    <p> Stock Risk: {{ stockRisk }}</p>
    <p> Stock Return %: {{ stockReturnPercent }}</p>
    <p> Stock Risk %: {{ stockRiskPercent }}</p>
    <p> Fast Parrot Index: {{ stockFastParrotIndex }}</p>

  </div>
</template>

<script>/* eslint-disable */
import axios from 'axios'

const MARKETOPENEDDAYS = 250

export default {
  name: 'App',
  created: function () {
    this.getData()
  },
  data() {
    return {
      stockRisk: 0,
      stockReturn: 0,
      stockFastParrotIndex: 0,
    }
  },
  methods: {
    getData() {
      axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=HP&outputsize=full&apikey=H5HKBN46EVDYZBZ2')
        .then((res) => {

          const stockInfo = res.data

          const closeprices = Object.keys(stockInfo['Time Series (Daily)'])
            .map((dayData) => {
              return parseFloat(stockInfo['Time Series (Daily)'][dayData]['4. close'])
            }).reverse()

          // Stock Simple Return
          const priceVariaton = closeprices.map((value, index) => {
            return (index == 0) ? null : (value / closeprices[index - 1]) - 1
          })
          priceVariaton.splice(0, 1)

          const average = priceVariaton.reduce((previousValue, currentValue) => {
            return previousValue + currentValue
          }) / priceVariaton.length

          console.log("Average priceVariation: " + average)

          this.stockReturn = average * MARKETOPENEDDAYS

          // Stock Risk
          this.stockRisk = Math.pow(priceVariaton.reduce((previousValue, currentValue) => {
            return previousValue + Math.pow(currentValue - average, 2)
          }) / (priceVariaton.length - 1) * MARKETOPENEDDAYS, 0.5)

          // FastParrot Index
          this.stockFastParrotIndex =parseInt((this.stockReturn / this.stockRisk) * 1000)

        })
        .catch((e) => {
        })
    },

    toPercent(n) {
      return `${(n * 100).toFixed(2)}%`
    }
  },
  computed: {
    stockReturnPercent() {
      return this.toPercent(this.stockReturn)
    },
    stockRiskPercent() {
      return this.toPercent(this.stockRisk)
    }

  },
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>

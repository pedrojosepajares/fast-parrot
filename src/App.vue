<template>
  <div id="app">
    {{ stocksInfo }}
    <stock-item v-for="info in stocksInfo" :key="info.ticker" :stockInfo="info"/>
  </div>
</template>

<script>/* eslint-disable */
import axios from 'axios'
import StockItem from './components/StockItem'
import {TICKERS, MARKET_OPENED_DAYS, TICKER_QUERY} from "./constants";

export default {
  name: 'App',
  components: {
    StockItem
  },
  created: function () {
    this.getData()
  },
  data() {
    return {
      stocksInfo: [],
    }
  },
  methods: {
    // Consume datos para cada ticker, realiza calculos y lo almacena en stocksInfo.
    getData() {
      TICKERS.map(ticker => {
        axios.get(TICKER_QUERY(ticker))
          .then(res => {

            console.log("[App.vue > getData] Recibidos datos de " + ticker);
            const stockData = res.data;

            // Calculo de los precios de cierre
            const keys = Object.keys(stockData['Time Series (Daily)']).reverse();
            const closeprices = keys.map((dayData) => {
              return parseFloat(stockData['Time Series (Daily)'][dayData]['4. close'])
            })
            console.log("[App.vue > getData] Datos de cierre de " + ticker + ":" + closeprices.slice(0, 3) + "...");

            // Variacion diaria entre precios
            const priceDailyVariation = closeprices.map((value, index) => {
              return (index === 0) ? null : (value / closeprices[index - 1]) - 1
            })
            // El calculo depende de dos componenetes consecutivas. El primer valor no se
            // puede calcular. Se elimina
            priceDailyVariation.splice(0, 1)
            console.log("[App.vue > getData] Datos de variacion de precio de " + ticker + ":" + priceDailyVariation.slice(0, 3) + "...");


            // Stock return: media de los incrementos diarios extendida a un año
            const stockReturn = this.average(priceDailyVariation) * MARKET_OPENED_DAYS;
            console.log("[App.vue > getData] Return " + ticker + ":" + stockReturn);


            // Stock risk: desviacion tipica de los incrementos diarios extendida a un año
            const stockRisk = Math.sqrt(this.variance(priceDailyVariation) * MARKET_OPENED_DAYS);
            console.log("[App.vue > getData] Risk " + ticker + ":" + stockRisk);

            // Stock Fast Parrot Index
            const stockFastParrotIndex = parseInt((stockReturn / stockRisk) * 100)
            console.log("[App.vue > getData] FP Index " + ticker + ":" + stockFastParrotIndex);


            this.stocksInfo.push({
              ticker: ticker,
              date: {
                begin: keys[0],
                end: keys[keys.length - 1]
              },
              closePrices: closeprices,
              stockReturn: stockReturn,
              stockRisk: stockRisk,
              stockFastParrotIndex: stockFastParrotIndex
            })
          })
          .catch(e => {
          })
      })
    },

    // Media aritmetica de un array
    average(array) {
      return array.reduce((previous, current) => {
        return previous + current
      }) / array.length
    },

    // Desviacion tipica de un array
    variance(array) {
      const av = this.average(array)
      return array.reduce((previous, current) => {
        return previous + Math.pow(current - av, 2)
      }) / (array.length - 1)
    },
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

<template>
  <v-app>
  <div>
    <span>{{ stockInfo.ticker }}</span>
    <span>FP Index: {{ stockInfo.stockFastParrotIndex }}</span>
  </div>
  </v-app>
</template>

<script>
export default {
  name: 'stock-item',
  props: [
    'stockInfo'
  ],
  methods: {
    // Calcula el porcentaje de un valor. Lo devuelve como cadena.
    toPercent (n) {
      return `${(n * 100).toFixed(2)}%`
    }
  }
}
</script>

<style scoped>
</style>

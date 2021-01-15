<template>
  <div class="divide-y divide-gray-400 ">

    <div class="flex items-center pt-2 mb-2 hover:bg-blue-50" 
      v-for="(pais, $index) in datosPais" :key="$index" @click="verPais(pais)"
    >
      <img class="w-10 h-auto mr-4 rounded-sm" :src="pais.bandera" :alt="pais.name">

      <div class="text-sm">
        <p class="font-semibold leading-none text-gray-700"> {{ pais.name }}</p>

        <p class="flex-wrap text-sm justify-items-stretch"> Hoy {{ numeral(pais.data.confirmados.dia).format('0,0') }} 
          <span class="ml-2 text-xs" :class="pais.data.confirmados.diff >= 0 ? 'text-green-500' : 'text-danger'">
          <span class="fa" :class="pais.data.confirmados.diff >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'" > </span>{{ pais.data.confirmados.diff }} ({{ pais.data.confirmados.porcentaje }}%) 
          </span>
        </p>
        
      </div>
    </div>
  </div>
</template>

<script>
import numeral from "numeral";
export default {
  name: "ListaPaises",
  props : { datosPais : Array },
  setup(){
    function verPais(i) {
      console.log('pais, ' , i )
    }
    return { numeral, verPais }
  }
};
</script>

<style>
</style>
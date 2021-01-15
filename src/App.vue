<template>
  <div class="container py-4 text-gray-700">
    <div class="flex justify-between mb-4">
      <div class="pt-2 text-xl font-bold">Informacion global COVID-19</div>
      <div class="relative">
        <select
        v-model="paisSeleccionado"
        @change="cargaResumen()"
          class="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
        >
          <option value="todos">Todos los Paises</option>
          <option v-for="(pais, $key) in paises" :key="$key" :value="pais"> {{ pais.name }} </option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
          <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path> 
          </svg>
        </div>
      </div>
    </div>
  </div>
  
  <div class="block mx-4 sm:flex">
    <CardDatos :bg-color="'bg-warning'" :titulo="'Total confirmados'" :color-icon="'text-yellow-200'"  :icon="'M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'"/>
    <CardDatos :bgColor="'bg-success'" :titulo="'Total recuperados'" :color-icon="'text-blue-100'" :icon="'M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'" />
    <CardDatos :bgColor="'bg-danger'"  :titulo="'Total fallecidos'" :color-icon="'text-red-300'" :icon="'M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z'" />
  </div>
</template>

<script>
import CardDatos from "@/components/cardConsolidado.vue"
import { onMounted, reactive, toRefs } from 'vue';
export default {
  name: "App",
  components: {CardDatos},
  setup(){
    const state = reactive({
      paisSeleccionado : 'todos',
      paises: [],
      datos : {
        confirmados : {},
        recuperados : {},
        fallecidos : {}
      },
      datosDePais: []
    })

    onMounted(() => {
      cargaResumen()
    })


    function cargaResumen() {
      Promise.all([obtenerResumen(),obtenerResumen(true)]).then((values) => {
        const [paisDia , paisDiaAntes] = values
       state.datos =  setDatos(paisDia, paisDiaAntes)
      })
    }

    function obtenerResumen(diaAnterior = false) {
      const url = obtenerURL() + diaAnterior
      return fetch(url)
        .then(response => console.log(response))
    }

    function obtenerURL() {
      if (state.paisSeleccionado === 'todos') {
        return "https://disease.sh/v3/covid-19/all?yesterday="
      }

      return `https://disease.sh/v3/covid-19/countries/${state.paisSeleccionado.name}?strict=true&yesterday=`;
      
    }
    function setContadores(delDia, ayer ) {
      state.paises = delDia.map( pais =>{
        return {
          name : pais.country,
          info: pais.countryInfo
        }
      }).sort((a,b ) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)

      state.datosDePais = delDia.map( pais => {
        const paisDiaAyer = ayer.find(p => p.country == pais.country)
        return {
          name: pais.country,
          bandera : pais.countryInfo.flag,
          coordenadas : [pais.countryInfo.lat , pais.countryInfo.long],
          data : setDatos(pais, paisDiaAyer)
        }
      })
    }

    function setDatos(dia , ayer) {
      let porcentaje = ((dia.todayCases - ayer.todayCases) / ayer.todayCases ) *100
      return {
        confirmados :{
          dia : dia.todayCases,
          ayer : ayer.todayCases,
          total : dia.cases,
          diff : dia.todayCases - ayer.todayCases,
          porcentaje : Number.isNaN(porcentaje) ? 0 : porcentaje.toFixed(2)
        },
        recuperados : {
          dia : dia.todayRecovered,
          ayer : ayer.todayRecovered,
          total : dia.recovered,
          diff : dia.todayRecovered - ayer.todayRecovered,
          porcentaje : (((dia.todayRecovered - ayer.todayRecovered) / ayer.todayRecovered) * 100).toFixed(2)
        },
        fallecidos : {
          dia : dia.todayDeaths,
          ayer : ayer.todayDeaths,
          total : dia.deaths,
          diff : dia.todayDeaths - ayer.todayDeaths,
          porcentaje : (((dia.todayDeaths - ayer.todayDeaths) / ayer.todayDeaths) * 100).toFixed(2)
        }
      }
    }

    return { ...toRefs(state), cargaResumen , setContadores}
  }
};
</script>

<style>
</style>

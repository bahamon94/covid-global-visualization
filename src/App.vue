<template>
<div>
 <nav class="fixed flex-wrap items-center justify-between w-full py-4 bg-gray-800 border-t-2 border-white border-solid shadow sm:flex lg:px-12">      
   <div class="pt-2 font-mono text-xl font-bold text-yellow-50"> <i class="mr-6 text-4xl text-red-500 fas fa-virus"></i>Informacion global COVID-19</div>
     
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
    </nav>
  <div class="container py-4 text-gray-700">
  
    <!-- Tarjetas de informacion datos globales -->
  <div class="block mx-4 mt-28 sm:mt-20 sm:flex sm:flex-wrap sm:-mx-6">
    <CardDatos :bg-color="'bg-warning'" :data="datos.confirmados" :titulo="'Total confirmados'" :color-icon="'text-yellow-200'"  :icon="'fa-head-side-mask'"/>
    <CardDatos :bgColor="'bg-success'" :data="datos.recuperados" :titulo="'Total recuperados'" :color-icon="'text-blue-100'" :icon="'fa-running'" />
    <CardDatos :bgColor="'bg-danger'" :data="datos.fallecidos"  :titulo="'Total fallecidos'" :color-icon="'text-red-300'" :icon="'fa-skull-crossbones'" />
  </div>

  <div class="mt-4 sm:flex sm:flex-wrap sm:-mx-4">
    <div class="w-full mb-4 sm:w-1/3 sm:px-4">
      <div class="px-4 py-2 overflow-auto bg-white rounded-md shadow-top" style="height:600px">
        <ListaPaises :datosPais="datosDePais" />
      </div>
    </div>

    <div class="w-full mb-4 sm:w-2/3 sm:px4 ">
     
      <div class="px-4 py-2 mb-4 rounded-md shadow-xl" style="height: 175px;">
        <Grafica :pais="paisSeleccionado"/>
      </div>

      <div class="px-4 py-4 bg-white rounded-md shadow-top" style="height: 410px" id="mapid">
        <Mapa :datos-paises="datosDePais" :pais="paisSeleccionado" />
      </div>
    </div>
  </div>
</div>
  </div>
</template>

<script>
import CardDatos from "@/components/cardConsolidado.vue"
import Grafica from "@/components/grafica"
import ListaPaises from "@/components/paisesLista";
import Mapa from "@/components/mapa";
import { onMounted, reactive, toRefs } from 'vue';
export default {
  name: "App",
  components: {CardDatos, Grafica, ListaPaises,Mapa},
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
      cargarPaises()
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
      return fetch(url).then(response =>  response.json() )
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

    function cargarPaises() {
      Promise.all([obtenerPais(), obtenerPais(true)]).then( (values) => {
        const [paisDia, paisAyer] = values
        setContadores(paisDia, paisAyer)
      })
    }

    function obtenerPais(diaAnterior = false) {
      return fetch('https://disease.sh/v3/covid-19/countries?sort=todayCases&yesterday=' + diaAnterior).then( r => r.json() )
    }


    return { ...toRefs(state), cargaResumen }
  }
};
</script>

<style>
</style>

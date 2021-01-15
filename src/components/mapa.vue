<template>
  <span></span>  
</template>

<script>
import numeral from "numeral"
import LF from "leaflet"
import 'leaflet.minichart/dist/leaflet.minichart.js'
import { onMounted, reactive, watch } from 'vue';

export default {
 name : 'Mapa',
 props : {
   datosPaises : Array,
   pais : [Object, String]
 },
 setup(props){
   const state = reactive({
     map : null,
     token: 'pk.eyJ1IjoiYmFoYW1vbjk0IiwiYSI6ImNranlocDN2cjBlaW8zNW95ZG9sMnY4N2kifQ.h8QdbspLhq_uC7a3aPatLw'
   })

   onMounted(() => {
     pintarMapa()
   })

   watch(
     () => props.datosPaises,
     () => { pintarMapa() }
   )

   watch(
     () => props.pais,
     () => {centrar()}
   )

   function pintarMapa() {
     if (state.map != null) {
       state.map.remove()
     }

     state.map = LF.map('mapid').setView([0,20], 1.5)

     LF.tileLayer( "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" + state.token, {
       attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom : 4,
      id: "mapbox/dark-v10",
      tileSize : 530,
      zoomOffset: -1,
      accesToken: state.token
     }).addTo(state.map)

     let miniGraficasPaises = {}
     let arrConfirmados = props.datosPaises.map(pais => pais.data.confirmados.total)
     let maxConfirmados = Math.max(...arrConfirmados)

     props.datosPaises.forEach(pais => {
       let diferencia = [
         pais.data.confirmados.total,
         pais.data.recuperados.total,
         pais.data.fallecidos.total
       ]

       let tamanio = (60 * Math.sqrt(pais.data.confirmados.total)) / Math.sqrt(maxConfirmados)
        miniGraficasPaises[pais.name] = LF.minichart(pais.coordenadas, { 
          properties : pais,
          data : diferencia,
          type : 'pie',
          colors : ['rgb(144,238,144)','rgb(175,238,238)','rgb(255,99,71)'],
          width: tamanio <= 7 ? 7 : tamanio
        })

      state.map.addLayer(miniGraficasPaises[pais.name])
      miniGraficasPaises[[pais.name]].on('click', (e) => { popup(e.target.options.properties) })
     })
   }

   function centrar(){
     if (props.pais !== 'todos') {
       state.map.flyTo( new LF.LatLng(props.pais.info.lat, props.pais.info.long) )
     }
   }

   function popup(pais) {
     function numeroPunto(x) {
       return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
     }
     LF.popup()
      .setLatLng(pais.coordenadas)
      .setContent(`
        <center><img class="w-16 h-auto mb-2 rounded-sm" src="${pais.bandera}" />
          <p class="text-lg font-semibold leading-none text-gray-700">${pais.name}</p></center>
          <div class="divide-y divide-gray-400 text-md">
            <div class="py-2 text-warning">Confirmados : <b>${numeroPunto(pais.data.confirmados.total)}</b></div>
            <div class="py-2 text-success">Recuperados : <b>${numeroPunto(pais.data.recuperados.total)}</b></div>
            <div class="py-2 text-danger">Fallecidos : <b>${numeroPunto(pais.data.fallecidos.total)}</b></div>
        </div>
      `).openOn(state.map)
   }

   
 return { numeral }
 }
}
</script>

<style>

</style>
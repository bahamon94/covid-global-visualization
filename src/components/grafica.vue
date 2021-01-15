<template>
  <canvas id="myGrafic" height="100%"> </canvas>
</template>

<script>
import Chart from "chart.js";
import numeral from "numeral";
import { onMounted, reactive, watch } from 'vue';

export default {
  name: "GraficaData",
  props: {
    pais: [Object,String],
  },
  setup(props) {
    const state = reactive({
      historias :[],
      grafica : null
    })

    watch(
      () => props.pais,
      () => { pintarGrafica() }
    )

    onMounted(() => {
      pintarGrafica()
    })

    function cargarHistorias() {
      const url = `https://disease.sh/v3/covid-19/historical/${ props.pais === 'todos' ? 'all' : props.pais.name }?lastdays=all`
      return fetch(url).then( response => response.json())
    }

    async function pintarGrafica(){
      state.historias = await cargarHistorias()
      if (state.historias) {
        if (props.pais !== 'todos') {
          state.historias = state.historias.timeline
      }
      const labels = Object.keys(state.historias.cases)
      const confirmados = Object.values(state.historias.cases)
      const recuperados = Object.values(state.historias.recovered)
      const fallecidos = Object.values(state.historias.deaths)
      setGrafica(labels, confirmados, recuperados, fallecidos)

      }
    }

    function setGrafica(labels, confirmados, recuperados, fallecidos){
      state.grafica == null ? "" : state.grafica.destroy()
      const ctx = document.getElementById('myGrafic').getContext('2d')
      state.grafica = new Chart(ctx, {
         type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: "Confirmados",
              data: confirmados,
              borderColor: "#FF9F1C",
              fill: false,
            },
            {
              label: "Recuperados",
              data: recuperados,
              borderColor: "#2EC4B6",
              fill: false,
            },
            {
              label: "Fallecidos",
              data: fallecidos,
              borderColor: "#E71D36",
              fill: false,
            },
          ],
        },
        options: {
          legend: false,
          scales: {
            yAxes: [
              {
                gridLines: {
                  color: "rgba(0, 0, 0, 0)",
                },
                ticks: {
                  callback: function (value) {
                    return numeral(value).format("0a");
                  },
                },
              },
            ],
            xAxes: [
              {
                gridLines: {
                  color: "rgba(0, 0, 0, 0)",
                },
              },
            ],
          },
          elements: {
            point: {
              radius: 0,
            },
            line: {
              borderWidth: 1,
            },
          },
          tooltips: {
            enabled: true,
            mode: "x-axis",
            callbacks: {
              label: function (tooltipItem, data) {
                let label = data.datasets[tooltipItem.datasetIndex].label || "";
                if (label) {
                  label += ": ";
                }
                label += numeral(tooltipItem.yLabel).format('0,0')
                return label    
              }
             }
          }
        }
      })
    }

  }
}
    
          
     
      
</script>

<style>
</style>
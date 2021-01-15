<template>
  <div class="w-full mb-4 sm:w-1/3 sm:px-4" >
			<div class="px-4 py-2 text-white rounded-md " :class="bgColor">
      <div class="flex justify-between">
        <div>
          <div class="text-lg"> {{ titulo }} </div> 
          <div class="text-3xl font-bold"> {{ numeral(data.total).format('0,0')}} </div>
          <div class="flex my-2 text-sm">
            <span class="flex-wrap px-2 py-0 text-xs bg-white rounded" :class="data.diff >= 0  ? 'text-success' : 'text-danger'"> 
              <span class="fa" :class="data.diff >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></span>
              {{ numeral(data.diff).format('0,0') }}
              ({{ data.porcentaje }} %)
            </span>
            <span class="ml-2 font-bold underline">Hoy {{ numeral(data.dia).format('0,0')}}</span>

          </div>
        </div>
          <div class="pt-2 text-6xl sm:hidden md:flex" :class="colorIcon">
          <i class="fas" :class="icon"></i>
          </div>
      </div>

			</div>
</div>
</template>

<script>
import numeral from "numeral";
export default {
  name: "tarjetaDatos" ,
  props: {
    bgColor : String,
    titulo: String,
    icon : String,
    colorIcon : String,
    data : Object
  },
  setup(){
    
    return { numeral}
  }
}
</script>

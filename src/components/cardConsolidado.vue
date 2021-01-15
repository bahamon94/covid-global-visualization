<template>
  <div class="w-full mb-4 sm:w-1/3 sm:px-4" >
			<div class="px-4 py-2 text-white rounded-md " :class="bgColor">
      <div class="flex justify-between">

        <!-- <h6 class="font-light text-gray-200 datepub ">Publier le 10/09/2019</h6> -->
        <!-- <div class="mt-2 text-2xl font-bold leading-tight text-gray-100 category_title">Le casque du Salut</div> -->
        <!-- <div class="text-justify text-gray-100 extratext"> Le caque du salut, de l'espérance du salut. Le casque 		était pour protéger la tête des soldats.Qu'on prenne, je vous prie, un peu d'eau, et lavez 		vos pieds, et ... <br>
        <button class="p-1 font-medium text-green-500 bg-gray-100 rounded-lg">Lire la suite</button>
        </div> -->
        <div>
          <div class="text-lg"> {{ titulo }} </div> 
          <div class="text-3xl font-bold"> {{ numeral(12).format('0,0')}} </div>
          <div class="flex mb-2 text-sm">
            <span class="px-2 py-0 ml-2 text-xs bg-white rounded" :class="false ? 'text-success' : 'text-danger'"> 
               <span class="fa" :class="true  ? 'fa-arrow-up' : 'fa-arrow-down'"></span>
              {{ numeral(1213231).format('0,0') }}
              (1224435465%)
            </span>
            <span class="ml-2 font-bold">Hoy {{ numeral(10).format('0,0')}}</span>

          </div>
        </div>
				<div class="w-1/4" :class="colorIcon">
          <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"  :d="icon" clip-rule="evenodd" />
          </svg>
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
    icon : Number,
    colorIcon : String,
    data : Object
  },
  setup(){
    
    return { numeral}
  }
}
</script>

import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import numeral from "numeral"

const app = createApp(App)

numeral.register('locale', 'id', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'K',
        million: 'M',
        billion: 'B',
        trillion: 'T'
    },
    currency: {
        symbol: 'COP'
    }
})

numeral.locale('id')

app.mount('#app')

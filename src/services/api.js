import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:9000' // Troque pelo endereço remoto se estiver em produção
})

export default api
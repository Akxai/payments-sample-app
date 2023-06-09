import checkoutSessionsAPI, {
  CreateCheckoutSessionPayload,
} from '@/lib/checkoutSessionsApi'

declare module 'vue/types/vue' {
  interface Vue {
    $checkoutSessionsApi: {
      getCheckoutSessionById: any
      getCheckoutSessions: any
      createCheckoutSession: (payload: CreateCheckoutSessionPayload) => any
      extendCheckoutSession: (checkoutSessionId: string, payload: any) => any
    }
  }
}

export default ({ store }: any, inject: any) => {
  const instance = checkoutSessionsAPI.getInstance()

  instance.interceptors.request.use(
    function (config) {
      store.commit('CLEAR_REQUEST_DATA')
      store.commit('SET_REQUEST_URL', `${config.baseURL}${config.url}`)
      store.commit('SET_REQUEST_PAYLOAD', config.data)

      if (store.state.bearerToken) {
        config.headers = { Authorization: `Bearer ${store.state.bearerToken}` }
      }
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    function (response) {
      store.commit('SET_RESPONSE', response)
      return response
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  inject('checkoutSessionsApi', checkoutSessionsAPI)
}

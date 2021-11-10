import { Platform } from 'react-native';
import * as querystring from 'querystring'
//const api_base_url = process.env.API_BASE_URL
const api_base_url = 'https://api.coingecko.com/api/v3/'
// const db_base_url = 'http://10.0.2.2:5000/'; //localhost
// const webdb_base_url = 'http://localhost:5000/';
// const base_url = Platform.OS === 'web' ? webdb_base_url : db_base_url;
const base_url = 'https://coinmomo-db-server-9y4ai.ondigitalocean.app/' //digital ocean

const API_ENDPOINTS = {
  assets: {
    url: api_base_url + 'assets'
  },
  assetsDetailsById: (id) => {
    return api_base_url + 'assets/' + id
  },
  assetsHistory: (id) => {
    return api_base_url + 'assets/' + id + '/history?interval=d1'
  },
  assetsMarket: (id) => {
    return api_base_url + 'assets/' + id + 'markets'
  },
  rates: {
    url: api_base_url + 'rates'
  },
  ratesDetailsById: (id) => {
    return api_base_url + 'rates/' + id
  },
  links: (id) => {
    return api_base_url + 'coins/' + id
  },
  exchanges: (pgNo) => {
    return base_url + 'fetch/exchanges/10/' + pgNo
  },
  exchangesDetailsById: (id) => {
    return api_base_url + 'exchanges' + id
  },
  marketDataSort: (pgNo, colName, order) => {
    return base_url + `fetch/markets/15/${pgNo}/${colName}/${order}`
  },
  derivativesDataSort: (pgNo, colName, order) => {
    return base_url + `fetch/derivatives/10/${pgNo}/${colName}/${order}`
  },
  markets: (pgNo) => {
    return base_url + 'fetch/markets/15/' + pgNo
  },
  coinEvents: {
    url: base_url + 'find/events/'
  },
  derivatives: (pgNo) => {
    return base_url + 'fetch/derivatives/10/' + pgNo
  },
  events: (pgNo) => {
    return base_url + 'fetch/events/10/' + pgNo
  },
  eventsFilter: {
    url: base_url + 'find/events'
  },
  btcToUsd: {
    url: api_base_url + 'exchange_rates'
  },
  highlights: {
    url: base_url + 'fetch/events/popular/'
  },
  signup: {
    url: base_url + 'insert/user'
  },
  signupVerification: {
    url: base_url + 'find/users'
  },
  signin: {
    url: base_url + 'find/users'
  },
  fetchCoins: {
    url: base_url + 'fetch/markets/coins'
  },
  findAssets: {
    url: base_url + 'find/assets'
  },
  findTransactions: {
    url: base_url + 'find/transactions'
  },
  insertAssets: {
    url: base_url + 'insert/assets'
  },
  insertTransactions: {
    url: base_url + 'insert/transactions'
  },
  updateTransactions: {
    url: base_url + 'update/transactions'
  },
  deleteTransactions: {
    url: base_url + 'delete/transactions'
  },
  deleteAssets: {
    url: base_url + 'delete/assets'
  },
  fetchCategories: {
    url: base_url + 'find/events/categories'
  },
  assetsTable: {
    url: base_url + 'find/markets/'
  },
  thread: {
    url: base_url + 'find/forum/thread/'
  },
  fetchTitle: {
    url: base_url + 'find/forum/titles/'
  },
  editPortfolio: {
    url: base_url + 'update/portfolio'
  },
  deletePortfolio: {
    url: base_url + 'delete/portfolio'
  },
  addPortfolio: {
    url: base_url + 'insert/portfolio'
  },
  findPortfolio: {
    url: base_url + 'find/portfolio'
  },
  fetchCommunity: {
    url: base_url + 'find/forum/community'
  },
  findTags: {
    url: base_url + 'find/forum/tags'
  },
  insertThread: {
    url: base_url + 'insert/forum/thread'
  },
  findThread: {
    url: base_url + 'find/forum/thread'
  },
  fetchTitle: {
    url: base_url + 'find/forum/titles'
  },
  conversationUpdate: {
    url: base_url + 'update/forum/thread'
  },
  insertReplies: {
    url: base_url + 'insert/forum/replies'
  },
  conversationRepliesUpdate: {
    url: base_url + 'update/forum/replies'
  },
  deleteForumReplies: {
    url: base_url + 'delete/forum/replies'
  },
  sortByMarket: {
    url: base_url + 'fetch/markets/bysort'
  },
  conversationReplies: {
    url: base_url + 'find/forum/replies'
  },
  userData: {
    url: base_url + 'get/forum/user/activity'
  },
  threadLike: {
    url: base_url + 'add/forum/thread/like'
  },
  repliesLike: {
    url: base_url + 'add/forum/replies/likes'
  },
  visited: {
    url: base_url + 'add/forum/thread/visited'
  },
  reputation: {
    url: base_url + 'get/forum/user/reputation'
  },
  threadSortby: {
    url: base_url + 'find/forum/thread/sortby'
  },
}
const API = {
  request: async (endpoint, data = undefined, method = 'GET', id = null, pgNo = null, colName = null, order = null, params = {}, assetsParams = null) => {
    let headers = {};
    let dataParam = undefined;

    //Checking Headers
    if (data !== undefined && data.headers) {
      headers = data.headers;
    }
    else {
      headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    }
    //Checking data param / data body
    if (data !== undefined && data.body) {
      dataParam = data.body;
    }
    let url = id ? API_ENDPOINTS[endpoint](id) : colName && pgNo ? API_ENDPOINTS[endpoint](pgNo, colName, order) : pgNo ? API_ENDPOINTS[endpoint](pgNo) : API_ENDPOINTS[endpoint].url;
    url = `${url}?${querystring.stringify(params)}`
    if (assetsParams) {
      let EndPoints = ''
      Object.keys(assetsParams).forEach((key, index) => {
        EndPoints += `${index ? "&" : ''}${key}=${typeof assetsParams[`${key}`] == "object" ? JSON.stringify(assetsParams[`${key}`]) : assetsParams[`${key}`]}`

      })
      url += EndPoints
    }
    let result = fetch(url, {
      method: method,
      headers: headers,
      body: dataParam ? JSON.stringify(dataParam) : undefined
    })
      .then(response => response.json())
      .then(data => {
        if (assetsParams) {
          return data
        }
        if (data.result)
          return data.result;
        else
          return data;
      })
      .catch((error) => {
        console.log('error', error)
        return error;
      })
    return result;
  }
}

export { API, API_ENDPOINTS };
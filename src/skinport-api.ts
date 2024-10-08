import axios from 'axios'

type ItemsArgs = {
  tradable: boolean
  appId?: number
  currency?: string
}

export type ItemsResponse = {
  market_hash_name: string
  currency: 'EUR'
  suggested_price: number
  item_page: string
  market_page: string
  min_price: number
  max_price: number
  mean_price: number
  quantity: number
  created_at: number
  updated_at: number
}

export class SkinportApi {
  private http = axios.create({
    baseURL: 'https://api.skinport.com',
  })

  public async items(args: ItemsArgs): Promise<ItemsResponse[]> {
    const { appId = 730, currency = 'EUR', tradable } = args
    const { data } = await this.http.get('/v1/items', {
      params: { app_id: appId, currency, tradable },
    })
    return data
  }
}

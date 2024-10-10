import { HttpException, Inject, Injectable } from '@nestjs/common'
import { ItemsResponse, SkinportApi } from './skinport-api'
import * as fs from 'fs'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'

const ITEMS_CACHE_TTL = 1000 * 60 * 5

/**
 * Бизнес логика для работы с элементами
 */
@Injectable()
export class ItemService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Формирование конечного списка элементов
   */
  public getItems(): Promise<
    Array<ItemsResponse & { min_price_tradable: number }>
  > {
    return this.cacheWrap(async () => {
      console.log('getItems')

      // const { itemsWithoutTradable, itemsWithTradable } =
      //   this.getItemsFromFile()

      const { itemsWithoutTradable, itemsWithTradable } =
        await this.getItemsFromApi()

      return this.makeResultItems(itemsWithoutTradable, itemsWithTradable)
    })
  }

  /**
   * Объединение двух списков в один
   * @param itemsWithoutTradable
   * @param itemsWithTradable
   * @private
   */
  private makeResultItems<T extends ItemsResponse[]>(
    itemsWithoutTradable: T,
    itemsWithTradable: T,
  ) {
    const itemsWithTradableMap = new Map(
      itemsWithTradable.map((item) => [item.market_hash_name, item]),
    )

    const resultItems = itemsWithoutTradable.map((item) => {
      const tradable = itemsWithTradableMap.get(item.market_hash_name)
      return {
        ...item,
        min_price_tradable: tradable?.min_price,
      }
    })

    return resultItems
  }

  /**
   * Получение двух списка элементов через API
   * @private
   */
  private async getItemsFromApi() {
    const api = new SkinportApi()
    const [itemsWithoutTradable, itemsWithTradable] = await Promise.all([
      api.items({ tradable: false }),
      api.items({ tradable: true }),
    ])

    return { itemsWithoutTradable, itemsWithTradable }
  }

  /**
   * Получение двух списка элементов через JSON файлы для отладки
   * @private
   */
  private getItemsFromFile() {
    const itemsWithoutTradable: ItemsResponse[] = JSON.parse(
      fs.readFileSync('./itemsWithoutTradable.json').toString(),
    )
    const itemsWithTradable: ItemsResponse[] = JSON.parse(
      fs.readFileSync('./itemsWithTradable.json').toString(),
    )

    return { itemsWithoutTradable, itemsWithTradable }
  }

  /**
   * Обертка для кэширования результата
   * @param fn
   * @private
   */
  private async cacheWrap<T>(fn: () => Promise<T>): Promise<T> {
    let items: T = await this.cacheManager.get('items')

    if (items) {
      return items
    }

    items = await fn()

    await this.cacheManager.set('items', items, ITEMS_CACHE_TTL)

    return items
  }
}

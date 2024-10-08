import { DataSource } from 'typeorm'
import { Transactions } from './transactions'
import { HttpException, Injectable } from '@nestjs/common'
import { ItemService } from './item.service'

@Injectable()
export class PurchasesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly itemService: ItemService,
  ) {}

  public async buy(itemId: string) {
    const item = await this.getItem(itemId)
    const balance = await this.getUserBalance()

    const itemPrice = item.min_price_tradable

    if (itemPrice > balance) {
      throw new HttpException('Insufficient funds', 400)
    }

    await this.buyItem(itemPrice)
  }

  private async getUserBalance(): Promise<number> {
    const transactionsRepository = this.dataSource.getRepository(Transactions)

    const sum = await transactionsRepository
      .createQueryBuilder()
      .select('COALESCE(SUM(amount), 0)', 'balance')
      .getRawOne()

    return sum.balance
  }

  private async getItem(itemId: string) {
    const items = await this.itemService.getItems()

    const item = items.find((item) => item.market_hash_name === itemId)

    if (!item) {
      throw new HttpException('Item not found: ' + itemId, 400)
    }

    return item
  }

  private async buyItem(amount: number) {
    const transactionsRepository = this.dataSource.getRepository(Transactions)
    const transaction = transactionsRepository.create({ amount: -amount })
    await transactionsRepository.save(transaction)
  }
}

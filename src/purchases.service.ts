import { DataSource } from 'typeorm'
import { Transactions } from './transactions'
import { HttpException, Injectable } from '@nestjs/common'
import { ItemService } from './item.service'

/**
 * Сервис для покупок
 */
@Injectable()
export class PurchasesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly itemService: ItemService,
  ) {}

  /**
   * Покупка элемента
   * @param itemId
   */
  public async buy(itemId: string) {
    const item = await this.itemService.getItemById(itemId)
    const balance = await this.getUserBalance()

    const itemPrice = item.min_price_tradable

    if (itemPrice > balance) {
      throw new HttpException('Insufficient funds', 400)
    }

    await this.buyItem(itemPrice, itemId)
  }

  /**
   * Получение баланса пользователя
   * @private
   */
  private async getUserBalance(): Promise<number> {
    const transactionsRepository = this.dataSource.getRepository(Transactions)

    const sum = await transactionsRepository
      .createQueryBuilder()
      .select('COALESCE(SUM(amount), 0)', 'balance')
      .getRawOne()

    return sum.balance
  }

  /**
   * Запись транзакции в БД на покупку элемента
   * @param amount
   * @param itemId
   * @private
   */
  private async buyItem(amount: number, itemId: string) {
    const transactionsRepository = this.dataSource.getRepository(Transactions)
    const transaction = transactionsRepository.create({
      amount: -amount,
      itemId,
    })
    await transactionsRepository.save(transaction)
  }
}

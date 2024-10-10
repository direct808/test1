import { DataSource, EntityManager } from 'typeorm'
import { HttpException, Injectable } from '@nestjs/common'
import { Item, Transaction, User } from './entities'

/**
 * Сервис для покупок
 */
@Injectable()
export class PurchasesService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Покупка элемента
   * @param itemId
   * @param userId
   */
  public async buy(itemId: string, userId: string) {
    return this.dataSource.transaction(
      'REPEATABLE READ',
      async (transaction) => {
        const item = await this.getItemById(transaction, itemId)
        const user = await this.getUser(transaction, userId)

        if (item.price > user.balance) {
          throw new HttpException('Insufficient funds', 400)
        }

        await this.buyItem(transaction, item, user)
      },
    )
  }

  /**
   * Получение баланса пользователя
   * @private
   */
  private getUser(transaction: EntityManager, userId: string): Promise<User> {
    const userRepository = transaction.getRepository(User)
    return userRepository.findOneOrFail({ where: { id: userId } })
  }

  /**
   * Запись транзакции в БД на покупку элемента
   * @param transaction
   * @param item
   * @param user
   * @private
   */
  private async buyItem(transaction: EntityManager, item: Item, user: User) {
    const transactionsRepository = transaction.getRepository(Transaction)
    const userRepository = transaction.getRepository(User)
    const transactionItem = transactionsRepository.create({
      amount: -item.price,
      item,
      user,
    })

    user.balance -= item.price

    await transactionsRepository.save(transactionItem)
    await userRepository.save(user)
  }

  /**
   * Получение товара по id
   * @param transaction
   * @param itemId
   * @private
   */
  private getItemById(
    transaction: EntityManager,
    itemId: string,
  ): Promise<Item> {
    const itemRepository = transaction.getRepository(Item)
    return itemRepository.findOneOrFail({ where: { id: itemId } })
  }
}

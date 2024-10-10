import { Column, Entity, OneToMany } from 'typeorm'
import { Transaction } from './transactions.entity'

@Entity()
export class Item {
  @Column({
    type: 'uuid',
    generated: 'uuid',
    primary: true,
  })
  id: string

  @Column('varchar')
  name: string

  @OneToMany(() => Transaction, (transaction) => transaction.item)
  transactions: Transaction[]

  @Column('numeric', { precision: 10, scale: 2 })
  price: number
}

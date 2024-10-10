import { Column, Entity, ManyToOne } from 'typeorm'
import { User } from './users.entity'
import { Item } from './items.entity'

@Entity()
export class Transaction {
  @Column({
    type: 'uuid',
    generated: 'uuid',
    primary: true,
  })
  id: string

  @ManyToOne(() => User, (user) => user.transactions)
  user: User

  @ManyToOne(() => Item, (item) => item.transactions)
  item: Item

  @Column('numeric', { precision: 10, scale: 2 })
  amount: number
}

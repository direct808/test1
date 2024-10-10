import { Column, Entity, OneToMany } from 'typeorm'
import { Transaction } from './transactions.entity'

@Entity()
export class User {
  @Column({
    type: 'uuid',
    generated: 'uuid',
    primary: true,
  })
  id: string

  @Column('varchar')
  name: string

  @Column('numeric', { precision: 10, scale: 2 })
  balance: number

  @OneToMany(() => Transaction, (Transaction) => Transaction.user)
  transactions: Transaction[]
}

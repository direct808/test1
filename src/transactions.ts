import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { name: 'item_id', nullable: true })
  itemId: string

  @Column('numeric', { precision: 10, scale: 2 })
  amount: number
}

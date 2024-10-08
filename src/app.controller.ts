import { Body, Controller, Get, HttpException, Post } from '@nestjs/common'
import { PurchasesService } from './purchases.service'
import { ItemService } from './item.service'

@Controller()
export class AppController {
  constructor(
    private readonly itemService: ItemService,
    private readonly purchasesService: PurchasesService,
  ) {}

  @Get('items')
  getItems() {
    return this.itemService.getItems()
  }

  @Post('buy')
  buy(@Body('item_id') itemId: string) {
    if (!itemId) {
      throw new HttpException('Parameter item_id not set', 400)
    }
    return this.purchasesService.buy(itemId)
  }
}

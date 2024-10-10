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
    const userId = '763d91ea-c2e8-42a0-8f13-6a930f385aa0'
    if (!itemId) {
      throw new HttpException('Parameter item_id not set', 400)
    }
    return this.purchasesService.buy(itemId, userId)
  }
}

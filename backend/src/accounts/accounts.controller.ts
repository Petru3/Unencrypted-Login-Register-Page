import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';

import { AccountsService } from './accounts.service';
import { Account } from './accounts.model'

@Controller('/api/data')
export class AccountsController {
    constructor(private readonly accountService: AccountsService) {}

    @Get()
  getAllProjects() {
    return this.accountService.getAllAccounts();
  }


    @Post()
    createAccount(@Body() account: Omit<Account, 'id'>) {
        return this.accountService.createAccount(account);
    }
}
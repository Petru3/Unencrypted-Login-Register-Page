/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Account } from './accounts.model';

@Injectable()
export class AccountsService {
  private projects: Account[] = [];

  getAllAccounts(): Account[] {
    return this.projects;
  }

  createAccount(project: Omit<Account, 'id'>): Account {
    const newAccount = { id: (Math.random() + 1).toString(36).substring(2), ...project };
    this.projects.push(newAccount);
    return newAccount;
  }
}
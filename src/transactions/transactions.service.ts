import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  find(): Promise<Transaction[]> {
    return this.transactionsRepository.find();
  }

  save(transaction: Transaction): Promise<Transaction> {
    return this.transactionsRepository.save(transaction);
  }
}

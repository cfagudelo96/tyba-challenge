import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import { User } from '../users/user.entity';

@Injectable()
export class RegisterTransactionMiddleware implements NestMiddleware {
  constructor(private readonly transactionsService: TransactionsService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const transaction = new Transaction({
      operation: req.method,
      userId: req.user ? (req.user as User).id : null,
      url: req.baseUrl + req.url,
    });
    await this.transactionsService.save(transaction);
    next();
  }
}

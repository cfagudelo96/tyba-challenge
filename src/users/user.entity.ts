import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  private static readonly SALT_ROUNDS = 10;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  @BeforeInsert()
  async encryptPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, User.SALT_ROUNDS);
  }

  isSamePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

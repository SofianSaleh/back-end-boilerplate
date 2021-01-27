import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((_type: any) => User, (user) => user.refreshTokens)
  user: User;

  @Column('text')
  jwtId: string;

  @Column({ default: false })
  used: boolean;

  @Column({ default: false })
  invalidated: boolean;

  @Column()
  expiryDate: Date;

  // meta data information
  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}

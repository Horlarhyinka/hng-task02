import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { User } from './user';

@Entity()
export class Organization extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    orgId!: string;

    @Column()
    userId!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToMany(() => User, user => user.organizations)
    @JoinTable()
    members!: User[];
}

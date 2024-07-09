import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Organization } from './organization';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    userId!: string;

    @Column({ nullable: false })
    firstName!: string;

    @Column({ nullable: false })
    lastName!: string;

    @Column({ nullable: false, unique: true })
    email!: string;

    @Column({ nullable: false })
    password!: string;

    @Column({ nullable: true })
    phone?: string;

    @ManyToMany(() => Organization, organization => organization.members)
    organizations!: Organization[];
}
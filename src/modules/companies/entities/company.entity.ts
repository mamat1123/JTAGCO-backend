import { Entity, Column, PrimaryColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
// import { BusinessType } from './business-type.entity';
// import { IssuesEncountered } from './issues-encountered.entity';
// import { Offers } from './offers.entity';
// import { Events } from './events.entity';

@Entity()
export class Company {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  businessTypeId: number;

  // @ManyToOne(() => BusinessType)
  // businessType: BusinessType;

  @Column({ nullable: true })
  businessTypeDetail: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ nullable: true })
  branch: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  subDistrict: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'jsonb', nullable: true })
  position: any;

  @Column({ nullable: true })
  previousModel: string;

  // @ManyToMany(() => IssuesEncountered)
  // @JoinTable({ name: 'company_issues_encountered' })
  // issuesEncountered: IssuesEncountered[];

  @Column({ nullable: true })
  issuesEncounteredDetail: string;

  @Column({ nullable: true })
  oldPrice: number;

  @Column({ type: 'jsonb', nullable: true })
  image: any;

  @Column({ type: 'jsonb', nullable: true })
  quotationFile: any;

  @Column({ type: 'jsonb', nullable: true })
  poFile: any;

  @Column({ nullable: true })
  competitorDetails: string;

  @Column({ nullable: true })
  jobDescription: string;

  @Column({ nullable: true })
  totalEmployees: number;

  @Column({ nullable: true })
  credit: number;

  @Column({ nullable: true })
  orderCycle: number;

  // @OneToMany(() => Offers, offer => offer.company)
  // offers: Offers[];

  // @OneToMany(() => Events, event => event.company)
  // events: Events[];

  @Column({ nullable: true })
  detail: string;

  @Column({ type: 'jsonb', nullable: true })
  customers: any;
} 
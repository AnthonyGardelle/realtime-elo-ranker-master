import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Match {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    winnerId: string;

    @Column()
    winnerRank: number;

    @Column()
    loserId: string;

    @Column()
    loserRank: number;

    @Column()
    draw: boolean;
}
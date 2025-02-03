import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Player } from '../../player/entities/player.entity';

@Entity()
export class Ranking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Player, { onDelete: 'CASCADE' })
    @JoinColumn()
    player: Player;

    @Column()
    rank: number;
}

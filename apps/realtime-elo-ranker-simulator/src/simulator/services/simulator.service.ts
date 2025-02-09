import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import * as playersData from '../data/players.json';

@Injectable()
export class SimulatorService implements OnApplicationBootstrap {
  private players: string[] = [];

  private registeredPlayers: string[] = [];
  private apiUrl = 'http://localhost:3000/api';
  
  constructor(private readonly httpService: HttpService) {
    this.players = (playersData as any).players;
  }

  async onApplicationBootstrap() {
    await this.registerAllPlayers();
    setInterval(() => this.simulateMatch(), 500);
  }

  private async registerAllPlayers() {
    for (const player of this.players) {
      if (this.registeredPlayers.includes(player)) {
        console.log(`Le joueur ${player} est déjà enregistré.`);
        continue;
      }
      try {
        await firstValueFrom(
          this.httpService.post(`${this.apiUrl}/player`, { id: player }).pipe(
            catchError(error => {
              if (error.response?.status === 409) {
                this.registeredPlayers.push(player);
                console.log(`Joueur existant ajouté à la liste: ${player}`);
                return [];
              }
              console.error(`Erreur lors de la création du joueur ${player}:`, error?.response?.data || error?.message);
              return [];
            })
          )
        );
        this.registeredPlayers.push(player);
        console.log(`Joueur enregistré: ${player}`);
      } catch (error) {
        console.error(`Impossible de crée le joueur ${player} en BD car déjà éxistant`);
      }
    }
  }

  private simulateMatch() {
    if (this.registeredPlayers.length < 2) {
      console.log('Pas assez de joueurs enregistrés pour simuler un match');
      return;
    }

    const [player1, player2] = this.selectRandomPlayers();

    const isDraw = Math.random() < 0.1;

    const random = Math.random() < 0.5;

    const matchResult = {
      winner: random ? player1 : player2,
      loser: random ? player2 : player1,
      draw: isDraw
    };

    if (matchResult.winner === matchResult.loser) {
      console.log(`\x1b[31mLes joueurs ${matchResult.winner} et ${matchResult.loser} sont les mêmes, on recommence.\x1b[0m`);
    } else {
      console.log(`Match simulé: ${matchResult.winner} gagne contre ${matchResult.loser}${isDraw ? ' (match nul)' : ''}`);
    }

    this.httpService.post(`${this.apiUrl}/match`, matchResult)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de l\'envoi du match:', error?.response?.data || error?.message);
          return [];
        })
      )
      .subscribe(() => {
        console.log('Match simulé:', matchResult); 
      });
  }

  private selectRandomPlayers(): string[] {
    const availablePlayers = [...this.registeredPlayers];
    const player1Index = Math.floor(Math.random() * availablePlayers.length);
    const player1 = availablePlayers[player1Index];
    availablePlayers.splice(player1Index, 1);

    const player2Index = Math.floor(Math.random() * availablePlayers.length);
    const player2 = availablePlayers[player2Index];

    if (player1 === player2 && availablePlayers.length > 1) {
      console.log(`Les joueurs ${player1} et ${player2} sont les mêmes, on recommence.`);
      return this.selectRandomPlayers();
    }

    return [player1, player2];
  }
}
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
    // Enregistre d'abord tous les joueurs
    await this.registerAllPlayers();
    // Puis démarre la simulation
    setInterval(() => this.simulateMatch(), 500);
  }

  private async registerAllPlayers() {
    for (const player of this.players) {
      try {
        // Tente d'enregistrer le joueur
        await firstValueFrom(
          this.httpService.post(`${this.apiUrl}/player`, { id: player }).pipe(
            catchError(error => {
              console.error(`Erreur lors de la création du joueur ${player}:`, error?.response?.data || error?.message);
              return [];
            })
          )
        );
        this.registeredPlayers.push(player);
        console.log(`Joueur enregistré: ${player}`);
      } catch (error) {
        console.error(`Impossible d'enregistrer le joueur ${player}`);
      }
    }
  }

  private simulateMatch() {
    if (this.registeredPlayers.length < 2) {
      console.log('Pas assez de joueurs enregistrés pour simuler un match');
      return;
    }

    // Sélectionne 2 joueurs aléatoires parmi les joueurs enregistrés
    const [player1, player2] = this.selectRandomPlayers();

    // 10% de chances de match nul
    const isDraw = Math.random() < 0.1;

    // Résultat final
    const matchResult = {
      winner: isDraw ? player1 : (Math.random() < 0.5 ? player1 : player2),
      loser: isDraw ? player2 : (Math.random() < 0.5 ? player2 : player1),
      draw: isDraw
    };

    // Envoi au serveur
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

    return [player1, player2];
  }
}
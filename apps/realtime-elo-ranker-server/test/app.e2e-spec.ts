import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../src/player/entities/player.entity';
import { Match } from '../src/match/entities/match.entity';
import { AppModule } from '../src/app.module';

describe('RealtimeEloRanker (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:', // Utilise une BD SQLite en mémoire
          entities: [Player, Match],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /api/player', () => {
    it('should create a new player', () => {
      return request(app.getHttpServer())
        .post('/api/player')
        .send({ id: 'player1' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 'player1');
          expect(res.body).toHaveProperty('rank', 1000);
        });
    });

    it('should handle invalid player ID', () => {
      return request(app.getHttpServer())  
        .post('/api/player')
        .send({ id: '' })
        .expect(400)
        .expect((res) => {
          expect(res.body.code).toBe(400);
          expect(res.body.message).toBe('L\'identifiant du joueur n\'est pas valide');
        });
    });

    it('should handle duplicate player creation', async () => {
      // First create a player
      await request(app.getHttpServer())
        .post('/api/player')
        .send({ id: 'player1' })
        .expect(200);
  
      // Try to create the same player again
      return request(app.getHttpServer())
        .post('/api/player')
        .send({ id: 'player1' })
        .expect(409)
        .expect((res) => {
          expect(res.body.code).toBe(409);
          expect(res.body.message).toBe('Le joueur existe déjà');
        });
    });
  });

  describe('POST /api/match', () => {
    beforeEach(async () => {
      // Create test players
      await request(app.getHttpServer())
        .post('/api/player')
        .send({ id: 'player1' });
      await request(app.getHttpServer())
        .post('/api/player')
        .send({ id: 'player2' });
    });
  
    it('should handle a match result', () => {
      return request(app.getHttpServer())
        .post('/api/match')
        .send({
          winner: 'player1',
          loser: 'player2',
          draw: false
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('winner');
          expect(res.body).toHaveProperty('loser');
          expect(res.body.winner.id).toBe('player1');
          expect(res.body.loser.id).toBe('player2');
        });
    });
  
    it('should handle non-existent winner', () => {
      return request(app.getHttpServer())
        .post('/api/match')
        .send({
          winner: 'nonexistent',
          loser: 'player2',
          draw: false
        })
        .expect(422)
        .expect((res) => {
          expect(res.body.code).toBe(422);
          expect(res.body.message).toBe('Le joueur gagnant n\'existe pas');
        });
    });
  
    it('should handle non-existent loser', () => {
      return request(app.getHttpServer())
        .post('/api/match')
        .send({
          winner: 'player1',
          loser: 'nonexistent',
          draw: false
        })
        .expect(422)
        .expect((res) => {
          expect(res.body.code).toBe(422);
          expect(res.body.message).toBe('Le joueur perdant n\'existe pas');
        });
    });
  });

  describe('GET /api/ranking', () => {
    it('should return empty ranking when no players exist', () => {
      return request(app.getHttpServer())
        .get('/api/ranking')
        .expect(404)
        .expect((res) => {
          expect(res.body.code).toBe(404);
          expect(res.body.message).toBe('Le classement n\'est pas disponible car aucun joueur n\'existe');
        });
    });

    it('should return ranking with players', async () => {
      // Crée un joueur
      await request(app.getHttpServer())
        .post('/api/player')
        .send({ id: 'player1' });

      return request(app.getHttpServer())
        .get('/api/ranking')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(1);
          expect(res.body[0]).toHaveProperty('id', 'player1');
        });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
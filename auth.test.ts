import { describe, expect, it } from 'vitest';
import request from 'supertest';

import app from '../../src/app.js';

describe('POST /api/v1/auth/login', () => {
  it('deve realizar login com credenciais corretas', async () => {
    const resposta = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'bruno@ulbra.br',
        senha: 'senha123',
      });

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveProperty('token');
    expect(resposta.body).toHaveProperty('usuario');
    expect(resposta.body.usuario).not.toHaveProperty('senha_hash');
  });

  it('deve retornar 401 quando a senha estiver incorreta', async () => {
    const resposta = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'bruno@ulbra.br',
        senha: 'senhaerrada',
      });

    expect(resposta.status).toBe(401);
    expect(resposta.body.erro.mensagem).toBe('E-mail ou senha inválidos');
  });

  it('deve retornar 401 quando o e-mail não existir', async () => {
    const resposta = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'naoexiste@ulbra.br',
        senha: 'senha123',
      });

    expect(resposta.status).toBe(401);
    expect(resposta.body.erro.mensagem).toBe('E-mail ou senha inválidos');
  });

  it('deve retornar 400 quando a senha não for informada', async () => {
    const resposta = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'bruno@ulbra.br',
      });

    expect(resposta.status).toBe(400);
  });

  it('deve retornar 400 quando o e-mail estiver malformado', async () => {
    const resposta = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'bruno',
        senha: 'senha123',
      });

    expect(resposta.status).toBe(400);
  });
});
import { faker } from '@faker-js/faker';

describe('Login', () => {
  it('Deve fazer login com sucesso usando dados criados dinamicamente', () => {
    // 1. Criar um usuário novo usando dados aleatórios do Faker.js
    const user = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: 'true'
    };

    // 2. Cadastrar este usuário na API
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/usuarios',
      body: user
    } ).then((response) => {
      // Confirma que o usuário foi criado com sucesso
      expect(response.status).to.equal(201); 
    });

    // 3. Tentar fazer o login com os dados do usuário que acabamos de criar
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/login',
      body: {
        email: user.email,
        password: user.password
      }
    } ).then((response) => {
      // 4. Agora, o login deve funcionar!
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Login realizado com sucesso');
      // Opcional: verificar se o token de autorização foi retornado
      expect(response.body.authorization).to.not.be.empty;
    });
  });
});
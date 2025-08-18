/// <reference types="cypress" />
import { faker } from '@faker-js/faker'
describe('Testes da Funcionalidade Usuários', () => {

  // ... (seus outros testes permanecem exatamente iguais) ...

  it('Deve validar contrato de usuários', () => {
      cy.request({
      method: 'GET',
      url: '/usuarios'
      }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
      expect(response.body.usuarios).to.be.an('array')

      if (response.body.usuarios.length > 0) {
      const usuario = response.body.usuarios[0]
      expect(usuario).to.have.property('nome').that.is.a('string')
      expect(usuario).to.have.property('email').that.is.a('string')
      expect(usuario).to.have.property('password').that.is.a('string')
      expect(usuario).to.have.property('_id').that.is.a('string')
    }

    expect(response.body).to.have.property('quantidade').that.equals(response.body.usuarios.length)
  })

  });

  it('Deve listar usuários cadastrados', () => {
      cy.request({
      method: 'GET',
      url: '/usuarios'
       }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
      expect(response.body.usuarios).to.be.an('array')

      response.body.usuarios.forEach((usuario) => {
      expect(usuario).to.have.property('nome').that.is.a('string')
      expect(usuario).to.have.property('email').that.is.a('string')
      expect(usuario).to.have.property('password').that.is.a('string')
      expect(usuario).to.have.property('_id').that.is.a('string')
    })

    expect(response.body).to.have.property('quantidade').that.equals(response.body.usuarios.length)
  })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
      const nome = faker.person.fullName() // Correção para a versão mais recente do Faker
      const email = faker.internet.email()
      const password = faker.internet.password()

      cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
      nome: nome,
      email: email,
      password: password,
      administrador: 'true'
    }
    }).then((response) => {
    expect(response.status).to.equal(201)
    expect(response.body).to.have.property('message').that.equals('Cadastro realizado com sucesso')
    expect(response.body).to.have.property('_id').that.is.a('string')
  })
  });

  it('Deve validar um usuário com email inválido', () => {
      const nome = faker.person.fullName() // Correção para a versão mais recente do Faker
      const emailInvalido = 'emailinvalido.com'
      const password = faker.internet.password()

      cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
      nome: nome,
      email: emailInvalido,
      password: password,
      administrador: 'true'
    },
      failOnStatusCode: false
      }).then((response) => {
      expect(response.status).to.equal(400)
      expect(response.body).to.have.property('email').that.equals('email deve ser um email válido')
  })
})
  });

  // CORREÇÃO APLICADA AQUI
  it('Deve editar um usuário previamente cadastrado', () => {
    // Cadastra um usuário para garantir que temos um alvo para editar
    cy.request({
        method: 'POST',
        url: '/usuarios',
        body: {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: "true"
        }
    }).then(response => {
        const idUsuario = response.body._id;

        // Agora, edita o usuário que acabamos de criar com novos dados aleatórios
        cy.request({
            method: 'PUT',
            url: `/usuarios/${idUsuario}`,
            body: {
                nome: faker.person.fullName(),
                email: faker.internet.email(), // Usa um novo email aleatório para evitar o erro
                password: "senhaEditada",
                administrador: "true"
            }
        }).then(response => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Registro alterado com sucesso');
        });
    });
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
      const nome = faker.person.fullName() // Correção para a versão mais recente do Faker
      const email = faker.internet.email()
      const password = faker.internet.password()

      cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
      nome,
      email,
      password,
      administrador: 'true'
    }
      }).then((resCadastro) => {
      expect(resCadastro.status).to.equal(201)
      const idUsuario = resCadastro.body._id

      cy.request({
      method: 'DELETE',
      url: `/usuarios/${idUsuario}`
      }).then((resDelete) => {
      expect(resDelete.status).to.equal(200)
      expect(resDelete.body).to.have.property('message').that.equals('Registro excluído com sucesso')
    })
  })
});



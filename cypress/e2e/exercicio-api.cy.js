
/// <reference types="cypress" />
import { faker } from '@faker-js/faker'
describe('Testes da Funcionalidade Usuários', () => {

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
      const nome = faker.name.fullName()
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
      const nome = faker.name.fullName()
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

  it('Deve editar um usuário previamente cadastrado', () => {
        cy.request('GET', '/usuarios').then((res) => {
        const idUsuario = res.body.usuarios[0]._id

        const nomeEditado = 'Nome Editado'
        const emailEditado = 'emaileditado@example.com'

        cy.request({
        method: 'PUT',
        url: `/usuarios/${idUsuario}`,
        body: {
        nome: nomeEditado,
        email: emailEditado,
        password: 'senha123',
        administrador: 'true'
      }
        }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('message').that.equals('Registro alterado com sucesso')
    })
  })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
      const nome = faker.name.fullName()
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
})
  




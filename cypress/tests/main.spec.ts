describe('Login', () => {
  it('Login com usuário válido', () => {
    cy.visit('http://localhost:3000/signin')
    cy.get('[name="username"]').type('Dina20')
    cy.get('[name="password"]').type('s3cret')
    cy.get("[type='submit']").click()
    cy.get('.NavBar-toolbar').should('be.visible')
  })

  it('Login com credenciais inválidas e falha', () => {
    cy.visit('http://localhost:3000/signin')
    cy.get('[name="username"]').type('Dina')
    cy.get('[name="password"]').type('s3cret')
    cy.get("[type='submit']").click()
    cy.get("[role='alert']")
  });
  it('Novo usuário com sucesso', () => {
    cy.visit('http://localhost:3000/signin')
    cy.get('[name="username"]').type('Spiderman')
    cy.get('[name="password"]').type('vaiaranha')
    cy.get("[type='submit']").click()
    cy.get('.NavBar-toolbar').should('be.visible')
  });

  it('Novo usuário com informações incompletas e erro', () => {
    cy.visit('http://localhost:3000/signin')
    cy.get('[name="username"]').type('Spider')
    cy.get('[name="password"]').type('vaiar')
    cy.get("[type='submit']").click()
    cy.get("[role='alert']")

  });
})
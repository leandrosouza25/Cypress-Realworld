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
    cy.get("[href='/signup']").click()
    cy.get("[name='firstName']").type('Peter')
    cy.get("[name='lastName']").type('Parker')
    cy.get("[name='username']").type('Spiderman')
    cy.get("[name='password']").type('vaiaranha')
    cy.get("[name='confirmPassword']").type('vaiaranha')
    cy.get('.SignUpForm-submit').click()
    cy.get("[fill-rule='nonzero']").should('be.visible')
    cy.get("[name='username']").type('Spiderman')
    cy.get("[name='password']").type('vaiaranha')
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



  it('Enviar dinheiro com sucesso', () => {
    cy.visit('http://localhost:3000/signin')
    cy.get('[name="username"]').type('Dina20')
    cy.get('[name="password"]').type('s3cret')
    cy.get("[type='submit']").click()
    cy.get('.NavBar-toolbar').should('be.visible')
    cy.get("[href='/transaction/new']").click()
    cy.get("[placeholder='Search...']").click({ force: true }).type('Ted Parisian')
    cy.get('.MuiGrid-spacing-xs-1').eq(0).click()
    cy.get("[name='amount']").type('10')
    cy.get("[placeholder='Add a note']").type('amount paid')
    cy.get("[data-test='transaction-create-submit-payment']").click()
    cy.get('.MuiAlert-message').should('be.visible')

  });

  it('Enviar dinheiro com saldo insuficiente', () => {

    cy.intercept('POST', '/transactions', {
      statusCode: 400,
      body: {
        error: 'Insufficient funds'
      }
    }).as('insufficientFunds')

    cy.visit('http://localhost:3000/signin')
    cy.get('[name="username"]').type('Dina20')
    cy.get('[name="password"]').type('s3cret')
    cy.get("[type='submit']").click()

    cy.get('.NavBar-toolbar').should('be.visible')
    cy.get("[href='/transaction/new']").click()

    cy.get("[placeholder='Search...']").click({ force: true }).type('Ted Parisian')
    cy.get('.MuiGrid-spacing-xs-1').eq(0).click()

  
    cy.get("[name='amount']").type('9999')
    cy.get("[placeholder='Add a note']").type('test insufficient funds')
    cy.get("[data-test='transaction-create-submit-payment']").click()

  
    cy.wait('@insufficientFunds')

    
    cy.get('.MuiAlert-root').should('be.visible')
  })

  it('Deve exibir o histórico de transações de um usuário corretamente', () => {
    cy.visit('http://localhost:3000/signin')
    cy.get('[name="username"]').type('Dina20')
    cy.get('[name="password"]').type('s3cret')
    cy.get("[type='submit']").click()
    cy.get('.NavBar-toolbar').should('be.visible')
    cy.get("[data-test='sidenav-notifications']").click()
    cy.get(".NotificationsContainer-paper").should('be.visible')
  });

  it('Deve exibir uma mensagem indicando que o usuário não possui transações anteriores', () => {
    cy.visit('http://localhost:3000/signin')
    cy.get('[name="username"]').type('Spiderman')
    cy.get('[name="password"]').type('vaiaranha')
    cy.get("[type='submit']").click()
    cy.get('.NavBar-toolbar').should('be.visible')
    cy.get("[data-test='sidenav-notifications']").click()
    cy.get('[data-test="empty-list-header"] > .MuiTypography-root').should('be.visible')
  });
});

  

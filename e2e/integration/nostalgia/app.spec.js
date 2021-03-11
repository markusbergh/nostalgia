/// <reference types="cypress" />

describe('Application', () => {
  it('should render without crash', () => {
    cy.visit('/')

    cy.log('Viewing the index page')

    cy.findByText('Index').should('exist')
    cy.findByText('About').should('exist')
  })

  it.skip('should scroll the page and fetch exactly five more items', () => {
    cy.visit('/')

    const listSelector = 'main ul li'

    // Initial length of list
    cy.get(listSelector).should('have.length', 5)

    // Wait a little for content to load, but we shouldn't have to :)
    cy.log('Wait a little...')
    cy.wait(2000)

    // Interecept...
    cy.intercept('POST', '**/content/v1/spaces/*').as('getContent')

    // ...scroll and paginate
    cy.get('main li:last-child').scrollIntoView({ duration: 1000 })

    // Wait for request
    cy.wait('@getContent')

    // Now we should have five items appended to list
    cy.get(listSelector).should('have.length', 10)
  })

  it('should scroll the page and fetch more items', () => {
    cy.visit('/')

    const listSelector = 'main ul li'

    cy.get(listSelector).then($items => {
      const initialCount = $items.length

      expect(initialCount).to.be.eql(5)

      // Wait a little for content to load, but we shouldn't have to :)
      cy.log('Wait a little...')
      cy.wait(2000)

      // Intercept...
      cy.intercept('POST', '**/content/v1/spaces/*').as('getContent')

      // ...scroll and paginate for more items
      cy.get('main ul li:last-child').scrollIntoView({
        duration: 1000,
      })

      // Wait for request
      cy.wait('@getContent')

      // Now we should have more items appended to list
      cy.get(listSelector).its('length').should('be.gt', initialCount)
    })
  })

  it('should present the about page', () => {
    cy.visit('/')

    // Intercept and delay response with 500ms
    cy.intercept('POST', '**/content/v1/spaces/*', req => {
      req.reply(res => {
        res.delay(500)
      })
    }).as('getContent')

    cy.findByText('About').click()
    cy.findByText(/Loading/).should('exist')

    cy.wait('@getContent')

    cy.findByText(/This is a small trip down memory lane/).should(
      'exist'
    )
  })
})

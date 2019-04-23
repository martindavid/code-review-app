const randomstring = require('randomstring');

const username = randomstring.generate();
const email = `${username}@test.com`;
const password = 'greaterthanten';

describe('Register', () => {
  it('should display the registration form', () => {
    cy
      .visit('/register')
      .get('h1').contains('Register')
      .get('form')
      .get('input[disabled]')
      .get('.validation-list')
      .get('.validation-list > .error').first().contains(
        'Username must be greater than 5 characters'
      );
  });

  it('should validate the password field', () => {
    cy
      .visit('/register')
      .get('h1').contains('Register')
      .get('form')
      .get('input[disabled]')
      .get('.validation-list > .error').contains(
        'Password must be greater than 10 charaters.')
      .get('input[name="password"]').type(password)
      .get('.validation-list')
      .get('validation-list > .error').contains(
        'Password must be greater than 10 characters.').should('not.be.visible')
      .get('.validation-list > .success').contains(
        'Password must be greater than 10 characters.');

    cy.get('.navbar-burger').click();
    cy.get('.navbar-item').contains('Log In').click();
    cy.get('.navbar-item').contains('Register').click();
    cy.get('.validation-list > .error').contains(
      'Password must be greater than 10 characters.');
  });

  it('should allow a user to register', () => {
    // register user
    cy
      .visit('/register')
      .get('input[name="username"]').type(username)
      .get('input[name="email"]').type(email)
      .get('input[name="password"]').type('test')
      .get('input[type="submit"]').click()
      .wait(100)

    // assert user is redirected to '/'
    // assert '/' is displayed properly
    cy.contains('All Users');
    cy.contains(username);
    cy.get('.navbar-burger').click();
    cy.get('.navbar-menu').within(() => {
      cy
        .get('.navbar-item').contains('User Status')
        .get('.navbar-item').contains('Log Out')
        .get('.navbar-item').contains('Log In').should('not.be.visible')
        .get('.navbar-item').contains('Register').should('not.be.visible')
    });
  });
});

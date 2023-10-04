/// <reference types="cypress" />

import { DataTable, Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { apiUrl, responseA } from "../commands";

Given("I am authenticated as admin", function () {
    cy.log("The assumption here is that we are always authenticated for API calls.")
})

Given("a user with email {string} exists", function (existingUserEmail: string) {
    cy.log("The assumption here is that system allows to set up preconditions for tests.")
})

When("I request new user creation with:", function (userDeatilsTable: DataTable) {
    const userDetails = userDeatilsTable.rowsHash()
    let statusCode = 0
    let fixtureFile = ''

    switch (userDetails['email']) {
        case 'goodemail@address.com':
            statusCode = 201;
            fixtureFile = 'user/user_created_response_body';
            break;
        case 'anotherGoodemail@address.com':
            statusCode = 201;
            fixtureFile = 'user/another_user_created_response_body';
            break;
        case 'existingEmail@address.com':
            statusCode = 422;
            fixtureFile = 'user/duplicate_user_creation_response_body';
            break;
    }

    cy.intercept('POST', `${apiUrl}/users`, {
        statusCode: statusCode,
        fixture: fixtureFile
    }).as('createUser').then(() => {
        fetch(`${apiUrl}/users`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userDetails['email'],
                password: userDetails['password']
            })
        }).then(response => {
            responseA.statusCode = response.status
            return response.json()
        }).then(body => {
            responseA.body = body
        })
    })

    cy.wait('@createUser')
})

Then("I should get a response with status code {int}", function (expectedStatusCode: number) {
    cy.wrap(responseA.statusCode).should("eq", expectedStatusCode)
})

Then("the response should contain:", function (expectedResponseBody: DataTable) {
    const expectedUserDetails = expectedResponseBody.rowsHash()
    expect(responseA.body).to.deep.equal(expectedUserDetails)
})
Feature: New user creation
    API allows to create new users

    Scenario: successfull user creation
        Given I am authenticated as admin
        When I request new user creation with:
            | email    | goodemail@address.com |
            | password | gooD!pa$w0rd          |
        Then I should get a response with status code 201
        And the response should contain:
            | id    | 1009                  |
            | email | goodemail@address.com |

    Scenario: successfull another user creation
        Given I am authenticated as admin
        When I request new user creation with:
            | email    | anotherGoodemail@address.com |
            | password | gooD!pa$w0rd                 |
        Then I should get a response with status code 201
        And the response should contain:
            | id    | 1001                         |
            | email | anotherGoodemail@address.com |

    Scenario: duplicate user creation
        Given I am authenticated as admin
        And a user with email "existingEmail@address.com" exists
        When I request new user creation with:
            | email    | existingEmail@address.com |
            | password | gooD!pa$w0rd              |
        Then I should get a response with status code 422
        And the response should contain:
            | error | User with this email already exists. |

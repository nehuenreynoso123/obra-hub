Feature: Create a new account
  In order to have account in the platform
  I want to create a new account

  Scenario: A valid non existing account
    Given I send a PUT request to "/account/ef8ac118-8d7f-49cc-abec-78e0d05af80a" with body:
    """
    {
      "name": "nehuedev";
      "email": "@nehuedev";
      "password": "1234NR";
      "zone": "Buenos aires";
    }
    """
    Then the response status code should be 201
    And the response should be empty
Feature: Password Validation
    As a cashier
    I want the system to validate my password during login
    So that only secure passwords are accepted

    Scenario: Validation fails with short password
        When I submit a short password "short"
        Then I should receive a 400 validation error
        And the error message should indicate "Password must be at least 8 characters long"

    Scenario: Validation fails with empty password
        When I submit an empty password ""
        Then I should receive a 400 validation error
        And the error message should indicate "Password is required" 

    Scenario: Validation fails with empty user ID
        When I submit an empty user ID ""
        Then I should receive a 400 validation error
        And the error message should indicate "User ID cannot be empty"

    Scenario: Validation fails with missing credentials
        When I submit missing credentials
        Then I should receive a 400 validation error
        And the error message should indicate "User ID and password are required"

    Scenario: Validation passes with valid password
        When I submit a valid password "validpassword123"
        Then I should not receive a validation error
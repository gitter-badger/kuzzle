Feature: Test websocket API
  As a user
  I want to create/update/delete/search a document and test bulk import
  Using WebSocket API

  @usingWebsocket
  Scenario: Create a new document and get it
    When I write the document
    Then I should receive a document id
    Then I'm able to get the document

  @usingWebsocket
  Scenario: Update a document
    When I write the document
    Then I update the document with value "foo" in field "firstName"
    Then my document has the value "foo" in field "firstName"

  @usingWebsocket
  Scenario: Delete a document
    When I write the document
    Then I remove the document
    Then I'm not able to get the document

  @usingWebsocket
  Scenario: Search a document
    When I write the document "documentGrace"
    Then I find a document with "grace" in field "firstName"

  @usingWebsocket
  Scenario: Bulk import
    When I do a bulk import
    Then I can retrieve actions from bulk import

  @usingWebsocket
  Scenario: Global Bulk import
    When I do a global bulk import
    Then I can retrieve actions from bulk import

  @usingWebsocket
  Scenario: Delete type
    When I write the document
    Then I remove the collection and schema
    Then I'm not able to get the document

  @usingWebsocket
  Scenario: Count document
    When I write the document "documentGrace"
    When I write the document "documentAda"
    When I write the document "documentGrace"
    When I write the document "documentAda"
    Then I count 4 documents
    And I count 2 documents with "NYC" in field "city"

  @removeSchema @usingWebsocket
  Scenario: Change mapping
    When I write the document "documentGrace"
    Then I don't find a document with "Grace" in field "firstName"
    Then I remove the collection and schema
    Then I wait 2s
    Then I change the schema
    When I write the document "documentGrace"
    Then I find a document with "Grace" in field "firstName"

  @usingWebsocket @unsubscribe
  Scenario: Document creation notifications
    Given A room subscription listening to "lastName" having value "Hopper"
    When I write the document "documentGrace"
    Then I should receive a "create" notification
    And The notification should have a "_source" member

  @usingWebsocket @unsubscribe
  Scenario: Document creation notifications with not exists
    Given A room subscription listening field "toto" doesn't exists
    When I write the document "documentGrace"
    Then I should receive a "create" notification
    And The notification should have a "_source" member

  @usingWebsocket @unsubscribe
  Scenario: Document delete notifications
    Given A room subscription listening to "lastName" having value "Hopper"
    When I write the document "documentGrace"
    Then I remove the document
    Then I should receive a "delete" notification
    And The notification should not have a "_source" member

  @usingWebsocket @unsubscribe
  Scenario: Document update: new document notification
    Given A room subscription listening to "lastName" having value "Hopper"
    When I write the document "documentAda"
    Then I update the document with value "Hopper" in field "lastName"
    Then I should receive a "update" notification
    And The notification should have a "_source" member

  @usingWebsocket @unsubscribe
  Scenario: Document update: removed document notification
    Given A room subscription listening to "lastName" having value "Hopper"
    When I write the document "documentGrace"
    Then I update the document with value "Foo" in field "lastName"
    Then I should receive a "update" notification
    And The notification should not have a "_source" member

  @usingWebsocket @unsubscribe
  Scenario: Subscribe to a collection
    Given A room subscription listening to the whole collection
    When I write the document "documentGrace"
    Then I should receive a "create" notification
    And The notification should have a "_source" member

  @usingWebsocket @unsubscribe
  Scenario: Delete a document with a query
    Given A room subscription listening to "lastName" having value "Hopper"
    When I write the document "documentGrace"
    And I write the document "documentAda"
    And I wait 1s
    Then I remove documents with field "hobby" equals to value "computer"
    Then I should receive a "delete" notification
    And The notification should not have a "_source" member

  @usingWebsocket @unsubscribe
  Scenario: Count how many subscription on a room
    Given A room subscription listening to "lastName" having value "Hopper"
    Given A room subscription listening to "lastName" having value "Hopper"
    Then I can count "2" subscription

  @usingWebsocket @unsubscribe
  Scenario: Subscription notifications
    Given A room subscription listening to "lastName" having value "Hopper"
    Given A room subscription listening to "lastName" having value "Hopper"
    Then I should receive a "on" notification
    Then I unsubscribe
    And I should receive a "off" notification

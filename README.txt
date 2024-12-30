########################################################
Project Overview
########################################################

Event Producer:
    User Activity Events being Tracked:
    - page views
    - clicks
    Events include:
    - User ID
    - Event type
    - Timestamp
    - Additional metadata:
        - page URL

Event Consumer:
    Events are processed in the following ways:
    - Inserted as raw event data into the 'events' table in the ClickHouse database.
    - Aggregated by User ID and Event Type, with counts and the latest timestamp stored in the 'processed_data' table.

Database Schema:
    Tables:
    - 'events':
        Fields:
        - User ID
        - Event type
        - Timestamp
        - Page URL
        - Event Date (automatically generated from Timestamp)

    - 'processed_data':
        Fields:
        - User ID
        - Event type
        - Count (aggregated count of events per user/event type)
        - Timestamp (latest event timestamp)

Query Interface:
    API Endpoints:
    - '/total-events-by-user': Returns the total number of events for each user.
    - '/most-frequent-events': Returns the most frequent event types in the past 24 hours.

########################################################
Setup Instructions
########################################################

Prerequisites:
    Ensure Docker and Node.js are installed on your system.

Running:
    1. Clone this repository
    
    2. Open a terminal and navigate to the folder containing this README file and install dependencies:
        npm install
    
    3. Start the necessary services using Docker:
        docker-compose up

    4. Open a new terminal (t0) in the same folder then initialize the ClickHouse database:
        npm run initdb

    5. Start the Kafka producer in t0:
        npm run producer

    6. Open a second terminal (t1) and navigate to the same project folder then start the Kafka consumer::
        npm run consumer

    7. Once satisfied with the data generated, stop the producer by pressing `Ctrl+C` in the producer terminal (t0).

    8. Start the query interface API and click on the links to see results:
        npm run query_api

########################################################
Examples of Usage and Queries
########################################################

Query the API for aggregated data:

1. **Get total events by user**:
    ```
    GET http://localhost:3000/total-events-by-user
    ```
    Example response:
    ```json
    [
        { "userId": 101, "totalEvents": 20 },
        { "userId": 102, "totalEvents": 15 }
    ]
    ```

2. **Get most frequent events in the past 24 hours**:
    ```
    GET http://localhost:3000/most-frequent-events
    ```
    Example response:
    ```json
    [
        { "eventType": "page_view", "totalEvents": 25 },
        { "eventType": "click", "totalEvents": 10 }
    ]
    ```

########################################################
Additional Notes
########################################################

- The `events` table stores raw event data, while the `processed_data` table aggregates event counts by User ID and Event Type.
- The Kafka producer generates synthetic user activity events every 3 seconds.
- The Kafka consumer processes and stores these events in the ClickHouse database.


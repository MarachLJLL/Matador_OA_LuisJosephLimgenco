########################################################
Project overview
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
        - timezone

Event Consumer:
    Events are processed in the following ways:
    - 
    Events are then sent to a ClickHouse database

Database Schema:
    Fields:
    - User ID
    - Event type
    - Count
    - Timestamp

Query Interface:
    
########################################################
Setup instructions
########################################################

Running:
    docker run -p 5000:21600 0575fce2ec27
    
    Open 1 terminal:
    npm run start:producer
    
    Open 2nd terminal:
    npm run start:producer

########################################################
Examples of usage and queries
########################################################



Additional notes:
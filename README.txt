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
    (Items in quotes are to be pasted into the terminal)
    Open terminal and cd into the folder containing this
    README file
    "docker-compose up"
    "npm run start:db"
    "npm run start:producer"
    
    Open 2nd terminal and cd into the same folder:
    npm run start:producer

    Once satisfied with the data generated, close producer

########################################################
Examples of usage and queries
########################################################



Additional notes:
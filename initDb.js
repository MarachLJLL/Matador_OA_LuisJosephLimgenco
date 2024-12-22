import { ClickHouse } from 'clickhouse';

const clickhouse = new ClickHouse({
    url: 'http://127.0.0.1',
    port: 8123,
    debug: false,
    basicAuth: null,
    isUseGzip: false,
    format: "json",
});

async function initializeDatabase() {
    try {
        // Create database
        await clickhouse.query("CREATE DATABASE IF NOT EXISTS user_activity").toPromise();
        console.log("Database 'user_activity' created or already exists.");

        // Table for raw events
        await clickhouse.query(`
            CREATE TABLE IF NOT EXISTS user_activity.events (
                userId UInt32,
                timeStamp DateTime64(3),
                eventType Enum('page_view' = 1, 'click' = 2),
                pageUrl String,
                eventDate Date DEFAULT toDate(timeStamp)
            ) ENGINE = MergeTree()
            PARTITION BY eventDate
            ORDER BY (userId, timeStamp)
        `).toPromise();
        console.log("Table 'events' created or already exists.");

        // Table for processed data
        await clickhouse.query(`
            CREATE TABLE IF NOT EXISTS user_activity.processed_data (
                userId UInt32,
                eventType Enum('page_view' = 1, 'click' = 2),
                count UInt32,
                timeStamp DateTime64(3)
            ) ENGINE = SummingMergeTree()
            PARTITION BY toDate(timeStamp)
            ORDER BY (userId, eventType)
        `).toPromise();
        console.log("Table 'processed_data' created or already exists.");
    } catch (error) {
        console.error("Error initializing database:", error.message);
    }
}

// Run the initialization
initializeDatabase();

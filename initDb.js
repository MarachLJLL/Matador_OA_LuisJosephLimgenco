import {ClickHouse} from 'clickhouse';

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
    await clickhouse.query("CREATE DATABASE IF NOT EXISTS user_activity").toPromise();
    console.log("Database 'user_activity' created or already exists.");

    await clickhouse.query(`
      CREATE TABLE IF NOT EXISTS user_activity.events (
        userId UInt32,
        timeStamp DateTime64(3), -- High precision timestamp
        eventType Enum('page_view' = 1, 'click' = 2),
        pageUrl String,
        eventDate Date DEFAULT toDate(timeStamp) -- Auto-generate from timestamp
      ) ENGINE = MergeTree()
      PARTITION BY eventDate
      ORDER BY (userId, timeStamp)
    `).toPromise();

    console.log("Table 'events' created or already exists.");
  } catch (error) {
    console.error("Error initializing database:", error.message);
  }
}

initializeDatabase();
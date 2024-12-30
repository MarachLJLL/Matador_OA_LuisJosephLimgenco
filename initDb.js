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
    await clickhouse.query(`
      CREATE DATABASE IF NOT EXISTS user_activity
    `).toPromise();
    console.log("Database 'user_activity' created or already exists.");

    // Table for raw events
    await clickhouse.query(`
      CREATE TABLE IF NOT EXISTS user_activity.events (
          userId UInt32,
          timeStamp DateTime64(3),
          eventType Enum('page_view' = 1, 'click' = 2),
          pageUrl String
      )
      ENGINE = MergeTree()
      PARTITION BY toDate(timeStamp)
      ORDER BY (userId, timeStamp)
    `).toPromise();
    console.log("Table 'events' created or already exists.");

    // Aggregated table using SummingMergeTree
    await clickhouse.query(`
      CREATE TABLE IF NOT EXISTS user_activity.aggregated_events (
          userId UInt32,
          eventType Enum('page_view' = 1, 'click' = 2),
          count UInt64,
          latestTimeStamp DateTime
      )
      ENGINE = SummingMergeTree(count)
      PARTITION BY toDate(latestTimeStamp)
      ORDER BY (userId, eventType)
    `).toPromise();
    console.log("Table 'aggregated_events' created or already exists.");

    // Materialized View that increments count by 1 for each new event
    await clickhouse.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS user_activity.aggregated_events_mv
      TO user_activity.aggregated_events
      AS
      SELECT
          userId,
          eventType,
          1 AS count,
          timeStamp AS latestTimeStamp
      FROM user_activity.events
    `).toPromise();
    console.log("Materialized view 'aggregated_events_mv' created or already exists.");

  } catch (error) {
    console.error("Error initializing database:", error.message);
  }
}

initializeDatabase();

import express from 'express';
import { ClickHouse } from 'clickhouse';

const app = express();
const PORT = 3000;

// Initialize ClickHouse client
const clickhouse = new ClickHouse({
    url: 'http://127.0.0.1',
    port: 8123,
    debug: false,
    basicAuth: null,
    isUseGzip: false,
    format: "json",
});

// Route: Total events by user
app.get('/total-events-by-user', async (req, res) => {
    try {
        const query = `
            SELECT userId, SUM(count) AS totalEvents
            FROM user_activity.processed_data
            GROUP BY userId
            ORDER BY totalEvents DESC
        `;
        const result = await clickhouse.query(query).toPromise();
        res.json(result);
    } catch (error) {
        console.error("Error querying total events by user:", error.message);
        res.status(500).send("Error querying total events by user");
    }
});

// Route: Most frequent event types in the past 24 hours
app.get('/most-frequent-events', async (req, res) => {
    try {
        const query = `
            SELECT eventType, SUM(count) AS totalEvents
            FROM user_activity.processed_data
            WHERE timeStamp >= now() - INTERVAL 1 DAY
            GROUP BY eventType
            ORDER BY totalEvents DESC
        `;
        const result = await clickhouse.query(query).toPromise();
        res.json(result);
    } catch (error) {
        console.error("Error querying most frequent events:", error.message);
        res.status(500).send("Error querying most frequent events");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Query interface running at http://localhost:${PORT}`);
});

import Kafka from 'node-rdkafka';
import eventType from './eventType.js';
import { ClickHouse } from 'clickhouse';

const clickhouse = new ClickHouse({
    url: 'http://127.0.0.1',
    port: 8123,
    debug: false,
    basicAuth: null,
    isUseGzip: false,
    format: "json",
});

async function insertEvent(event) {
    try {
        const formattedTimeStamp = new Date(event.timeStamp).toISOString().replace('T', ' ').replace('Z', '');
        const query = `
            INSERT INTO user_activity.events (userId, timeStamp, eventType, pageUrl) VALUES
            (${event.userId}, '${formattedTimeStamp}', '${event.event}', '${event.pageUrl}')
        `;
        await clickhouse.query(query).toPromise();
        console.log("Inserted raw event into ClickHouse:", event);
    } catch (error) {
        console.error("Error inserting raw event into ClickHouse:", error.message);
    }
}

async function updateAggregatedEvent(event) {
    try {
        const formattedTimeStamp = new Date(event.timeStamp).toISOString().replace('T', ' ').replace('Z', '');
        const query = `
            INSERT INTO user_activity.aggregated_events (userId, eventType, count, latestTimeStamp) VALUES
            (${event.userId}, '${event.event}', 1, '${formattedTimeStamp}')
        `;
        await clickhouse.query(query).toPromise();
        console.log("Updated aggregated event in ClickHouse:", event);
    } catch (error) {
        console.error("Error updating aggregated event in ClickHouse:", error.message);
    }
}

const consumer = Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': 'localhost:9092',
}, {});

consumer.connect();

consumer.on('ready', () => {
    console.log('Consumer ready..');
    consumer.subscribe(['user_activity']);
    consumer.consume();
}).on('data', (data) => {
    try {
        const event = eventType.fromBuffer(data.value);
        console.log('Decoded event:', event);

        // Insert raw event
        insertEvent(event);

        // Update aggregated event
        updateAggregatedEvent(event);
    } catch (err) {
        console.error('Error processing Kafka message:', err.message);
    }
});

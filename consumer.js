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
        console.log('Inserted raw event into ClickHouse:', event);
    } catch (error) {
        console.error('Error inserting raw event into ClickHouse:', error.message);
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
}).on('data', async (data) => {
    try {
        const event = eventType.fromBuffer(data.value);
        await insertEvent(event);
    } catch (err) {
        console.error('Error processing Kafka message:', err.message);
    }
});

process.on('SIGINT', () => {
    console.log('Shutting down consumer...');
    consumer.disconnect();
    process.exit();
});

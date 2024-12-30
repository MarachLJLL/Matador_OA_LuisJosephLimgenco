import Kafka from 'node-rdkafka';
import eventType from './eventType.js';

const stream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': 'localhost:9092'
}, {}, { topic: 'user_activity' });

stream.on('error', (err) => {
    console.error('Error in producer stream:', err.message);
});

function createEvent() {
    const now = new Date();
    return {
        userId: Math.floor(Math.random() * 10),
        timeStamp: now.getTime(),
        event: Math.random() > 0.5 ? 'page_view' : 'click',
        pageUrl: 'https://example.com/page/' + Math.floor(Math.random() * 10)
    };
}

function queueMessage() {
    const event = createEvent();
    const encodedMessage = eventType.toBuffer(event);
    const success = stream.write(encodedMessage);

    if (success) {
        console.log('Message written successfully to stream:', event);
    } else {
        console.log('Message failed to write. Retrying...');
        setTimeout(() => queueMessage(), 1000); // Retry after 1 second
    }
}

// Produce messages every 3 seconds
setInterval(() => {
    queueMessage();
}, 3000);

// Graceful shutdown for the producer
process.on('SIGINT', () => {
    console.log('Shutting down producer...');
    stream.close();
    process.exit();
});
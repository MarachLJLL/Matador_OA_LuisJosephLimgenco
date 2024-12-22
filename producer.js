console.log('producer..');
import Kafka from 'node-rdkafka';
import eventType from './eventType.js';

const stream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': 'localhost:9092'
}, {}, {topic: 'test'});

function createEvent() {
    const now = new Date();
    return {
        userId: Math.floor(Math.random() * 1000),
        timeStamp: now.getTime(),
        date: now.toISOString(),
        event: Math.random() > 0.5 ? 'page_view' : 'click',
        pageUrl: 'https://example.com/page/' + Math.floor(Math.random() * 10)
    };
}

function queueMessage() {
    const event = createEvent();
    const encodedMessage = eventType.toBuffer(event);
    const success = stream.write(encodedMessage);
    if (success) {
        console.log('message written successfully to stream');
    } else {
        console.log('something went wrong');
    }
}

setInterval(() => {
    queueMessage();
}, 3000)

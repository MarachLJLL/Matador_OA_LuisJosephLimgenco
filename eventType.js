import avro from 'avsc';

export default avro.Type.forSchema({
    type: 'record',
    fields: [
        {name: 'userId', type: 'int'},
        {name: 'timeStamp', type: 'long'},
        {name: 'date', type: 'string'},
        { 
            name: 'event', 
            type: { 
                type: 'enum', 
                name: 'eventType', 
                symbols: ['page_view', 'click'] 
            } 
        },
        {name: 'pageUrl', type: 'string'}
    ]
});
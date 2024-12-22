ATTACH TABLE _ UUID '721b1734-4c3f-4ee7-a152-b66bb67bb21d'
(
    `userId` UInt32,
    `timeStamp` DateTime64(3),
    `eventType` Enum8('page_view' = 1, 'click' = 2),
    `pageUrl` String,
    `eventDate` Date DEFAULT toDate(timeStamp)
)
ENGINE = MergeTree
PARTITION BY eventDate
ORDER BY (userId, timeStamp)
SETTINGS index_granularity = 8192

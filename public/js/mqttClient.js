const clientId = "";

const host = "ws://broker.mqttdashboard.com:8000/mqtt";

const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
};

console.log('Connecting mqtt client')
const client = mqtt.connect(host, options);

client.on('error', (err) => {
  console.log('Connection error: ', err)
  client.end()
});

client.on('reconnect', () => {
  console.log('Reconnecting...')
});

client.on('connect', () => {
    console.log('Client connected:' + clientId)
    // Subscribe
    client.subscribe('temperature', { qos: 0 })
  })

// Message received
client.on('message', (topic, message) => {
    console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)
  })
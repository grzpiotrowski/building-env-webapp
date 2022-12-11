const clientId = "";

console.log(window.location.origin + "/api/mqttdetails")

const createMqttWSClient = async () => {
  const response = await fetch(window.location.origin + "/api/mqttdetails", {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET',
  });
  const data = await response.json()
  if (response.status == 200) {
    const mqttDetails = JSON.parse(data);
    const host = "wss://" + mqttDetails.host + ":" + "8884" + "/mqtt";

    const options = {
      keepalive: 60,
      clientId: clientId,
      username: mqttDetails.user,
      password: mqttDetails.pass,
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

    return client;
  } else return 0;
}

const client = await createMqttWSClient();

export { client };
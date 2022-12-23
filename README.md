# building-env-webapp

This is a Web App accompanying the Building Environmental Monitoring System IoT project. \
\
Link to the repo with Raspberry Pi and Raspberry Pi Pico part of the full project: \
https://github.com/grzpiotrowski/building-env-monitor

The goal of this project is to create a web app allowing to display a 3D model loaded from a gltf or glb file, and integrate real time sensor data from an IoT device using websockets.

## Video presentation
https://youtu.be/xUrZlsG5YCo

## Deployed web app
https://building-env-monitor.glitch.me/

3D Viewer displaying real-time sensor data:

![3D Viewer demo](/docs/images/viewer3d-demo.gif)

## Setup
Please refer to the documentation for the setup steps required: \
[building-env-webapp docs](/docs/index.md)


# Resources

* Three.js Tutorial Crash Course - 2021 \
https://www.youtube.com/watch?v=YK1Sw_hnm58

* Three.js documentation \
https://threejs.org/docs/#manual/en/introduction/Creating-a-scene

* GLTF Loader \
https://threejs.org/docs/#examples/en/loaders/GLTFLoader

* threejsfundamentals: Three.js Picking \
https://r105.threejsfundamentals.org/threejs/lessons/threejs-picking.html

* Camera orbit controls \
https://threejs.org/docs/#examples/en/controls/OrbitControls

* Use WebSocket to connect to MQTT broker \
https://emqx.medium.com/use-websocket-to-connect-to-mqtt-broker-9e7baf1aa773

* How to create a REST API with Express.js in Node.js
https://www.robinwieruch.de/node-express-server-rest-api/

* InfluxDb: Flux syntax \
https://docs.influxdata.com/influxdb/v1.8/flux/get-started/syntax-basics/

* Flux query - windowing data \
https://docs.influxdata.com/influxdb/v2.0/query-data/flux/window-aggregate/#windowing-data

* InfluxDb API docs and query examples \
https://github.com/influxdata/influxdb-client-js/blob/e22fc7b26ab8f9c35357436db8c9d032e8afab3a/examples/query.ts#L66 \
https://docs.influxdata.com/influxdb/cloud/api-guide/client-libraries/nodejs/query/ \
https://docs.influxdata.com/influxdb/v2.6/query-data/flux/

* InfluxDb API - Checks \
https://docs.influxdata.com/influxdb/v2.0/api/#tag/Checks

* InfluxDb Slack Notifications Guide \
https://www.influxdata.com/blog/tldr-influxdb-tech-tips-configuring-slack-notification-with-influxdb/

* How to Make PATCH Requests with Axios \
https://masteringjs.io/tutorials/axios/axios-patch

* Handlebars templating engine documentation \
https://handlebarsjs.com/guide/

## Threejs examples

* 2D Label \
https://threejs.org/examples/?q=css#css2d_label

* CSS3D Tooltips - THREE \
https://codesandbox.io/s/css3d-tooltips-three-2l9v5?file=/index.js

## Images
Images used in this project were generated using DALL·E 2 AI system
which can create realistic images and art from a description in natural language. \
Link to DALL·E 2 website: \
https://openai.com/dall-e-2/

## Known issues
Glitch seems to not support the newest version of axios module.
If you are having any errors related to axios after deploying the app to Glitch, go to package.json and change axios version to "^0.21" and then run *npm install*.
# building-env-webapp

## Setting up InfluxDb connection

Install InfluxDb client npm module:\
```npm install --save @influxdata/influxdb-client```


## InfluxDb alerts

To create an alert in InfluxDb, navigate to Alerts in the side menu and click on **Threshold Check** button.
![InfluxDb - Alerts - create checks](/docs/images/influxdb-alerts-check-create.jpg)

In the next step we need to define a query for the alert check. In this case we are creating a query to retrieve temperature data from *senseHat01* sensor.

Notice the **Window period** on the right hand side of the screen - it can be set in the **Confugure check** tab, but for now it displays the default period of the time window that the data will be aggregated by.


Then we select the **aggregate function** to be used on the query result.

![InfluxDb - Alerts - create query](/docs/images/influxdb-alerts-check-query.jpg)

Going to the **Configure check** tab now, we can specify the frequency that the check should be ran at (our aggregating time window).

Then on the right hand side we can specify tresholds for alerts of different types, such as OK, WARN or CRITICAL for example.

![InfluxDb - Alerts - configure check](/docs/images/influxdb-alerts-check-threshold.jpg)

After inputting all the values, click the tick button in the upper right corner and the alert is all set up at this stage.

Now going to the **Alerts History** menu, we can see any alerts that were triggered, their time, type and messages attached.

![InfluxDb - Alerts - History](/docs/images/influxdb-alerts-history.jpg)
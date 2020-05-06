This is a visualization of temperature and humidity data collected using an [Arduino Nano 33 BLE Sense](https://www.arduino.cc/en/Guide/NANO33BLESense). Data collection started at around 4:00 PM (or 16:00 on the graphs). You can mouse over the graphs to see exact values and move your cursor clockwise to see how the values change over time.

Built with HTML5 Canvas, [TypeScript](https://www.typescriptlang.org/), [SASS](https://sass-lang.com/), and [Parcel](https://parceljs.org/).

The original data is in `data.csv`. The first column is time, represented as the number of milliseconds since the Arduino powered on (4:16 PM on April 13, 2020). The second column is temperature in degrees Celsius, and the third is humidity as a percentage. There is approximately one data point every ten seconds. Each data point is actually the average of 100 values read every 100 milliseconds.

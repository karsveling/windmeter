int one_volt = 1241; // 4095 / 3.3V = 1241
int no_wind = 496; // 0.4V * one_volt = 496 is 0 m/s
int max_wind = 2482; // 2.0V * 1241 is 32.4m/s
int range = max_wind - no_wind;

int lastSpeed = -1;

void setup() {
    // windmeter signal wire is connected to Photon's A0 pin
    pinMode(A0, INPUT);
}

/*
 * maps analog windmeter reading to m/s windspeeds * 10 for easy rounding
 */
int windmeter_to_speed(int reading) {
    float x = (float)(reading - no_wind);
    if (x<0) x=0;
    float f = x / (float)range * 32.4f * 10;
    return (int)f;
}

void loop() {
    // read the signal, convert it to m/s and log it every second
    int r = analogRead(A0);
    int s = windmeter_to_speed(r);

    if (s!=lastSpeed) {
        lastSpeed = s;

        String speed(s/10.0, 1);
        Particle.publish("windspeedAtKarsHouse",speed,60,PRIVATE);
        delay(2000);
    }
    delay(1000);
}

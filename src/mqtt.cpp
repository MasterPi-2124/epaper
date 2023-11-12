#include <WiFi.h>
#include <Wire.h>
#include "mqtt/mqtt.h"
#include <ArduinoMqttClient.h>

WiFiClient espClient;

long lastMsg = 0;
char msg[50];
int value = 0;

void onMessage(int messageSize);

MqttClient client(espClient);

void setup_wifi()
{
    delay(10);
    // We start by connecting to a WiFi network
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(SSID);

    WiFi.begin(SSID, PASS);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.print("WiFi connected. IP address: ");
    Serial.println(WiFi.localIP());
}

void MQTT_Client_Init(void) {
    setup_wifi();
    client.setId("s2mini#1");
    client.setUsernamePassword(MQTT_USERNAME, MQTT_PASSWORD);
}

void MQTT_Connect(void) {
    Serial.println("Attempting MQTT connection...");
    while (!client.connected()) {
        if (client.connect(MQTT_BROKER, MQTT_PORT)) {
            Serial.println(" connected");
            client.onMessage(onMessage);
            client.subscribe("s2mini/output");
        } else {
            Serial.print("failed, rc=");
            Serial.print(client.connectError());
            Serial.println(". Try again in 5 seconds ...");
            // Wait 5 seconds before retrying
            delay(5000);
        }
    }
}

void MQTT_Loop() {
    client.poll();
    Serial.print("hello");
}

void onMessage(int messageSize)
{
    // we received a message, print out the topic and contents
    Serial.println("Received a message with topic '");
    Serial.print(client.messageTopic());
    Serial.print("', length ");
    Serial.print(messageSize);
    Serial.println(" bytes:");

    // use the Stream interface to print the contents
    while (client.available())
    {
        Serial.print((char)client.read());
    }
    Serial.println();

    Serial.println();
}
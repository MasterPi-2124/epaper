#include "DEV_Config/DEV_Config.h"
#include "epd/EPD.h"
#include "GUI_Paint/GUI_Paint.h"
#include <WiFi.h>
#include <Wire.h>
#include "mqtt/mqtt.h"
#include <ArduinoMqttClient.h>

WiFiClient espClient;
const long connectTimeout = 20000;

void onMessage(int messageSize);

MqttClient client(espClient);

void setup_wifi(const char * ssid, const char * password, UBYTE *BlackImage)
{
    delay(10);
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    Paint_ClearWindows(80, 70, 80 + 14 * 15, 80 + Segoe12.Height, WHITE);
    Paint_DrawString_custom(80, 70, u"Connecting to WiFi...", &Segoe12, BLACK, WHITE);
    EPD_2IN9_V2_Display_Partial(BlackImage);

    unsigned long startAttemptTime = millis();
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        if (millis() - startAttemptTime >= connectTimeout) {
            Serial.println("Failed to connect to WiFi within the timeout period.");
            Paint_ClearWindows(80, 70, 80 + 14 * 15, 80 + Segoe12.Height, WHITE);
            Paint_DrawString_custom(80, 70, u"Failed to connect to Wifi!", &Segoe12, BLACK, WHITE);
            EPD_2IN9_V2_Display_Partial(BlackImage);
            break; // Exit the loop
        }
        delay(500);
        Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("");
        Serial.print("WiFi connected. IP address: ");
        Serial.println(WiFi.localIP());
        Paint_ClearWindows(80, 70, 80 + 14 * 15, 80 + Segoe12.Height, WHITE);
        Paint_DrawString_custom(80, 70, u"Connected to Wifi!", &Segoe12, BLACK, WHITE);
        EPD_2IN9_V2_Display_Partial(BlackImage);
    }
}

void MQTT_Client_Init(const char * ssid, const char * password, const char * id, UBYTE *BlackImage) {
    Serial.print(ssid);
    Serial.print(" ");
    Serial.println(password);
    setup_wifi(ssid, password, BlackImage);
    if (WiFi.status() == WL_CONNECTED) {
        client.setId(id);
        client.setUsernamePassword(MQTT_USERNAME, MQTT_PASSWORD);
    }
}

void MQTT_Connect(const char * id, UBYTE *BlackImage) {
    if (WiFi.status() == WL_CONNECTED) {
        Paint_ClearWindows(80, 70, 80 + 14 * 15, 80 + Segoe12.Height, WHITE);
        Paint_DrawString_custom(80, 70, u"Attempting MQTT connection...", &Segoe12, BLACK, WHITE);
        EPD_2IN9_V2_Display_Partial(BlackImage);
        Serial.println("Attempting MQTT connection...");
        while (!client.connected()) {
            if (client.connect(MQTT_BROKER, MQTT_PORT)) {
                Paint_ClearWindows(80, 70, 80 + 14 * 15, 80 + Segoe12.Height, WHITE);
                Paint_DrawString_custom(80, 70, u"Connected to MQTT Broker", &Segoe12, BLACK, WHITE);
                EPD_2IN9_V2_Display_Partial(BlackImage);
                Serial.println(" connected");
                client.onMessage(onMessage);
                client.subscribe(id);
            } else {
                Serial.print("failed, rc=");
                Serial.print(client.connectError());
                Serial.println(". Try again in 5 seconds ...");
                // Wait 5 seconds before retrying
                delay(5000);
            }
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
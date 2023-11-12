#ifndef __MQTT // RabbitMQ
#define __MQTT 

#include <WiFi.h>
#include <Wire.h>
#include <Arduino.h>

// Replace the next variables with your SSID/Password combination

#define SSID            "Pi's Network"
#define PASS            "3.14159265358979"
#define MQTT_BROKER     "95.217.121.243"
#define MQTT_PORT       1883
#define MQTT_USERNAME   "masterpi"
#define MQTT_PASSWORD   "masterpi"

void MQTT_Client_Init(void);
void MQTT_Connect(void);
void MQTT_Loop(void);
// void MQTT_Publish(char *data, char *topic);
// void MQTT_Subscribe(char* topc);

#endif /* __MQTT */

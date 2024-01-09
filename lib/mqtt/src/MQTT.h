#ifndef __MQTT // RabbitMQ
#define __MQTT 

#include <WiFi.h>
#include <Wire.h>
#include <Arduino.h>
// #include <Preferences.h>

// Replace the next variables with your SSID/Password combination

#define SSID            "Pi's Network"
#define PASS            "3.14159265358979"
#define MQTT_BROKER     "mqtt.epaper.artsakh.ventures"
#define MQTT_PORT       8883
#define MQTT_USERNAME   "masterpi"
#define MQTT_PASSWORD   "masterpi"
// extern Preferences preferences;

void MQTT_Client_Init(const char * ssid, const char * password, const char * id, UBYTE *Image);
void MQTT_Connect(const char * id, UBYTE *Image);
void MQTT_Loop(const char * id, UBYTE *Image);

#endif /* __MQTT */

#include "DEV_Config/DEV_Config.h"
#include "epd/EPD.h"
#include "GUI_Paint/GUI_Paint.h"
#include <WiFi.h>
#include <Wire.h>
#include "mqtt/mqtt.h"
#include "epd/EPD.h"
#include "GUI_Paint/GUI_Paint.h"
#include <ArduinoMqttClient.h>
#include <cstdint>

WiFiClient espClient;
size_t length;
char16_t * data;
const long connectTimeout = 20000;

void onMessage(int messageSize);

MqttClient client(espClient);

char16_t* utf8ToUtf16(const char* utf8, size_t &outLength) {
    size_t utf8_length = strlen(utf8);
    size_t maximum_utf16_length = utf8_length * 2;
    char16_t * utf16 = new char16_t[maximum_utf16_length];
    size_t utf16_index = 0;

    while (*utf8) {
        unsigned char byte = *utf8++;
        uint32_t codepoint;
        
        if (byte <= 0x7F) { // Single-byte UTF-8 character (ASCII)
            codepoint = byte;
        } else if (byte <= 0xBF) {
            // Continuation byte, handle error or skip
            continue;
        } else if (byte <= 0xDF) {
            codepoint = byte & 0x1F;
            codepoint <<= 6;
            codepoint |= (*utf8++ & 0x3F);
        } else if (byte <= 0xEF) {
            codepoint = byte & 0x0F;
            codepoint <<= 6;
            codepoint |= (*utf8++ & 0x3F);
            codepoint <<= 6;
            codepoint |= (*utf8++ & 0x3F);
        } else {
            codepoint = byte & 0x07;
            codepoint <<= 6;
            codepoint |= (*utf8++ & 0x3F);
            codepoint <<= 6;
            codepoint |= (*utf8++ & 0x3F);
            codepoint <<= 6;
            codepoint |= (*utf8++ & 0x3F);
        }

        if (codepoint <= 0xFFFF) {
            utf16[utf16_index++] = static_cast<char16_t>(codepoint);
        } else {
            codepoint -= 0x10000;
            utf16[utf16_index++] = static_cast<char16_t>(0xD800 | (codepoint >> 10));
            utf16[utf16_index++] = static_cast<char16_t>(0xDC00 | (codepoint & 0x03FF));
        }
    }

    // Allocate memory for the output
    outLength = utf16_index;
    char16_t* output = new char16_t[outLength + 1]; // +1 for null-terminator
    memcpy(output, utf16, outLength * sizeof(char16_t));
    // Copy data from vector to the new array
    
    output[outLength] = 0; // Null-terminate the string
    delete[] utf16;
    return output;
}

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
                Serial.println(id);
                client.subscribe(id);
            } else {
                Serial.print("failed, rc=");
                Serial.print(client.connectError());
                Serial.println(". Try again in 5 seconds ...");
                // Wait 5 seconds before retrying
                delay(5000);
            }
        }
    }}

void MQTT_Loop(const char * id, UBYTE *BlackImage)
{
    printf("loop done\r\n");

    client.poll();
    if (length) {
        Paint_DrawString_custom(10, 30, data, &Segoe12, BLACK, WHITE);
        EPD_2IN9_V2_Display(BlackImage);
        length = 0;
        delete [] data;
        client.beginMessage(id);
    }
    DEV_Delay_ms(5000);
}

void onMessage(int messageSize)
{
    // we received a message, print out the topic and contents
    Serial.print("Received a message with topic '");
    Serial.print(client.messageTopic());
    Serial.print("', length ");
    Serial.print(messageSize);
    Serial.println(" bytes:");
    if (messageSize)
    {
        int size = 0;
        char *newData = new char[256];
        // use the Stream interface to print the contents
        while (client.available())
        {
            char s = (char)client.read();
            newData[size] = s;                     // Add new character
            size++;
        }
        newData[size] = u'\0';
        data = utf8ToUtf16(newData, length);
        // free(msg);
        // delete[] newData;
    }
}
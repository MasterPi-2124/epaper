#include <WiFi.h>
#include <Wire.h>
#include "mqtt/mqtt.h"
#include "epd/EPD.h"
#include "GUI_Paint/GUI_Paint.h"
#include <ArduinoMqttClient.h>
#include <cstdint>

WiFiClient espClient;

long lastMsg = 0;
int value = 0;
size_t length;
char16_t * data;

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

void MQTT_Client_Init(void)
{
    setup_wifi();
    client.setId("c3#1");
    client.setUsernamePassword(MQTT_USERNAME, MQTT_PASSWORD);
}

void MQTT_Connect(void)
{
    Serial.println("Attempting MQTT connection...");
    while (!client.connected())
    {
        if (client.connect(MQTT_BROKER, MQTT_PORT))
        {
            Serial.println(" connected");
            client.onMessage(onMessage);
            client.subscribe("c3/output");
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(client.connectError());
            Serial.println(". Try again in 5 seconds ...");
            // Wait 5 seconds before retrying
            delay(5000);
        }
    }
}

void MQTT_Loop(UBYTE *BlackImage)
{
    UWORD Imagesize = ((EPD_2IN9_V2_WIDTH % 8 == 0) ? (EPD_2IN9_V2_WIDTH / 8) : (EPD_2IN9_V2_WIDTH / 8 + 1)) * EPD_2IN9_V2_HEIGHT;
    if ((BlackImage = (UBYTE *)malloc(Imagesize)) == NULL)
    {
        printf("Failed to apply for black memory...\r\n");
        while (1)
            ;
    }
    printf("Paint_NewImage\r\n");
    Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 90, WHITE);
    EPD_2IN9_V2_Init();
    Paint_Clear(0xff);

    client.poll();
    if (length) {
        Paint_DrawString_custom(10, 30, data, &Segoe12, BLACK, WHITE);
        EPD_2IN9_V2_Display(BlackImage);
        length = 0;
        delete [] data;
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
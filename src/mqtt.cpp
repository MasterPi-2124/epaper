#include <WiFi.h>
#include <Wire.h>
#include "mqtt/mqtt.h"
#include "epd/EPD.h"
#include "GUI_Paint/GUI_Paint.h"
#include <ArduinoMqttClient.h>

WiFiClient espClient;

long lastMsg = 0;
char16_t *msg = new char16_t[1];
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
    // UWORD Imagesize = ((EPD_2IN9_V2_WIDTH % 8 == 0) ? (EPD_2IN9_V2_WIDTH / 8) : (EPD_2IN9_V2_WIDTH / 8 + 1)) * EPD_2IN9_V2_HEIGHT;
    // if ((BlackImage = (UBYTE *)malloc(Imagesize)) == NULL)
    // {
    //     printf("Failed to apply for black memory...\r\n");
    //     while (1)
    //         ;
    // }
    // printf("Paint_NewImage\r\n");
    // Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 90, WHITE);
    // EPD_2IN9_V2_Init();
    // Paint_Clear(0xff);

    client.poll();
    // if (sizeof(msg) > 4) {
    //     size_t currentLength = std::char_traits<char16_t>::length(msg);
    //     char* printData = new char[currentLength + 2];
    //     for (size_t j = 0; j <= currentLength; ++j) {
    //         printData[j] = static_cast<char>(msg[j]);
    //     }
    //     printData[currentLength + 1] = '\0';

    //     Serial.println(printData); // Print the string
    // }
    // Serial.print(std::char_traits<char16_t>::length(msg));
    if (std::char_traits<char16_t>::length(msg) > 0) {
        // Paint_DrawString_custom(10, 30, msg, &Segoe12, WHITE, BLACK); // ẠĂẰẮẲẴẶÂẦẤẨẪẬẠĂẰẮẲẴẶÂẦẤẨẪẬẠĂẰẮẲẴẶÂẦẤẨẪẬ
        // EPD_2IN9_V2_Display(BlackImage);
        // DEV_Delay_ms(2000);
        // free(msg);
        for (int i = 0; i < std::char_traits<char16_t>::length(msg); i++) {
            Serial.println(char16_t(msg[i]));
        }
        msg = u"";
    }
    delay(5000);
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
        char16_t *newData = new char16_t[256];
        // use the Stream interface to print the contents
        while (client.available())
        {
            char16_t s = (char16_t)client.read();
            // char16_t s_utf16 = static_cast<char16_t>(s); // Convert to char16_t if needed
            newData[size] = s;                     // Add new character
            size++;
        }
        newData[size] = u'\0';
        // free(msg);
        msg = newData;
        // delete[] newData;
    }
}
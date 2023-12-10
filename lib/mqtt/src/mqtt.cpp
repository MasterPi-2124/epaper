#include <DEV_Config.h>
#include <EPD.h>
#include <Paint.h>
#include <WiFi.h>
#include <Wire.h>
#include <MQTT.h>
#include <Display.h>
#include <ArduinoMqttClient.h>
#include <cstdint>

WiFiClient espClient;
MqttClient client(espClient);
size_t update;  // 0 - no update
                // 1 - write1 update
                // 2 - write2 update
                // 3 - write3 update
                // 4 - write4 update
                // 5 - write5 update
                // 6 - ping update
const long connectTimeout = 20000;

void onMessage(int messageSize);

void setup_wifi(const char *ssid, const char *password, UBYTE *BlackImage)
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
        if (millis() - startAttemptTime >= connectTimeout)
        {
            Serial.println("Failed to connect to WiFi within the timeout period.");
            Paint_ClearWindows(80, 70, 80 + 14 * 15, 80 + Segoe12.Height, WHITE);
            Paint_DrawString_custom(80, 70, u"Failed to connect to Wifi!", &Segoe12, BLACK, WHITE);
            EPD_2IN9_V2_Display_Partial(BlackImage);
            break; // Exit the loop
        }
        delay(500);
        Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println("");
        Serial.print("WiFi connected. IP address: ");
        Serial.println(WiFi.localIP());
        Paint_ClearWindows(80, 70, 80 + 14 * 15, 80 + Segoe12.Height, WHITE);
        Paint_DrawString_custom(80, 70, u"Connected to Wifi!", &Segoe12, BLACK, WHITE);
        EPD_2IN9_V2_Display_Partial(BlackImage);
    }
}

void MQTT_Client_Init(const char *ssid, const char *password, const char *id, UBYTE *BlackImage)
{
    Serial.print(ssid);
    Serial.print(" ");
    Serial.println(password);
    setup_wifi(ssid, password, BlackImage);
    if (WiFi.status() == WL_CONNECTED)
    {
        client.setId(id);
        client.setUsernamePassword(MQTT_USERNAME, MQTT_PASSWORD);
    }
}

void MQTT_Connect(const char *id, UBYTE *BlackImage)
{
    if (WiFi.status() == WL_CONNECTED)
    {
        Paint_ClearWindows(80, 70, 80 + 14 * 15, 80 + Segoe12.Height, WHITE);
        Paint_DrawString_custom(80, 70, u"Attempting MQTT connection...", &Segoe12, BLACK, WHITE);
        EPD_2IN9_V2_Display_Partial(BlackImage);
        Serial.println("Attempting MQTT connection...");
        while (!client.connected())
        {
            if (client.connect(MQTT_BROKER, MQTT_PORT))
            {
                Paint_ClearWindows(80, 70, 80 + 14 * 15, 80 + Segoe12.Height, WHITE);
                Paint_DrawString_custom(80, 70, u"Connected to MQTT Broker", &Segoe12, BLACK, WHITE);
                EPD_2IN9_V2_Display_Partial(BlackImage);
                Serial.println(" connected");
                client.onMessage(onMessage);
                Serial.println(id);
                client.subscribe(id);
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
}

void handleMessage(char *message)
{
    static String msg = "";
    char *chr = message;
    size_t count = 0;
    int type = 0; // 0 - not defined
                  // 1 - write1
                  // 2 - write2
                  // 3 - write3
                  // 4 - write4
                  // 5 - write5
                  // 6 - ping
    while (*chr != '\0')
    {
        if (*chr == '|')
        {
            count++;
            Serial.print(count);
            Serial.print(", ");
            Serial.println(msg);
            switch (count)
            {
            case 1:
                if (compareStrings(msg.c_str(), "write1"))
                {
                    preferences.putInt("dataType", 1);
                    type = 1;
                }
                else if (compareStrings(msg.c_str(), "write2"))
                {
                    preferences.putInt("dataType", 2);
                    type = 2;
                }
                else if (compareStrings(msg.c_str(), "write3"))
                {
                    preferences.putInt("dataType", 3);
                    type = 3;
                }
                else if (compareStrings(msg.c_str(), "write4"))
                {
                    preferences.putInt("dataType", 4);
                    type = 4;
                }
                else if (compareStrings(msg.c_str(), "write5"))
                {
                    preferences.putInt("dataType", 5);
                    type = 5;
                }
                else if (compareStrings(msg.c_str(), "ping"))
                {
                    type = 6;
                    update = 6;
                    printf("----- update = %d\r\n", update);
                }
                else
                {
                    msg = "";
                    return;
                }
                break;
            case 2:
                if (compareStrings(msg.c_str(), "F8"))
                {
                    preferences.putString("font", "Font8");
                }
                else if (compareStrings(msg.c_str(), "F12"))
                {
                    preferences.putString("font", "Font12");
                }
                else if (compareStrings(msg.c_str(), "F16"))
                {
                    preferences.putString("font", "Font16");
                }
                else if (compareStrings(msg.c_str(), "F20"))
                {
                    preferences.putString("font", "Font20");
                }
                else if (compareStrings(msg.c_str(), "F24"))
                {
                    preferences.putString("font", "Font24");
                }
                else if (compareStrings(msg.c_str(), "S12"))
                {
                    preferences.putString("font", "Segoe12");
                }
                else if (compareStrings(msg.c_str(), "S16"))
                {
                    preferences.putString("font", "Segoe16");
                }
                else if (compareStrings(msg.c_str(), "S20"))
                {
                    preferences.putString("font", "Segoe20");
                }
                break;
            case 3:
                preferences.putString("schema", msg);
                break;
            case 4:
                preferences.putString("name", msg);
                break;
            case 5:
                preferences.putString("input2", msg);
                break;
            case 6: 
                preferences.putString("input3", msg);
                break;
            case 7:
                if (type == 1) {
                    String oldData = preferences.getString("dataID", "");
                    preferences.putString("dataID", msg);
                    preferences.putString("oldData", oldData);
                    update = 1;
                    printf("----- update = %d\r\n", update);
                } else if (type == 4) {
                    String oldData = preferences.getString("dataID", "");
                    preferences.putString("dataID", msg);
                    preferences.putString("oldData", oldData);
                    update = 4;
                    printf("----- update = %d\r\n", update);
                } else {
                    preferences.putString("input4", msg);
                }
                break;
            case 8:
                String oldData = preferences.getString("dataID", "");
                preferences.putString("dataID", msg);
                preferences.putString("oldData", oldData);

                if (type == 2) {
                    update = 2;
                    printf("----- update = %d\r\n", update);
                }else if (type == 3) {
                    update = 3;
                    printf("----- update = %d\r\n", update);
                } else if (type == 5) {
                    update = 5;
                    printf("----- update = %d\r\n", update);
                }
                break;
            }
            msg = "";
            chr++;
        }
        else
        {
            msg += *chr;
            chr++;
        }
    }
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
            Serial.print(s);
            newData[size] = s; // Add new character
            size++;
        }
        Serial.println();
        newData[size] = u'\0';
        handleMessage(newData);
    }
}

void MQTT_Loop(const char *topic, UBYTE *BlackImage)
{
    printf("loop done, update = %d\r\n", update);

    client.poll();
    if (update == 1)
    {
        String oldData = preferences.getString("oldData", "");
        displayWrite1(BlackImage);

        String writeOK = "replyOK|";
        writeOK += oldData;
        Serial.println(writeOK.c_str());

        Serial.println(topic);
        client.beginMessage(topic);
        client.print(writeOK.c_str());
        client.endMessage();
        
        update = 0;
    } else if (update == 2) {
        String oldData = preferences.getString("oldData", "");
        displayWrite2(BlackImage);

        String writeOK = "replyOK|";
        writeOK += oldData;
        Serial.println(writeOK.c_str());

        Serial.println(topic);
        client.beginMessage(topic);
        client.print(writeOK.c_str());
        client.endMessage();
        
        update = 0;
    } else if (update == 3) {
        String oldData = preferences.getString("oldData", "");
        displayWrite3(BlackImage);

        String writeOK = "replyOK|";
        writeOK += oldData;
        Serial.println(writeOK.c_str());

        Serial.println(topic);
        client.beginMessage(topic);
        client.print(writeOK.c_str());
        client.endMessage();
        
        update = 0;
    } else if (update == 4) {
        String oldData = preferences.getString("oldData", "");
        displayWrite4(BlackImage);

        String writeOK = "replyOK|";
        writeOK += oldData;
        Serial.println(writeOK.c_str());

        Serial.println(topic);
        client.beginMessage(topic);
        client.print(writeOK.c_str());
        client.endMessage();
        
        update = 0;
    } else if (update == 5) {
        String oldData = preferences.getString("oldData", "");
        displayWrite5(BlackImage);

        String writeOK = "replyOK|";
        writeOK += oldData;
        Serial.println(writeOK.c_str());

        Serial.println(topic);
        client.beginMessage(topic);
        client.print(writeOK.c_str());
        client.endMessage();
        
        update = 0;
    } else if (update == 6) {
        String dataID = preferences.getString("dataID", "");
        String writeOK = "pingOK|";
        writeOK += dataID;
        Serial.println(writeOK.c_str());

        Serial.println(topic);
        client.beginMessage(topic);
        client.print(writeOK.c_str());
        client.endMessage();
        update = 0;
    }
    DEV_Delay_ms(5000);
}
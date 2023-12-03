/* Includes ------------------------------------------------------------------*/
#include <DEV_Config.h>
#include <EPD.h>
#include <Paint.h>
#include <MQTT.h>
#include <Display.h>
#include <stdlib.h>
// #include <Preferences.h>

Preferences preferences;
UBYTE *BlackImage;
UWORD Imagesize = ((EPD_2IN9_V2_WIDTH % 8 == 0) ? (EPD_2IN9_V2_WIDTH / 8) : (EPD_2IN9_V2_WIDTH / 8 + 1)) * EPD_2IN9_V2_HEIGHT;


void setup()
{
    DEV_Delay_ms(1000);
    Serial.begin(115200);

    DEV_Module_Init();
    EPD_2IN9_V2_Init();
    EPD_2IN9_V2_Clear();
    DEV_Delay_ms(500);

    // Create a new image cache
    /* you have to edit the startup_stm32fxxx.s file and set a big enough heap size */
    if ((BlackImage = (UBYTE *)malloc(Imagesize)) == NULL)
    {
        printf("Failed to apply for black memory...\r\n");
        while (1)
            ;
    }
    printf("Paint_NewImage\r\n");
    Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 90, WHITE);

    preferences.begin("my-app", false);

#if 1
    Paint_Clear(0xff);
    char16_t * text = u"Initializing ....";
    const char16_t * Welcome = u"Pi's Epaper Project";
    Paint_DrawString_custom(80, 50, Welcome, &Segoe12, BLACK, WHITE);
    EPD_2IN9_V2_Display(BlackImage);

    Paint_ClearWindows(80, 70, 80 + 14 * 15, 80 + Segoe12.Height, WHITE);
    Paint_DrawString_custom(80, 70, text, &Segoe12, BLACK, WHITE);
    EPD_2IN9_V2_Display_Partial(BlackImage);
    DEV_Delay_ms(3000);

    text = u"Getting local data ...";
    Paint_ClearWindows(80, 70, 80 + 14 * 15, 80 + Segoe12.Height, WHITE);
    Paint_DrawString_custom(80, 70, text, &Segoe12, BLACK, WHITE);
    EPD_2IN9_V2_Display_Partial(BlackImage);

    // Get Preferences local data
    String ssid = preferences.getString("ssid", "");
    String password = preferences.getString("pass", "");
    String topic = preferences.getString("_id", "");
    String active = preferences.getString("active", "false");
    String userID = preferences.getString("userID", "");
    
    Serial.println(ssid);
    Serial.println(password);
    Serial.println(topic);
    Serial.println(active);
    Serial.println(userID);

    if (!ssid.isEmpty() && !password.isEmpty()) {
        // If SSID and password are available in Preferences, use them to connect to Wi-Fi
        MQTT_Client_Init(ssid.c_str(), password.c_str(), topic.c_str(), BlackImage);
        MQTT_Connect(topic.c_str(), BlackImage);
    }

    if (!userID.isEmpty()) {
        displayWrite1(BlackImage);
    }
#endif


    // printf("e-Paper Init and Clear...\r\n");


    // #if 1   //show image for array
    // Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 270, WHITE);
    //     printf("show image for array\r\n");
    //     Paint_SelectImage(BlackImage);
    //     Paint_Clear(WHITE);
    //     Paint_DrawBitMap(gImage_2in9);

    //     EPD_2IN9_V2_Display(BlackImage);
    //     DEV_Delay_ms(2000);
    // #endif

    // #if 1   // Drawing on the image
    //     printf("Drawing\r\n");
    //     //1.Select Image
    //     Paint_SelectImage(BlackImage);
    //     Paint_Clear(WHITE);

    //     // 2.Drawing on the image
    //     printf("Drawing:BlackImage\r\n");
    //     Paint_DrawPoint(10, 80, BLACK, DOT_PIXEL_1X1, DOT_STYLE_DFT);
    //     Paint_DrawPoint(10, 90, BLACK, DOT_PIXEL_2X2, DOT_STYLE_DFT);
    //     Paint_DrawPoint(10, 100, BLACK, DOT_PIXEL_3X3, DOT_STYLE_DFT);

    //     Paint_DrawLine(20, 70, 70, 120, BLACK, DOT_PIXEL_1X1, LINE_STYLE_SOLID);
    //     Paint_DrawLine(70, 70, 20, 120, BLACK, DOT_PIXEL_1X1, LINE_STYLE_SOLID);

    //     Paint_DrawRectangle(20, 70, 70, 120, BLACK, DOT_PIXEL_1X1, DRAW_FILL_EMPTY);
    //     Paint_DrawRectangle(80, 70, 130, 120, BLACK, DOT_PIXEL_1X1, DRAW_FILL_FULL);

    //     Paint_DrawCircle(45, 95, 20, BLACK, DOT_PIXEL_1X1, DRAW_FILL_EMPTY);
    //     Paint_DrawCircle(105, 95, 20, WHITE, DOT_PIXEL_1X1, DRAW_FILL_FULL);

    //     Paint_DrawLine(85, 95, 125, 95, BLACK, DOT_PIXEL_1X1, LINE_STYLE_DOTTED);
    //     Paint_DrawLine(105, 75, 105, 115, BLACK, DOT_PIXEL_1X1, LINE_STYLE_DOTTED);

    //     // Paint_DrawString(10, 0, "waveshare", &Font16, BLACK, WHITE);
    //     // Paint_DrawString(10, 20, "hello world", &Font12, WHITE, BLACK);

    //     Paint_DrawNum(10, 33, 123456789, &Font12, BLACK, WHITE);
    //     Paint_DrawNum(10, 50, 987654321, &Font16, WHITE, BLACK);

    //     EPD_2IN9_V2_Display_Base(BlackImage);
    //     DEV_Delay_ms(2000);
    // #endif

    // EPD_2IN9_V2_Init();
    // Paint_SetRotate(90);
    // Paint_DrawString(100, 20, "!", &Segoe12, WHITE, BLACK);
    //     Imagesize = ((EPD_2IN9_V2_WIDTH % 4 == 0)? (EPD_2IN9_V2_WIDTH / 4 ): (EPD_2IN9_V2_WIDTH / 4 + 1)) * EPD_2IN9_V2_HEIGHT;
    // if((BlackImage = (UBYTE *)malloc(Imagesize)) == NULL) {
    //     printf("Failed to apply for black memory...\r\n");
    //     while(1);
    // }
    // Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 90, WHITE);
    // Paint_SelectImage(BlackImage);
    // Paint_SetScale(4);

    // Paint_DrawString_custom(150, 10, "你好abc", &Font12CN, GRAY4, GRAY1);
    // Paint_DrawString_custom(150, 30, "你 好 树 莓派", &Font12CN, GRAY3, GRAY2);
    // const char16_t * Line2 = u"Addr: DHBK, Hai Bà Trưng, Hà Nội, Việt Nam";
    // const char16_t * Line3 = u"Tel: (+84) 796 045 129";
    // const char16_t * Line4 = u"Email: minh.vln140501@gmail.com";
    // Paint_DrawString_custom(10, 50, Line2, &Segoe12, BLACK, WHITE); // ẠĂẰẮẲẴẶÂẦẤẨẪẬẠĂẰẮẲẴẶÂẦẤẨẪẬẠĂẰẮẲẴẶÂẦẤẨẪẬ
    // Paint_DrawString_custom(10, 70, Line3, &Segoe12, BLACK, WHITE); // ẠĂẰẮẲẴẶÂẦẤẨẪẬẠĂẰẮẲẴẶÂẦẤẨẪẬẠĂẰẮẲẴẶÂẦẤẨẪẬ
    // Paint_DrawString_custom(50, 90, Line4, &Segoe12, BLACK, WHITE); // ẠĂẰẮẲẴẶÂẦẤẨẪẬẠĂẰẮẲẴẶÂẦẤẨẪẬẠĂẰẮẲẴẶÂẦẤẨẪẬ
    // Paint_DrawString_custom(10, 70, "Vũ Lê Nhật Minh", &Segoe12, WHITE, BLACK);
    // Paint_DrawString_custom(150, 60, "微雪电子Ả", &Font12CN, GRAY1, GRAY4);
    // Paint_DrawString_custom(10, 20, "微雪电子", &Font12CN, GRAY1, GRAY4);
    // Paint_Clear(0xff);
    // EPD_2IN9_V2_4GrayDisplay(BlackImage);

// #if 1
//     free(BlackImage);
//     // printf("show Gray------------------------\r\n");
//     // Imagesize = ((EPD_2IN9_V2_WIDTH % 4 == 0) ? (EPD_2IN9_V2_WIDTH / 4) : (EPD_2IN9_V2_WIDTH / 4 + 1)) * EPD_2IN9_V2_HEIGHT;
//     // if ((BlackImage = (UBYTE *)malloc(Imagesize)) == NULL)
//     // {
//     //     printf("Failed to apply for black memory...\r\n");
//     //     while (1)
//     //         ;
//     // }
//     // EPD_2IN9_V2_Gray4_Init();
//     EPD_2IN9_V2_Clear();
//     printf("4 grayscale display\r\n");
//     Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 90, WHITE);
//     Paint_SetScale(4);
//     Paint_Clear(0xff);

//     Paint_DrawString(10, 0, "waveshare", &Font16, GRAY4, GRAY1);
//     Paint_DrawString(10, 20, "hello world", &Font12, GRAY3, GRAY1);
//     Paint_DrawNum(10, 33, 123456789, &Font12, GRAY4, GRAY2);
//     Paint_DrawNum(10, 50, 987654321, &Font16, GRAY1, GRAY4);
//     Paint_DrawString_custom(150, 0, "你好abc", &Font12CN, GRAY4, GRAY1);
//     Paint_DrawString_custom(150, 20, "你好abc", &Font12CN, GRAY3, GRAY2);
//     Paint_DrawString_custom(150, 40, "你好abc", &Font12CN, GRAY2, GRAY3);
//     Paint_DrawString_custom(150, 60, "你好abc", &Font12CN, GRAY1, GRAY4);
//     Paint_DrawString_custom(150, 80, "微雪电子", &Font12CN, GRAY1, GRAY4);
//     EPD_2IN9_V2_4GrayDisplay(BlackImage);
//     DEV_Delay_ms(3000);

//     // Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 0, WHITE);
//     // Paint_SetScale(4);
//     // Paint_Clear(WHITE);
//     // EPD_2IN9_V2_Display(BlackImage);
//     // DEV_Delay_ms(3000);
// #endif

    // #if 1   //Partial refresh, example shows time
    //     printf("Partial refresh\r\n");
    //     PAINT_TIME sPaint_time;
    //     sPaint_time.Hour = 12;
    //     sPaint_time.Min = 34;
    //     sPaint_time.Sec = 56;
    //     UBYTE num = 20;
    //     for (;;) {
    //         sPaint_time.Sec = sPaint_time.Sec + 1;
    //         if (sPaint_time.Sec == 60) {
    //             sPaint_time.Min = sPaint_time.Min + 1;
    //             sPaint_time.Sec = 0;
    //             if (sPaint_time.Min == 60) {
    //                 sPaint_time.Hour =  sPaint_time.Hour + 1;
    //                 sPaint_time.Min = 0;
    //                 if (sPaint_time.Hour == 24) {
    //                     sPaint_time.Hour = 0;
    //                     sPaint_time.Min = 0;
    //                     sPaint_time.Sec = 0;
    //                 }
    //             }
    //         }
    //         Paint_ClearWindows(150, 80, 150 + Font20.Width * 7, 80 + Font20.Height, WHITE);
    //         Paint_DrawTime(150, 80, &sPaint_time, &Font20, WHITE, BLACK);

    //         num = num - 1;
    //         if(num == 0) {
    //             break;
    //         }
    //         EPD_2IN9_V2_Display_Partial(BlackImage);
    //         DEV_Delay_ms(500);//Analog clock 1s
    //     }

    // #endif

    // #if 1 // show image for array
    //     free(BlackImage);
    //     printf("show Gray------------------------\r\n");
    //     Imagesize = ((EPD_2IN9_V2_WIDTH % 4 == 0)? (EPD_2IN9_V2_WIDTH / 4 ): (EPD_2IN9_V2_WIDTH / 4 + 1)) * EPD_2IN9_V2_HEIGHT;
    //     if((BlackImage = (UBYTE *)malloc(Imagesize)) == NULL) {
    //         printf("Failed to apply for black memory...\r\n");
    //         while(1);
    //     }
    //     EPD_2IN9_V2_Gray4_Init();
    //     printf("4 grayscale display\r\n");
    //     Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 90, WHITE);
    //     Paint_SetScale(4);
    //     Paint_Clear(0xff);

    //     Paint_DrawPoint(10, 80, GRAY4, DOT_PIXEL_1X1, DOT_STYLE_DFT);
    //     Paint_DrawPoint(10, 90, GRAY4, DOT_PIXEL_2X2, DOT_STYLE_DFT);
    //     Paint_DrawPoint(10, 100, GRAY4, DOT_PIXEL_3X3, DOT_STYLE_DFT);
    //     Paint_DrawLine(20, 70, 70, 120, GRAY4, DOT_PIXEL_1X1, LINE_STYLE_SOLID);
    //     Paint_DrawLine(70, 70, 20, 120, GRAY4, DOT_PIXEL_1X1, LINE_STYLE_SOLID);
    //     Paint_DrawRectangle(20, 70, 70, 120, GRAY4, DOT_PIXEL_1X1, DRAW_FILL_EMPTY);
    //     Paint_DrawRectangle(80, 70, 130, 120, GRAY4, DOT_PIXEL_1X1, DRAW_FILL_FULL);
    //     Paint_DrawCircle(45, 95, 20, GRAY4, DOT_PIXEL_1X1, DRAW_FILL_EMPTY);
    //     Paint_DrawCircle(105, 95, 20, GRAY2, DOT_PIXEL_1X1, DRAW_FILL_FULL);
    //     Paint_DrawLine(85, 95, 125, 95, GRAY4, DOT_PIXEL_1X1, LINE_STYLE_DOTTED);
    //     Paint_DrawLine(105, 75, 105, 115, GRAY4, DOT_PIXEL_1X1, LINE_STYLE_DOTTED);
    //     Paint_DrawString(10, 0, "waveshare", &Font16, GRAY4, GRAY1);
    //     Paint_DrawString(10, 20, "hello world", &Font12, GRAY3, GRAY1);
    //     Paint_DrawNum(10, 33, 123456789, &Font12, GRAY4, GRAY2);
    //     Paint_DrawNum(10, 50, 987654321, &Font16, GRAY1, GRAY4);
    //     Paint_DrawString_custom(150, 0,"你好abc", &Font12CN, GRAY4, GRAY1);
    //     Paint_DrawString_custom(150, 20,"你好abc", &Font12CN, GRAY3, GRAY2);
    //     Paint_DrawString_custom(150, 40,"你好abc", &Font12CN, GRAY2, GRAY3);
    //     Paint_DrawString_custom(150, 60,"你好abc", &Font12CN, GRAY1, GRAY4);
    //     Paint_DrawString_custom(150, 80, "微雪电子", &Font24CN, GRAY1, GRAY4);
    //     EPD_2IN9_V2_4GrayDisplay(BlackImage);
    //     DEV_Delay_ms(3000);

    //     Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 0, WHITE);
    //     Paint_SetScale(4);
    //     Paint_Clear(WHITE);
    //     Paint_DrawBitMap(gImage_2in9_Gray4);
    //     EPD_2IN9_V2_4GrayDisplay(BlackImage);
    //     DEV_Delay_ms(3000);

    // #endif

    // printf("Clear...\r\n");
    // EPD_2IN9_V2_Init();
    // EPD_2IN9_V2_Clear();

    // printf("Goto Sleep...\r\n");
    // EPD_2IN9_V2_Sleep();
    // free(BlackImage);
    // BlackImage = NULL;
}

void loop()
{
    static String key = "";
    static String value = "";
    static bool isKey = true;
    static bool updated = false;
    while (Serial.available()) { // Check if data is available to read
        char c = Serial.read();
        if (c == ':') {
            isKey = false;
        } else if (c == '\n') {
            Serial.print("Received ");
            Serial.print(key);
            Serial.print(":");
            Serial.println(value);
            preferences.putString(key.c_str(), value);
            updated = true;
            key = "";
            value = "";
            isKey = true;
        } else {
            if (isKey) {
                key += c;
            } else {
                value += c;
            }
        }
    }

    // Reconfig after Preferences update
    if (updated) {
        String ssid = preferences.getString("ssid", "");
        String password = preferences.getString("pass", "");
        String topic = preferences.getString("_id", "");
        MQTT_Client_Init(ssid.c_str(), password.c_str(), topic.c_str(), BlackImage);
        MQTT_Connect(topic.c_str(), BlackImage);
        MQTT_Loop(topic.c_str(), BlackImage);
        updated = false;
    } else {
        String topic = preferences.getString("_id", "");
        MQTT_Loop(topic.c_str(), BlackImage);
    }
}

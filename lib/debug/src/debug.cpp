#include <DEV_Config.h>
#include <EPD.h>
#include <Paint.h>
#include <WiFi.h>
#include <Wire.h>
#include <MQTT.h>
#include <Display.h>
#include <image.h>
#include <ArduinoMqttClient.h>
#include <cstdint>

void softwareReset() {
  ESP.restart();
}

void enterDebugMode()
{
    UBYTE *BlackImage;
    UWORD Imagesize = ((EPD_2IN9_V2_WIDTH % 8 == 0) ? (EPD_2IN9_V2_WIDTH / 8) : (EPD_2IN9_V2_WIDTH / 8 + 1)) * EPD_2IN9_V2_HEIGHT;

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

    Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 90, WHITE);

#if 1
    const char16_t * Welcome = u"Pi's Epaper Project";
    char16_t * text = u"Debug Mode";

    Paint_DrawString_custom(50, 50, Welcome, &Segoe16Bold, BLACK, WHITE);
    EPD_2IN9_V2_Display(BlackImage);

    Paint_ClearWindows(80, 70, 80 + 14 * 15, 80 + Segoe12.Height, WHITE);
    Paint_DrawString_custom(80, 70, text, &Segoe12, BLACK, WHITE);
    EPD_2IN9_V2_Display_Partial(BlackImage);
    DEV_Delay_ms(3000);
#endif


    #if 1   //show image for array    
    printf("show image for array\r\n");
    Paint_SelectImage(BlackImage);
    Paint_Clear(WHITE);
    Paint_DrawBitMap(image);

    EPD_2IN9_V2_Display(BlackImage);
    DEV_Delay_ms(30000);
    #endif

    #if 1   // Drawing on the image
        printf("Drawing\r\n");
        //1.Select Image
        Paint_SelectImage(BlackImage);
        Paint_Clear(WHITE);

        // 2.Drawing on the image
        printf("Drawing:BlackImage\r\n");
        Paint_DrawPoint(10, 80, BLACK, DOT_PIXEL_1X1, DOT_STYLE_DFT);
        Paint_DrawPoint(10, 90, BLACK, DOT_PIXEL_2X2, DOT_STYLE_DFT);
        Paint_DrawPoint(10, 100, BLACK, DOT_PIXEL_3X3, DOT_STYLE_DFT);

        Paint_DrawLine(20, 70, 70, 120, BLACK, DOT_PIXEL_1X1, LINE_STYLE_SOLID);
        Paint_DrawLine(70, 70, 20, 120, BLACK, DOT_PIXEL_1X1, LINE_STYLE_SOLID);

        Paint_DrawRectangle(20, 70, 70, 120, BLACK, DOT_PIXEL_1X1, DRAW_FILL_EMPTY);
        Paint_DrawRectangle(80, 70, 130, 120, BLACK, DOT_PIXEL_1X1, DRAW_FILL_FULL);

        Paint_DrawCircle(45, 95, 20, BLACK, DOT_PIXEL_1X1, DRAW_FILL_EMPTY);
        Paint_DrawCircle(105, 95, 20, WHITE, DOT_PIXEL_1X1, DRAW_FILL_FULL);

        Paint_DrawLine(85, 95, 125, 95, BLACK, DOT_PIXEL_1X1, LINE_STYLE_DOTTED);
        Paint_DrawLine(105, 75, 105, 115, BLACK, DOT_PIXEL_1X1, LINE_STYLE_DOTTED);

        // Paint_DrawString(10, 0, "waveshare", &Font16, BLACK, WHITE);
        Paint_DrawString_segment(10, 20, "ÀẢàả !", &Segoe12_Segment, BLACK, WHITE);

        EPD_2IN9_V2_Display_Base(BlackImage);
        DEV_Delay_ms(5000);
    #endif


#if 1
    free(BlackImage);
    // printf("show Gray------------------------\r\n");
    // Imagesize = ((EPD_2IN9_V2_WIDTH % 4 == 0) ? (EPD_2IN9_V2_WIDTH / 4) : (EPD_2IN9_V2_WIDTH / 4 + 1)) * EPD_2IN9_V2_HEIGHT;
    // if ((BlackImage = (UBYTE *)malloc(Imagesize)) == NULL)
    // {
    //     printf("Failed to apply for black memory...\r\n");
    //     while (1)
    //         ;
    // }
    // EPD_2IN9_V2_Gray4_Init();
    EPD_2IN9_V2_Clear();
    printf("4 grayscale display\r\n");
    Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 90, WHITE);
    Paint_SetScale(2);
    Paint_Clear(0xff);

    // Paint_DrawString_custom_8(10, 0, "ahihihi", &Segoe12_8, GRAY4, GRAY1);
    // Paint_DrawString(10, 0, "waveshare", &Font16, GRAY4, GRAY1);
    Paint_DrawString(10, 20, "hello world", &Font12, GRAY3, GRAY1);
    EPD_2IN9_V2_4GrayDisplay(BlackImage);
    DEV_Delay_ms(3000);

    // Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 0, WHITE);
    // Paint_SetScale(4);
    // Paint_Clear(WHITE);
    // EPD_2IN9_V2_Display(BlackImage);
    // DEV_Delay_ms(3000);
#endif

    #if 1   //Partial refresh, example shows time
        printf("Partial refresh\r\n");
        PAINT_TIME sPaint_time;
        sPaint_time.Hour = 12;
        sPaint_time.Min = 34;
        sPaint_time.Sec = 56;
        UBYTE num = 20;
        for (;;) {
            sPaint_time.Sec = sPaint_time.Sec + 1;
            if (sPaint_time.Sec == 60) {
                sPaint_time.Min = sPaint_time.Min + 1;
                sPaint_time.Sec = 0;
                if (sPaint_time.Min == 60) {
                    sPaint_time.Hour =  sPaint_time.Hour + 1;
                    sPaint_time.Min = 0;
                    if (sPaint_time.Hour == 24) {
                        sPaint_time.Hour = 0;
                        sPaint_time.Min = 0;
                        sPaint_time.Sec = 0;
                    }
                }
            }
            Paint_ClearWindows(150, 80, 150 + Font20.Width * 7, 80 + Font20.Height, WHITE);
            Paint_DrawTime(150, 80, &sPaint_time, &Font20, WHITE, BLACK);

            num = num - 1;
            if(num == 0) {
                break;
            }
            EPD_2IN9_V2_Display_Partial(BlackImage);
            DEV_Delay_ms(500);//Analog clock 1s
        }

    #endif

    

    printf("Clear...\r\n");
    EPD_2IN9_V2_Init();
    EPD_2IN9_V2_Clear();

    printf("Goto Sleep...\r\n");
    // EPD_2IN9_V2_Sleep();

    const char16_t * Welcome = u"Pi's Epaper Project";
    const char16_t * test = u"aàáảãạăằắẳẵặâầấẩẫậbcdđeèé";
    const char16_t * test2 = u"ẻẽẹêềếểễệfghiìíỉĩịjklmno";
    const char16_t * test3 = u"òóỏõọôồốổỗộơờớởỡợpqrstuù";
    const char16_t * test4 = u"úủũụưừứữựvwxyỳýỷỹỵz12345";
    const char16_t * test5 = u"67890!*\\\"ABCDEFGHIJKLM";
    const char16_t * test6 = u"NOPQRSTUVWXYZ#$%&'()+,-";
    const char16_t * test7 = u"./0123456789:;<=>?@[]^_`";
    const char16_t * test8 = u"{|}~ÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺ";
    const char16_t * test9 = u"ẼẸÊỀẾỂỄỆÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠ";
    const char16_t * test10 = u"ỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴÌÍỈĨỊĐ";
}

void startDebugging() {
    preferences.putBool("debugMode", true); // Clear flag
    softwareReset();
}
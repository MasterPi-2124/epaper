#include <DEV_Config.h>
#include <EPD_2in9_V2.h>
#include <Paint.h>
#include <Display.h>
#include <image.h>

void softwareReset()
{
    ESP.restart();
}

void enterDebugMode(UBYTE * BlackImage)
{
    // START
    const char *Welcome = "Pi's Epaper Project";
    const char *text = "Debug Mode";
    EPD_2IN9_V2_Clear();
    Paint_SelectImage(BlackImage);
    Paint_Clear(0xff);
    Paint_DrawString_segment(60, 40, Welcome, &Segoe16Bold, BLACK, WHITE);
    EPD_2IN9_V2_Display(BlackImage);

    Paint_ClearWindows(30, 70, 30 + 14 * 15, 70 + Segoe11.Height, WHITE);
    Paint_DrawString_segment(110, 70, text, &Segoe11, BLACK, WHITE);
    EPD_2IN9_V2_Display_Partial(BlackImage);
    DEV_Delay_ms(3000);

    // SHOW IMAGE
    printf("show image for array\r\n");
    Paint_SelectImage(BlackImage);
    Paint_Clear(0xff);
    // Paint_ClearWindows(0, 0, EPD_2IN9_V2_HEIGHT - 1, EPD_2IN9_V2_WIDTH - 1, WHITE);
    Paint_DrawString_segment(20, 40, "Partial  Images", &Segoe20, BLACK, WHITE);
    EPD_2IN9_V2_Display_Partial(BlackImage);
    DEV_Delay_ms(3000);

    Paint_SelectImage(BlackImage);
    Paint_Clear(0xff);
    EPD_2IN9_V2_Init();
    EPD_2IN9_V2_Clear();
    Paint_DrawImage(epaper, 10, 10, 100, 100);
    EPD_2IN9_V2_Display(BlackImage);
    DEV_Delay_ms(3000);

    Paint_DrawImage(realio, 10, 120, 100, 100);
    EPD_2IN9_V2_Display_Partial(BlackImage);
    DEV_Delay_ms(5000);

    Paint_SelectImage(BlackImage);
    Paint_Clear(0xff);
    EPD_2IN9_V2_Init();
    EPD_2IN9_V2_Clear();
    Paint_DrawBitMap(example);
    EPD_2IN9_V2_Display(BlackImage);
    DEV_Delay_ms(10000);


    //DRAW SHAPE
    Paint_SelectImage(BlackImage);
    Paint_Clear(0xff);

    Paint_DrawString_segment(20, 40, "Draw  Shapes", &Segoe20, BLACK, WHITE);
    EPD_2IN9_V2_Display_Partial(BlackImage);
    DEV_Delay_ms(3000);

    // 2.Drawing on the image
    EPD_2IN9_V2_Init();
    EPD_2IN9_V2_Clear();
    Paint_SelectImage(BlackImage);
    Paint_Clear(0xff);
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

    EPD_2IN9_V2_Display_Base(BlackImage);
    DEV_Delay_ms(5000);

    //Draw text

    Paint_SelectImage(BlackImage);
    Paint_Clear(0xff);
    Paint_DrawString_segment(20, 40, "Draw  text", &Segoe20, BLACK, WHITE);
    EPD_2IN9_V2_Display_Partial(BlackImage);
    DEV_Delay_ms(3000);

    EPD_2IN9_V2_Init();
    EPD_2IN9_V2_Clear();
    Paint_SelectImage(BlackImage);
    Paint_Clear(0xff);

    Paint_DrawString_segment(10, 5, "Đây là Segoe UI Light 11pt", &Segoe11, BLACK, WHITE);
    Paint_DrawString_segment(10, 25, "Đây là Segoe UI Bold 11pt", &Segoe11Bold, BLACK, WHITE);
    Paint_DrawString_segment(10, 42, "Đây là Segoe UI Light 16pt", &Segoe16, BLACK, WHITE);
    Paint_DrawString_segment(10, 65, "Đây là Segoe UI Bold 16pt", &Segoe16Bold, BLACK, WHITE);
    Paint_DrawString_segment(10, 87, "Đây là Segoe UI Light 20pt", &Segoe20, BLACK, WHITE);
    EPD_2IN9_V2_Display(BlackImage);
    DEV_Delay_ms(10000);
    
    EPD_2IN9_V2_Init();
    EPD_2IN9_V2_Clear();
    Paint_SelectImage(BlackImage);
    Paint_Clear(0xff);

    Paint_DrawString(5, 25, "This is Monospace 12pt", &Font12, BLACK, WHITE);
    Paint_DrawString(5, 45, "This is Monospace 16pt", &Font16, BLACK, WHITE);
    Paint_DrawString(5, 65, "This is Monospace 20pt", &Font20, BLACK, WHITE);
    EPD_2IN9_V2_Display_Partial(BlackImage);
    DEV_Delay_ms(10000);

    // EPD_2IN9_V2_Gray4_Init();
    EPD_2IN9_V2_Clear();
    printf("4 grayscale display\r\n");
    Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 90, WHITE);
    Paint_SetScale(2);
    Paint_Clear(0xff);

    Paint_DrawString(10, 20, "hello world", &Font12, GRAY3, GRAY1);
    EPD_2IN9_V2_4GrayDisplay(BlackImage);
    DEV_Delay_ms(3000);

    Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 0, WHITE);
    Paint_SetScale(4);
    Paint_Clear(WHITE);
    EPD_2IN9_V2_Display(BlackImage);
    DEV_Delay_ms(3000);

    EPD_2IN9_V2_Init();
    EPD_2IN9_V2_Clear();
    Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 90, WHITE);
    Paint_Clear(0xff);
    Paint_DrawString_segment(50, 40, "End of Debugging mode", &Segoe16, BLACK, WHITE);
    EPD_2IN9_V2_Display(BlackImage);
    DEV_Delay_ms(3000);
}

void startDebugging()
{
    preferences.putBool("debugMode", true); // Clear flag
    softwareReset();
}
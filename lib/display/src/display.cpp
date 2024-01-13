#include <EPD_2in9_V2.h>
#include <Paint.h>
#include <Wire.h>
#include <cstdint>
#include <Display.h>
#include <qrcode.h>

size_t length;

char16_t *utf8ToUtf16(const char *utf8, size_t &outLength)
{
    size_t utf8_length = strlen(utf8);
    size_t maximum_utf16_length = utf8_length * 2;
    char16_t *utf16 = new char16_t[maximum_utf16_length];
    size_t utf16_index = 0;

    while (*utf8)
    {
        unsigned char byte = *utf8++;
        uint32_t codepoint;

        if (byte <= 0x7F)
        { // Single-byte UTF-8 character (ASCII)
            codepoint = byte;
        }
        else if (byte <= 0xBF)
        {
            // Continuation byte, handle error or skip
            continue;
        }
        else if (byte <= 0xDF)
        {
            codepoint = byte & 0x1F;
            codepoint <<= 6;
            codepoint |= (*utf8++ & 0x3F);
        }
        else if (byte <= 0xEF)
        {
            codepoint = byte & 0x0F;
            codepoint <<= 6;
            codepoint |= (*utf8++ & 0x3F);
            codepoint <<= 6;
            codepoint |= (*utf8++ & 0x3F);
        }
        else
        {
            codepoint = byte & 0x07;
            codepoint <<= 6;
            codepoint |= (*utf8++ & 0x3F);
            codepoint <<= 6;
            codepoint |= (*utf8++ & 0x3F);
            codepoint <<= 6;
            codepoint |= (*utf8++ & 0x3F);
        }

        if (codepoint <= 0xFFFF)
        {
            utf16[utf16_index++] = static_cast<char16_t>(codepoint);
        }
        else
        {
            codepoint -= 0x10000;
            utf16[utf16_index++] = static_cast<char16_t>(0xD800 | (codepoint >> 10));
            utf16[utf16_index++] = static_cast<char16_t>(0xDC00 | (codepoint & 0x03FF));
        }
    }

    // Allocate memory for the output
    outLength = utf16_index;
    char16_t *output = new char16_t[outLength + 1]; // +1 for null-terminator
    memcpy(output, utf16, outLength * sizeof(char16_t));
    // Copy data from vector to the new array

    output[outLength] = 0; // Null-terminate the string
    delete[] utf16;
    return output;
}

const unsigned char * textToQR(const char* data) {
    int qrVersion = 11; // Adjust the QR version as needed
    int bufferSize = qrcode_getBufferSize(qrVersion);
    
    // Dynamically allocate memory for the QR code
    uint8_t* qrcodeData = new uint8_t[bufferSize];
    if (!qrcodeData) {
        Serial.println("Failed to allocate memory for QR code");
        return nullptr;
    }

    // Initialize QR code
    QRCode qrcode;
    qrcode_initText(&qrcode, qrcodeData, qrVersion, 0, data);

    // Calculate the size of the EPD array
    int size = ((qrcode.size + 7) / 8) * qrcode.size;

    // Dynamically allocate memory for the EPD array
    unsigned char * epdArray = new unsigned char[size];
    if (!epdArray) {
        Serial.println("Failed to allocate memory for EPD array");
        return nullptr;
    }

    memset(epdArray, 0, size);

    for (int y = 0; y < qrcode.size; y++) { 
        for (int x = 0; x < qrcode.size; x++) {
            int byteIndex = (y * (qrcode.size + 8 - (qrcode.size % 8)) + x) / 8;
            int bitIndex = x % 8;
            if (qrcode_getModule(&qrcode, x, y)) {
                epdArray[byteIndex] |= (unsigned char) (1 << (7 - bitIndex));
                Serial.print("#");
            } else {
                Serial.print(" ");
            }
        }
        Serial.print("\n");
    }
    Serial.print("\n");
    Serial.print("\n");
    return (const unsigned char *) epdArray;

}

int compareStrings(const char *str1, const char *str2)
{
    while (*str1 && *str2 && *str1 == *str2)
    {
        str1++;
        str2++;
    }

    // Check if both strings are equal
    if (*str1 == '\0' && *str2 == '\0')
    {
        return 1; // Strings are equal
    }
    else
    {
        return 0; // Strings are not equal
    }
}

void displayWrite1(UBYTE * BlackImage) {
    String name = preferences.getString("name", "");
    String email = preferences.getString("input2", "");
    String address = preferences.getString("input3", "");
    String font = preferences.getString("font", "");
    String schema = preferences.getString("schema", "");

    Serial.print(" -- name: ");
    Serial.println(name.c_str());
    Serial.print(" -- email: ");
    Serial.println(email.c_str());
    Serial.print(" -- addr: ");
    Serial.println(address.c_str());
    Serial.print(" -- font: ");
    Serial.println(font.c_str());
    Serial.print(" -- schema: ");
    Serial.println(schema.c_str());

    char16_t * name16 = utf8ToUtf16(name.c_str(), length);
    char16_t * email16 = utf8ToUtf16(email.c_str(), length);
    char16_t * address16 = utf8ToUtf16(address.c_str(), length);

    if (compareStrings(schema.c_str(), "1")) {
        EPD_2IN9_V2_Init();
        Paint_Clear(0xff);
        Paint_DrawString_custom(10, 30, name16, &Segoe12, BLACK, WHITE);
        Paint_DrawString_custom(10, 50, email16, &Segoe12, BLACK, WHITE);
        Paint_DrawString_custom(10, 70, address16, &Segoe12, BLACK, WHITE);
        EPD_2IN9_V2_Display(BlackImage);
    }
}

void displayWrite2(UBYTE * BlackImage) {
    String name = preferences.getString("name", "");
    String email = preferences.getString("input2", "");
    String studentID = preferences.getString("input3", "");
    String _class = preferences.getString("input4", "");
    String font = preferences.getString("font", "");
    String schema = preferences.getString("schema", "");

    Serial.print(" -- name: ");
    Serial.println(name.c_str());
    Serial.print(" -- email: ");
    Serial.println(email.c_str());
    Serial.print(" -- studentID: ");
    Serial.println(studentID.c_str());
    Serial.print(" -- class: ");
    Serial.println(_class.c_str());
    Serial.print(" -- font: ");
    Serial.println(font.c_str());
    Serial.print(" -- schema: ");
    Serial.println(schema.c_str());

    char16_t * name16 = utf8ToUtf16(name.c_str(), length);
    char16_t * email16 = utf8ToUtf16(email.c_str(), length);
    char16_t * studentID16 = utf8ToUtf16(studentID.c_str(), length);
    char16_t * class16 = utf8ToUtf16(_class.c_str(), length);

    if (compareStrings(schema.c_str(), "1")) {
        EPD_2IN9_V2_Init();
        Paint_Clear(0xff);
        Paint_DrawString_custom(10, 30, name16, &Segoe12, BLACK, WHITE);
        Paint_DrawString_custom(10, 50, email16, &Segoe12, BLACK, WHITE);
        Paint_DrawString_custom(10, 70, studentID16, &Segoe12, BLACK, WHITE);
        Paint_DrawString_custom(10, 90, class16, &Segoe12, BLACK, WHITE);
        EPD_2IN9_V2_Display(BlackImage);
    }
}

void displayWrite3(UBYTE * BlackImage) {
    String name = preferences.getString("name", "");
    String email = preferences.getString("input2", "");
    String employeeID = preferences.getString("input3", "");
    String department = preferences.getString("input4", "");
    String font = preferences.getString("font", "");
    String schema = preferences.getString("schema", "");

    Serial.print(" -- name: ");
    Serial.println(name.c_str());
    Serial.print(" -- email: ");
    Serial.println(email.c_str());
    Serial.print(" -- employeeID: ");
    Serial.println(employeeID.c_str());
    Serial.print(" -- department: ");
    Serial.println(department.c_str());
    Serial.print(" -- font: ");
    Serial.println(font.c_str());
    Serial.print(" -- schema: ");
    Serial.println(schema.c_str());

    char16_t * name16 = utf8ToUtf16(name.c_str(), length);
    char16_t * email16 = utf8ToUtf16(email.c_str(), length);
    char16_t * employeeID16 = utf8ToUtf16(employeeID.c_str(), length);
    char16_t * department16 = utf8ToUtf16(department.c_str(), length);

    if (compareStrings(schema.c_str(), "1")) {
        EPD_2IN9_V2_Init();
        Paint_Clear(0xff);
        Paint_DrawString_custom(10, 30, name16, &Segoe12, BLACK, WHITE);
        Paint_DrawString_custom(10, 50, email16, &Segoe12, BLACK, WHITE);
        Paint_DrawString_custom(10, 70, employeeID16, &Segoe12, BLACK, WHITE);
        Paint_DrawString_custom(10, 90, department16, &Segoe12, BLACK, WHITE);
        EPD_2IN9_V2_Display(BlackImage);
    }
}

void displayWrite4(UBYTE * BlackImage) {
    String name = preferences.getString("name", "");
    String category = preferences.getString("input2", "");
    String price = preferences.getString("input3", "");
    String font = preferences.getString("font", "");
    String schema = preferences.getString("schema", "");

    Serial.print(" -- name: ");
    Serial.println(name.c_str());
    Serial.print(" -- category: ");
    Serial.println(category.c_str());
    Serial.print(" -- price: ");
    Serial.println(price.c_str());
    Serial.print(" -- font: ");
    Serial.println(font.c_str());
    Serial.print(" -- schema: ");
    Serial.println(schema.c_str());

    char16_t * name16 = utf8ToUtf16(name.c_str(), length);
    char16_t * category16 = utf8ToUtf16(category.c_str(), length);
    char16_t * price16 = utf8ToUtf16(price.c_str(), length);

    if (compareStrings(schema.c_str(), "1")) {
        EPD_2IN9_V2_Init();
        Paint_SetScale(2);
        Paint_Clear(0xff);
        if (compareStrings(schema.c_str(), "1")) {
            Paint_DrawString_custom(10, 50, name16, &Segoe16Bold, BLACK, WHITE);
            Paint_DrawString_custom(10, 90, price16, &Segoe16, BLACK, WHITE);
            Paint_DrawString_custom(10, 20, category16, &Segoe12, BLACK, WHITE);
        }
        EPD_2IN9_V2_Display(BlackImage);
    }
}

void displayWrite5(UBYTE * BlackImage) {
    String name = preferences.getString("name", "");
    String purpose = preferences.getString("input2", "");
    String manager = preferences.getString("input3", "");
    String status = preferences.getString("input4", "");
    String font = preferences.getString("font", "");
    String schema = preferences.getString("schema", "");

    Serial.print(" -- name: ");
    Serial.println(name.c_str());
    Serial.print(" -- purpose: ");
    Serial.println(purpose.c_str());
    Serial.print(" -- manager: ");
    Serial.println(manager.c_str());
    Serial.print(" -- status: ");
    Serial.println(status.c_str());
    Serial.print(" -- font: ");
    Serial.println(font.c_str());
    Serial.print(" -- schema: ");
    Serial.println(schema.c_str());

    char16_t * name16 = utf8ToUtf16(name.c_str(), length);
    char16_t * purpose16 = utf8ToUtf16(purpose.c_str(), length);
    char16_t * manager16 = utf8ToUtf16(manager.c_str(), length);
    char16_t * status16 = utf8ToUtf16(status.c_str(), length);

    if (compareStrings(schema.c_str(), "1")) {
        EPD_2IN9_V2_Init();
        Paint_Clear(0xff);
        Paint_DrawString_custom(10, 30, name16, &Segoe12, BLACK, WHITE);
        Paint_DrawString_custom(10, 50, purpose16, &Segoe12, BLACK, WHITE);
        Paint_DrawString_custom(10, 70, manager16, &Segoe12, BLACK, WHITE);
        Paint_DrawString_custom(10, 90, status16, &Segoe12, BLACK, WHITE);
        EPD_2IN9_V2_Display(BlackImage);
    }
}

void displayEmpty(UBYTE * BlackImage) {
    char * status16 = "https://epaper.artsakh.ventures/new-data";
    const unsigned char* qrCodeArray = textToQR(status16);

    EPD_2IN9_V2_Init();
    Paint_Clear(0xff);
    Paint_DrawImage(qrCodeArray, 35, 16, 61, 61);
    Paint_DrawLine(82, 25, 82, 102, BLACK, DOT_PIXEL_1X1, LINE_STYLE_SOLID);
    Paint_DrawString_custom(87, 35, u"No data to display", &Segoe16Bold, BLACK, WHITE);
    Paint_DrawString_custom(87, 65, u"Scan QR to get started", &Segoe12, BLACK, WHITE);
    EPD_2IN9_V2_Display(BlackImage);
    delete[] qrCodeArray;
}
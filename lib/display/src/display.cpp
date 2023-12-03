#include <EPD.h>
#include <Paint.h>
#include <Wire.h>
#include <cstdint>
#include <Display.h>

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
    String email = preferences.getString("email", "");
    String address = preferences.getString("address", "");
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
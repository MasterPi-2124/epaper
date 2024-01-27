#include <EPD_2in9_V2.h>
#include <Paint.h>
#include <Wire.h>
#include <cstdint>
#include <Display.h>
#include <qrcode.h>

// size_t length;
// 
// char16_t *utf8ToUtf16(const char *utf8, size_t &outLength)
// {
//     size_t utf8_length = strlen(utf8);
//     size_t maximum_utf16_length = utf8_length * 2;
//     char16_t *utf16 = new char16_t[maximum_utf16_length];
//     size_t utf16_index = 0;
// 
//     while (*utf8)
//     {
//         unsigned char byte = *utf8++;
//         uint32_t codepoint;
// 
//         if (byte <= 0x7F)
//         { // Single-byte UTF-8 character (ASCII)
//             codepoint = byte;
//         }
//         else if (byte <= 0xBF)
//         {
//             // Continuation byte, handle error or skip
//             continue;
//         }
//         else if (byte <= 0xDF)
//         {
//             codepoint = byte & 0x1F;
//             codepoint <<= 6;
//             codepoint |= (*utf8++ & 0x3F);
//         }
//         else if (byte <= 0xEF)
//         {
//             codepoint = byte & 0x0F;
//             codepoint <<= 6;
//             codepoint |= (*utf8++ & 0x3F);
//             codepoint <<= 6;
//             codepoint |= (*utf8++ & 0x3F);
//         }
//         else
//         {
//             codepoint = byte & 0x07;
//             codepoint <<= 6;
//             codepoint |= (*utf8++ & 0x3F);
//             codepoint <<= 6;
//             codepoint |= (*utf8++ & 0x3F);
//             codepoint <<= 6;
//             codepoint |= (*utf8++ & 0x3F);
//         }
// 
//         if (codepoint <= 0xFFFF)
//         {
//             utf16[utf16_index++] = static_cast<char16_t>(codepoint);
//         }
//         else
//         {
//             codepoint -= 0x10000;
//             utf16[utf16_index++] = static_cast<char16_t>(0xD800 | (codepoint >> 10));
//             utf16[utf16_index++] = static_cast<char16_t>(0xDC00 | (codepoint & 0x03FF));
//         }
//     }
// 
//     // Allocate memory for the output
//     outLength = utf16_index;
//     char16_t *output = new char16_t[outLength + 1]; // +1 for null-terminator
//     memcpy(output, utf16, outLength * sizeof(char16_t));
//     // Copy data from vector to the new array
// 
//     output[outLength] = 0; // Null-terminate the string
//     delete[] utf16;
//     return output;
// }

unsigned int utf8_strlen(const char *s, const sFONT * font) {
    const char * p_text = s;
    int i, j, Num;

    unsigned int length = 0;

    /* Send the string character by character on EPD */
    while (*p_text != 0) {
        int unicodePoint = utf8ToUnicodePoint(p_text);
        const FT_MAP * data = NULL;
        if (unicodePoint >= 32 && unicodePoint <= 107) {                                // Threshold for Segment 1: ASCII range
            data = font->binarySearchInSegment(unicodePoint, font->ASCII_table, 76);
        } else if (unicodePoint <= 7852) {                                               // Threshold for Segment 2: ASCII range
            data = font->binarySearchInSegment(unicodePoint, font->vn_table, 76);
        } else if (unicodePoint <= 7929) {                                              // Threshold for Segment 3: ASCII range  
            data = font->binarySearchInSegment(unicodePoint, font->VN_table, 77);
        }
        if (data != NULL) {
            length += data->width + 2;
        }
        p_text += 1;
    }
    return length - 2;
}

UWORD alignSegoe(const char * text, const sFONT * font, uint8_t type, bool horizontal = true) {
    Serial.println("aligning for Segoe text");

    if (horizontal) {
        uint8_t length = utf8_strlen(text, font);
        Serial.print("Length: ");
        Serial.println(length);
        Serial.println((EPD_2IN9_V2_HEIGHT - length) * type / 100);
        return (uint16_t) (EPD_2IN9_V2_HEIGHT - length) * type / 100;
    } else {
        Serial.println((EPD_2IN9_V2_WIDTH - font->Height) * type / 100);
        return (uint16_t) (EPD_2IN9_V2_WIDTH - font->Height) * type / 100;
    }
}

UWORD alignMono(const char * text, const mFONT * font, uint8_t type, bool horizontal = true) {
    Serial.println("aligning for Monospace text");

    if (horizontal) {
        uint8_t length = strlen(text) * font->Width;
        Serial.print("Length: ");
        Serial.println(length);
        Serial.println((EPD_2IN9_V2_HEIGHT - length) * type / 100);
        return (uint16_t) (EPD_2IN9_V2_HEIGHT - length) * type / 100;
    } else {
        Serial.println((EPD_2IN9_V2_WIDTH - font->Height) * type / 100);
        return (uint16_t) (EPD_2IN9_V2_WIDTH - font->Height) * type / 100;
    }
}

const unsigned char * textToQR(const char* data) {
    uint8_t qrVersion = 11; // Adjust the QR version as needed
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
            }
        }
        Serial.print("\n");
    }
    Serial.print("\n");
    Serial.print("\n");
    return (const unsigned char *) epdArray;

}

bool compareStrings(const char *str1, const char *str2)
{
    while (*str1 && *str2 && *str1 == *str2)
    {
        str1++;
        str2++;
    }

    // Check if both strings are equal
    if (*str1 == '\0' && *str2 == '\0')
    {
        return true; // Strings are equal
    }
    else
    {
        return false; // Strings are not equal
    }
}

void displayWrite1(UBYTE * BlackImage) {

    String name = preferences.getString("name", "");
    String email = preferences.getString("input2", "");
    String address = preferences.getString("input3", "");
    String ft = preferences.getString("font", "");
    String schema = preferences.getString("schema", "");
    sFONT sFont;
    mFONT mFont;
    bool segoe;

    Serial.print(" -- name: ");
    Serial.println(name);
    Serial.print(" -- email: ");
    Serial.println(email);
    Serial.print(" -- addr: ");
    Serial.println(address);
    Serial.print(" -- font: ");
    Serial.println(ft);
    Serial.print(" -- schema: ");
    Serial.println(schema);

    if (ft == "Segoe11") {
        sFont = Segoe11;
        segoe = true;
    } else if (ft == "Segoe11Bold") {
        sFont = Segoe11Bold;
        segoe = true;
    } else if (ft == "Segoe16") {
        sFont = Segoe16;
        segoe = true;
    } else if (ft == "Segoe16Bold") {
        sFont = Segoe16Bold;
        segoe = true;
    } else if (ft == "Segoe20") {
        sFont = Segoe20;
        segoe = true;
    } else if (ft == "Font12") {
        mFont = Font12;
        segoe = false;
    } else if (ft == "Font16") {
        segoe = false;
        mFont = Font16;
    } else if (ft == "Font20") {
        mFont = Font20;
        segoe = false;
    }

    EPD_2IN9_V2_Init();
    Paint_Clear(0xff);

    if (compareStrings(schema.c_str(), "1")) {
        if (segoe) {
            UWORD xName = alignSegoe(name.c_str(), &sFont, 50);
            UWORD xEmail = alignSegoe(email.c_str(), &Segoe11, 50);
            UWORD xAddress = alignSegoe(address.c_str(), &Segoe11, 50);
            Paint_DrawString_segment(xName, 30, name.c_str(), &sFont, BLACK, WHITE);
            Paint_DrawString_segment(xEmail, 50, email.c_str(), &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(xAddress, 70, address.c_str(), &Segoe11, BLACK, WHITE);
        } else {
            UWORD xName = alignMono(name.c_str(), &mFont, 50);
            UWORD xEmail = alignMono(email.c_str(), &Font12, 50);
            UWORD xAddress = alignMono(address.c_str(), &Font12, 50);
            Paint_DrawString(xName, 30, name.c_str(), &mFont, BLACK, WHITE);
            Paint_DrawString(xEmail, 50, email.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(xAddress, 70, address.c_str(), &Font12, BLACK, WHITE);
        }
    } else if (compareStrings(schema.c_str(), "2")) {
        if (segoe) {
            Paint_DrawString_segment(10, 30, name.c_str(), &sFont, BLACK, WHITE);
            Paint_DrawString_segment(10, 50, "Email: ", &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(40, 50, email.c_str(), &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(10, 70, "Address: ", &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(50, 70, address.c_str(), &Segoe11, BLACK, WHITE);
        } else {
            Paint_DrawString(10, 30, name.c_str(), &mFont, BLACK, WHITE);
            Paint_DrawString(10, 50, "Email: ", &Font12, BLACK, WHITE);
            Paint_DrawString(40, 50, email.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(10, 70, "Address: ", &Font12, BLACK, WHITE);
            Paint_DrawString(50, 70, address.c_str(), &Font12, BLACK, WHITE);
        }
    }
    EPD_2IN9_V2_Display(BlackImage);
}

void displayWrite2(UBYTE * BlackImage) {
    String name = preferences.getString("name", "");
    String email = preferences.getString("input2", "");
    String studentID = preferences.getString("input3", "");
    String _class = preferences.getString("input4", "");
    String ft = preferences.getString("font", "");
    String schema = preferences.getString("schema", "");
    sFONT sFont;
    bool segoe;
    mFONT mFont;

    Serial.print(" -- name: ");
    Serial.println(name);
    Serial.print(" -- email: ");
    Serial.println(email);
    Serial.print(" -- studentID: ");
    Serial.println(studentID);
    Serial.print(" -- class: ");
    Serial.println(_class);
    Serial.print(" -- font: ");
    Serial.println(ft);
    Serial.print(" -- schema: ");
    Serial.println(schema);

    if (ft == "Segoe11") {
        sFont = Segoe11;
        segoe = true;
    } else if (ft == "Segoe11Bold") {
        sFont = Segoe11Bold;
        segoe = true;
    } else if (ft == "Segoe16") {
        sFont = Segoe16;
        segoe = true;
    } else if (ft == "Segoe16Bold") {
        sFont = Segoe16Bold;
        segoe = true;
    } else if (ft == "Segoe20") {
        sFont = Segoe20;
        segoe = true;
    } else if (ft == "Font12") {
        mFont = Font12;
        segoe = false;
    } else if (ft == "Font16") {
        segoe = false;
        mFont = Font16;
    } else if (ft == "Font20") {
        mFont = Font20;
        segoe = false;
    }
    

    EPD_2IN9_V2_Init();
    Paint_Clear(0xff);

    if (compareStrings(schema.c_str(), "1")) {
        if (segoe) {
            UWORD xName = alignSegoe(name.c_str(), &sFont, 50);
            UWORD xClass = alignSegoe(_class.c_str(), &Segoe11, 50);
            UWORD xEmail = alignSegoe(email.c_str(), &Segoe11, 50);
            UWORD xID = alignSegoe(studentID.c_str(), &Segoe11, 50);
            Paint_DrawString_segment(xName, 20, name.c_str(), &sFont, BLACK, WHITE);
            Paint_DrawString_segment(xClass, 50, _class.c_str(), &Segoe11Bold, BLACK, WHITE);
            Paint_DrawString_segment(xID, 70, studentID.c_str(), &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(xEmail, 90, email.c_str(), &Segoe11, BLACK, WHITE);
        } else {
            UWORD xName = alignMono(name.c_str(), &mFont, 50);
            UWORD xClass = alignMono(_class.c_str(), &Font12, 50);
            UWORD xEmail = alignMono(email.c_str(), &Font12, 50);
            UWORD xID = alignMono(studentID.c_str(), &Font12, 50);
            Paint_DrawString(xName, 20, name.c_str(), &mFont, BLACK, WHITE);
            Paint_DrawString(xClass, 50, _class.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(xID, 70, studentID.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(xEmail, 90, email.c_str(), &Font12, BLACK, WHITE);
        }
    } else if (compareStrings(schema.c_str(), "2")) {
        if (segoe) {
            Paint_DrawString_segment(10, 20, name.c_str(), &sFont, BLACK, WHITE);
            Paint_DrawString_segment(10, 50, _class.c_str(), &Segoe11Bold, BLACK, WHITE);
            Paint_DrawString_segment(10, 70, studentID.c_str(), &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(10, 90, email.c_str(), &Segoe11, BLACK, WHITE);        
        } else {
            Paint_DrawString(10, 20, name.c_str(), &mFont, BLACK, WHITE);
            Paint_DrawString(10, 50, _class.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(10, 70, studentID.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(10, 90, email.c_str(), &Font12, BLACK, WHITE);
        }
    }
    EPD_2IN9_V2_Display(BlackImage);
}

void displayWrite3(UBYTE * BlackImage) {
    String name = preferences.getString("name", "");
    String email = preferences.getString("input2", "");
    String employeeID = preferences.getString("input3", "");
    String department = preferences.getString("input4", "");
    String ft = preferences.getString("font", "");
    String schema = preferences.getString("schema", "");
    sFONT sFont;
    mFONT mFont;
    bool segoe;

    Serial.print(" -- name: ");
    Serial.println(name);
    Serial.print(" -- email: ");
    Serial.println(email);
    Serial.print(" -- employeeID: ");
    Serial.println(employeeID);
    Serial.print(" -- department: ");
    Serial.println(department);
    Serial.print(" -- font: ");
    Serial.println(ft);
    Serial.print(" -- schema: ");
    Serial.println(schema);

    if (ft == "Segoe11") {
        sFont = Segoe11;
        segoe = true;
    } else if (ft == "Segoe11Bold") {
        sFont = Segoe11Bold;
        segoe = true;
    } else if (ft == "Segoe16") {
        sFont = Segoe16;
        segoe = true;
    } else if (ft == "Segoe16Bold") {
        sFont = Segoe16Bold;
        segoe = true;
    } else if (ft == "Segoe20") {
        sFont = Segoe20;
        segoe = true;
    } else if (ft == "Font12") {
        mFont = Font12;
        segoe = false;
    } else if (ft == "Font16") {
        segoe = false;
        mFont = Font16;
    } else if (ft == "Font20") {
        mFont = Font20;
        segoe = false;
    }

    EPD_2IN9_V2_Init();
    Paint_Clear(0xff);
    if (compareStrings(schema.c_str(), "1")) {
        if (segoe) {
            UWORD xName = alignSegoe(name.c_str(), &sFont, 0);
            UWORD xEmail = alignSegoe(email.c_str(), &Segoe11, 50);
            UWORD xID = alignSegoe(employeeID.c_str(), &Segoe11, 100);
            UWORD xDepartment = alignSegoe(department.c_str(), &Segoe11, 25);
            Paint_DrawString_segment(xName, 30, name.c_str(), &sFont, BLACK, WHITE);
            Paint_DrawString_segment(xEmail, 50, email.c_str(), &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(xID, 70, employeeID.c_str(), &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(xDepartment, 90, department.c_str(), &Segoe11, BLACK, WHITE);
        } else {
            UWORD xName = alignMono(name.c_str(), &mFont, 0);
            UWORD xEmail = alignMono(email.c_str(), &Font12, 50);
            UWORD xID = alignMono(employeeID.c_str(), &Font12, 100);
            UWORD xDepartment = alignMono(department.c_str(), &Font12, 25);
            Paint_DrawString(xName, 30, name.c_str(), &mFont, BLACK, WHITE);
            Paint_DrawString(xEmail, 50, email.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(xID, 70, employeeID.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(xDepartment, 70, department.c_str(), &Font12, BLACK, WHITE);
        }

    } else if (compareStrings(schema.c_str(), "2")) {
        if (segoe) {
            Paint_DrawString_segment(10, 30, name.c_str(), &sFont, BLACK, WHITE);
            Paint_DrawString_segment(10, 50, "Email: ", &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(40, 50, email.c_str(), &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(10, 70, "Address: ", &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(50, 70, employeeID.c_str(), &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(10, 90, department.c_str(), &Segoe11, BLACK, WHITE);
        } else {
            Paint_DrawString(10, 30, name.c_str(), &mFont, BLACK, WHITE);
            Paint_DrawString(10, 50, "Email: ", &Font12, BLACK, WHITE);
            Paint_DrawString(40, 50, email.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(10, 70, "Employee ID: ", &Font12, BLACK, WHITE);
            Paint_DrawString(50, 70, employeeID.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(10, 90, department.c_str(), &Font12, BLACK, WHITE);
        }
    }
    EPD_2IN9_V2_Display(BlackImage);
}

void displayWrite4(UBYTE * BlackImage) {
    String name = preferences.getString("name", "");
    String category = preferences.getString("input2", "");
    String price = preferences.getString("input3", "");
    String ft = preferences.getString("font", "");
    String schema = preferences.getString("schema", "");
    sFONT sFont;
    mFONT mFont;
    bool segoe;

    Serial.print(" -- name: ");
    Serial.println(name);
    Serial.print(" -- category: ");
    Serial.println(category);
    Serial.print(" -- price: ");
    Serial.println(price);
    Serial.print(" -- font: ");
    Serial.println(ft);
    Serial.print(" -- schema: ");
    Serial.println(schema);

    if (ft == "Segoe11") {
        sFont = Segoe11;
        segoe = true;
    } else if (ft == "Segoe11Bold") {
        sFont = Segoe11Bold;
        segoe = true;
    } else if (ft == "Segoe16") {
        sFont = Segoe16;
        segoe = true;
    } else if (ft == "Segoe16Bold") {
        sFont = Segoe16Bold;
        segoe = true;
    } else if (ft == "Segoe20") {
        sFont = Segoe20;
        segoe = true;
    } else if (ft == "Font12") {
        mFont = Font12;
        segoe = false;
    } else if (ft == "Font16") {
        segoe = false;
        mFont = Font16;
    } else if (ft == "Font20") {
        mFont = Font20;
        segoe = false;
    }

    EPD_2IN9_V2_Init();
    Paint_Clear(0xff);
    if (compareStrings(schema.c_str(), "1")) {
        if (segoe) {
            UWORD xName = alignSegoe(name.c_str(), &sFont, 50);
            UWORD xPrice = alignSegoe(price.c_str(), &Segoe11, 50);
            UWORD xCategory = alignSegoe(category.c_str(), &Segoe11, 50);
            Paint_DrawString_segment(xName, 50, name.c_str(), &sFont, BLACK, WHITE);
            Paint_DrawString_segment(xPrice, 90, price.c_str(), &Segoe16, BLACK, WHITE);
            Paint_DrawString_segment(xCategory, 20, category.c_str(), &Segoe11, BLACK, WHITE);
        } else {
            UWORD xName = alignMono(name.c_str(), &mFont, 50);
            UWORD xPrice = alignMono(price.c_str(), &Font12, 50);
            UWORD xCategory = alignMono(category.c_str(), &Font12, 50);
            Paint_DrawString(xName, 50, name.c_str(), &mFont, BLACK, WHITE);
            Paint_DrawString(xPrice, 90, price.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(xCategory, 20, category.c_str(), &Font12, BLACK, WHITE);
        }
    } else if (compareStrings(schema.c_str(), "2")) {
        if (segoe) {
            Paint_DrawString_segment(10, 50, name.c_str(), &sFont, BLACK, WHITE);
            Paint_DrawString_segment(10, 90, price.c_str(), &Segoe16, BLACK, WHITE);
            Paint_DrawString_segment(10, 20, category.c_str(), &Segoe11, BLACK, WHITE);
        } else {
            Paint_DrawString(10, 50, name.c_str(), &mFont, BLACK, WHITE);
            Paint_DrawString(10, 90, price.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(10, 20, category.c_str(), &Font12, BLACK, WHITE);
        }
    }
    EPD_2IN9_V2_Display(BlackImage);
}

void displayWrite5(UBYTE * BlackImage) {
    String name = preferences.getString("name", "");
    String purpose = preferences.getString("input2", "");
    String manager = preferences.getString("input3", "");
    String status = preferences.getString("input4", "");
    String ft = preferences.getString("font", "");
    String schema = preferences.getString("schema", "");
    sFONT sFont;
    mFONT mFont;
    bool segoe;

    Serial.print(" -- name: ");
    Serial.println(name);
    Serial.print(" -- purpose: ");
    Serial.println(purpose);
    Serial.print(" -- manager: ");
    Serial.println(manager);
    Serial.print(" -- status: ");
    Serial.println(status);
    Serial.print(" -- font: ");
    Serial.println(ft);
    Serial.print(" -- schema: ");
    Serial.println(schema);

    if (ft == "Segoe11") {
        sFont = Segoe11;
        segoe = true;
    } else if (ft == "Segoe11Bold") {
        sFont = Segoe11Bold;
        segoe = true;
    } else if (ft == "Segoe16") {
        sFont = Segoe16;
        segoe = true;
    } else if (ft == "Segoe16Bold") {
        sFont = Segoe16Bold;
        segoe = true;
    } else if (ft == "Segoe20") {
        sFont = Segoe20;
        segoe = true;
    } else if (ft == "Font12") {
        mFont = Font12;
        segoe = false;
    } else if (ft == "Font16") {
        segoe = false;
        mFont = Font16;
    } else if (ft == "Font20") {
        mFont = Font20;
        segoe = false;
    }

    EPD_2IN9_V2_Init();
    Paint_Clear(0xff);
    if (compareStrings(schema.c_str(), "1")) {
        if (segoe) {
            UWORD xName = alignSegoe(name.c_str(), &sFont, 50);
            UWORD xPurpose = alignSegoe(purpose.c_str(), &Segoe11, 50);
            UWORD xManager = alignSegoe(manager.c_str(), &Segoe11, 50);
            UWORD xStatus = alignSegoe(status.c_str(), &Segoe11, 50);
            Paint_DrawString_segment(xName, 30, name.c_str(), &sFont, BLACK, WHITE);
            Paint_DrawString_segment(xPurpose, 50, purpose.c_str(), &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(xManager, 70, manager.c_str(), &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(xStatus, 90, status.c_str(), &Segoe11, BLACK, WHITE);
        } else {
            UWORD xName = alignMono(name.c_str(), &mFont, 50);
            UWORD xPurpose = alignMono(purpose.c_str(), &Font12, 50);
            UWORD xManager = alignMono(manager.c_str(), &Font12, 50);
            UWORD xStatus = alignMono(status.c_str(), &Font12, 50);
            Paint_DrawString(xName, 30, name.c_str(), &mFont, BLACK, WHITE);
            Paint_DrawString(xPurpose, 50, purpose.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(xManager, 70, manager.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(xStatus, 90, status.c_str(), &Font12, BLACK, WHITE);
        }
    } else if (compareStrings(schema.c_str(), "2")) {
        if (segoe) {
            Paint_DrawString_segment(10, 30, name.c_str(), &sFont, BLACK, WHITE);
            Paint_DrawString_segment(10, 50, purpose.c_str(), &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(10, 70, manager.c_str(), &Segoe11, BLACK, WHITE);
            Paint_DrawString_segment(10, 90, status.c_str(), &Segoe11, BLACK, WHITE);
        } else {
            Paint_DrawString(10, 30, name.c_str(), &mFont, BLACK, WHITE);
            Paint_DrawString(10, 50, purpose.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(10, 70, manager.c_str(), &Font12, BLACK, WHITE);
            Paint_DrawString(10, 90, status.c_str(), &Font12, BLACK, WHITE);
        }
    }
    EPD_2IN9_V2_Display(BlackImage);
}

void displayEmpty(UBYTE * BlackImage) {
    const unsigned char* qrCodeArray = textToQR("https://epaper.artsakh.ventures/new-data");

    EPD_2IN9_V2_Init();
    Paint_Clear(0xff);
    Paint_DrawImage(qrCodeArray, 35, 16, 61, 61);
    Paint_DrawLine(82, 25, 82, 102, BLACK, DOT_PIXEL_1X1, LINE_STYLE_SOLID);
    Paint_DrawString_segment(87, 35, "No data to display", &Segoe16Bold, BLACK, WHITE);
    Paint_DrawString_segment(87, 65, "Scan QR to get started", &Segoe11, BLACK, WHITE);
    EPD_2IN9_V2_Display(BlackImage);
    delete[] qrCodeArray;
}
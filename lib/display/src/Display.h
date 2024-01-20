#ifndef __DISPLAY_H
#define __DISPLAY_H

#include <Preferences.h>
#include <DEV_Config.h>

extern Preferences preferences;

// char16_t * utf8ToUtf16(const char *utf8, size_t &outLength);
bool compareStrings(const char *str1, const char *str2);

void displayWrite1(UBYTE * BlackImage);
void displayWrite2(UBYTE * BlackImage);
void displayWrite3(UBYTE * BlackImage);
void displayWrite4(UBYTE * BlackImage);
void displayWrite5(UBYTE * BlackImage);
void displayEmpty(UBYTE * BlackImage);
  
#endif /* __DISPLAY_H */
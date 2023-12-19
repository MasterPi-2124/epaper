#ifndef __FONTS_H
#define __FONTS_H


/* Max size of bitmap will based on a font24 (17x24) */
#define MAX_HEIGHT_FONT         41
#define MAX_WIDTH_FONT          32

#ifdef __cplusplus
 extern "C" {
#endif

/* Includes ------------------------------------------------------------------*/
#include <cwchar>
#include <stdint.h>

// #include <avr/pgmspace.h>
//ASCII
typedef struct _tFont
{    
  const uint8_t *table;
  uint16_t Width;
  uint16_t Height;
  
} mFont;  // monospace fonts

//GB2312
typedef struct 
{
  char16_t * index;                                     // index character, utf-16
  uint8_t width;                                        // dynamic width
  const char matrix[MAX_HEIGHT_FONT*MAX_WIDTH_FONT/8];  // maximum index table
} FT_IDX;

typedef struct
{    
  const FT_IDX *table;
  uint16_t size;
  uint16_t Height;
} cFONT;   // custom Font

extern mFont Font8;
extern mFont Font12;
extern mFont Font16;
extern mFont Font20;
extern mFont Font24;

// extern cFONT Segoe8;
extern cFONT Segoe12;
extern cFONT Segoe16;

extern cFONT Segoe12Bold;
extern cFONT Segoe16Bold;

#ifdef __cplusplus
}
#endif
  
#endif /* __FONTS_H */
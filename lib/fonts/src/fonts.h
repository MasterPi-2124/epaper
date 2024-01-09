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
  const char matrix[MAX_HEIGHT_FONT*MAX_WIDTH_FONT/8];  // bytes-array
} FT_IDX;

typedef struct
{    
  const FT_IDX *table;
  uint16_t size;
  uint8_t Height;
} cFONT;   // custom Font

typedef struct 
{
  int chr; // index character, unicode point
  uint8_t width;  // dynamic width, this also used for determine the length of bitmap array
  int index;  // start index at byte map table
} FT_MAP;

typedef struct
{    
  const FT_MAP *ASCII_table; // segmentSize = 95 characters from 32 to 126
  const FT_MAP *vn_table;    // segmentSize = 
  const FT_MAP *VN_table;    // segmentSize = 
  uint8_t Height;

  const FT_MAP * binarySearchInSegment(int unicodePoint, const FT_MAP* segment, size_t segmentSize) {
    int low = 0;
    int high = segmentSize - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (segment[mid].chr < unicodePoint) {
            low = mid + 1;
        } else if (segment[mid].chr > unicodePoint) {
            high = mid - 1;
        } else {
            return &segment[mid]; // Found
        }
    }
    return NULL; // Not found
  }
  const char *table;

} cFONT_SEGMENT;   // custom Font with Segment Management for better performance and resource saving

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

extern cFONT_SEGMENT Segoe12_Segment;

#ifdef __cplusplus
}
#endif
  
#endif /* __FONTS_H */
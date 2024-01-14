#include <HTTPClient.h>
#include <Update.h>

void performOTAUpdate(const char * url) {
  Serial.print("Sending OTA request to: ");
  Serial.println(url);

  HTTPClient http;
  http.begin(url);
  int httpCode = http.GET();
  if (httpCode == 302) {
    // Redirected
    String newUrl = http.getLocation(); // Get the URL from the Location header
    http.end(); // Close the first connection

    // Follow the redirect
    http.begin(newUrl);
    httpCode = http.GET();
  }

  if (httpCode == 200) {
    WiFiClient * stream = http.getStreamPtr();
    size_t contentLength = http.getSize();

    bool canBegin = Update.begin(contentLength);
    if (canBegin) {
      size_t written = Update.writeStream(*stream);
      if (written == contentLength) {
        Serial.println("Written : " + String(written) + " successfully");
      } else {
        Serial.println("Written only : " + String(written) + "/" + String(contentLength) + ". Retry?");
        // Repeat the process on failure
      }
      if (Update.end()) {
        if (Update.isFinished()) {
          Serial.println("Update successfully completed. Rebooting...");
          ESP.restart();
        } else {
          Serial.println("Update not finished? Something went wrong!");
        }
      } else {
        Serial.println("Error Occurred. Error #: " + String(Update.getError()));
      }
    } else {
      Serial.println("Not enough space to begin OTA");
    }
  } else {
    Serial.println("Error on HTTP request" + httpCode);
  }
  http.end();
}
#include <HTTPClient.h>
#include <Update.h>
#include <MQTT.h>
#include <WiFiClientSecure.h>

WiFiClientSecure httpsClient;

void setupHTTPSClient() {
  // For maximum security, set the correct Root CA certificate

}

void performOTAUpdate(char * url) {
    // const char* rootCACertificate = CA;

  // Load root CA certificate
//   httpsClient.setCACert(rootCACertificate);

  // Alternatively, for testing only, you can disable SSL certificate verification
  httpsClient.setInsecure();




  HTTPClient http;
  http.begin(httpsClient, url);
  int httpCode = http.GET();
  if (httpCode == 302) {
    // Redirected
    String newUrl = http.getLocation(); // Get the URL from the Location header
    http.end(); // Close the first connection

    // Follow the redirect
    http.begin(httpsClient, newUrl);
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
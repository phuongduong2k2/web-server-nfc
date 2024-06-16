
#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <ArduinoJson.h>

const char* ssid = "Phuongduong";
const char* password = "phuongdepzai";

JsonDocument doc;

String token = "6400072361:AAEdQhLn_Yfc7KNrQFzoNj6W68BX7f9i9mo";
String chat_id = "5233750196";
String method = "/sendMessage";
String serverName = "https://api.telegram.org/bot" + token + method + "?chat_id=" + chat_id;

String API = "http://192.168.179.173:8000/api/users";

#define SS_PIN 15  //D8
#define RST_PIN 2  //D4
#define LED_PIN 4
#define BUZZER_PIN 5
MFRC522 mfrc522(SS_PIN, RST_PIN);

// ESP8266WebServer server(80);

int total_card;
String card_num;

unsigned long lastTime = 0;
unsigned long timerDelay = 5000;

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  SPI.begin();
  mfrc522.PCD_Init();
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  Serial.println("Setup System Done!");
}
void failedSound() {
  int count = 0;
  while (count <= 2) {
    count++;
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
    delay(100);
  }
}
void loop() {
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial() || WiFi.status() != WL_CONNECTED) {
    return;
  }
  digitalWrite(BUZZER_PIN, HIGH);
  Serial.println(card_num);
  delay(200);
  digitalWrite(BUZZER_PIN, LOW);
  String response = requestToWebServer("verify", "");
  DeserializationError error = deserializeJson(doc, response);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    failedSound();
    return;
  }

  String nameUser = doc["data"]["0"]["name"];
  if (nameUser == "null") {
    response = requestToWebServer("getReq", "");
    DeserializationError error = deserializeJson(doc, response);
    String id = doc["data"]["0"]["_id"];
    Serial.println(id);
    if (id != "null") {
      response = requestToWebServer("update", id);
    } else {
      digitalWrite(LED_PIN, LOW);
      char mess[] = "failed";
      sendMessage(mess);
      failedSound();
    }
    return;
  }
  Serial.println(nameUser);
  digitalWrite(LED_PIN, HIGH);
  char mess[] = "success";
  sendMessage(mess);
}
void sendMessage(char* message) {
  if (WiFi.status() == WL_CONNECTED) {

    std::unique_ptr<BearSSL::WiFiClientSecure> client(new BearSSL::WiFiClientSecure);
    client->setInsecure();

    WiFiClient wifiClient;
    HTTPClient http;
    Serial.println("Sending...");
    int i = 0;
    String serverPath = serverName + "&text=";
    for (i; message[i] != '\0'; i++) {
      serverPath += *(message + i);
    }

    Serial.println(serverPath);
    http.begin(*client, serverPath);
    int httpResponseCode = http.POST();
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
}
String requestToWebServer(const char* type, String id) {
  String payload = "";
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient wifiClient;
    HTTPClient http;
    Serial.println("Sending...");

    String serverPath = "";


    int httpResponseCode = 0;

    Serial.println(type);
    if (type == "verify") {
      serverPath = API + "/verify/" + getCardNumber();
      http.begin(wifiClient, serverPath);
      httpResponseCode = http.GET();
    }
    if (type == "getReq") {
      serverPath = API + "/verify";
      http.begin(wifiClient, serverPath);
      httpResponseCode = http.GET();
    }
    if (type == "update") {
      serverPath = API + "/" + id + "?nfcId=" + getCardNumber();
      http.begin(wifiClient, serverPath);
      httpResponseCode = http.PATCH({});
    }
    Serial.println(serverPath);
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      payload = http.getString();
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
  return payload;
}
String getCardNumber() {
  String UID = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    UID += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    UID += String(mfrc522.uid.uidByte[i], HEX);
  }
  UID.toUpperCase();
  return UID;
}

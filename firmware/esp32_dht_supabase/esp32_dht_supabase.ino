/**
 * ESP32 + DHT22 (AM2302) → Supabase PostgREST
 * Cableado: DATA → GPIO23, VCC → 3.3V, GND → GND
 *
 * Dependencias (Arduino Library Manager):
 *   - "DHT sensor library" (Adafruit)
 *   - "Adafruit Unified Sensor"
 *   (No requiere ArduinoJson: el cuerpo JSON se arma en firmware.)
 *
 * Cree `secrets.h` a partir de `secrets.example.h`.
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <DHT.h>

#include "secrets.h"

#ifndef WIFI_SSID
#error "Defina WIFI_SSID en secrets.h"
#endif

static constexpr int kDhtPin = 23;
static constexpr int kReadIntervalMs = 2000;

static DHT dht(kDhtPin, DHT22);
static WiFiClientSecure secureClient;

static String supabaseRestUrl() {
  String base = SUPABASE_URL;
  if (base.endsWith("/")) base.remove(base.length() - 1);
  return base + "/rest/v1/sensores";
}

static bool connectWifi() {
  Serial.printf("[WiFi] Conectando a %s ...\n", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  uint32_t start = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - start > 20000) {
      Serial.println("[WiFi] ERROR: timeout al conectar.");
      return false;
    }
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.printf("[WiFi] Conectado. IP: %s\n", WiFi.localIP().toString().c_str());
  return true;
}

static bool postReading(float temperatureC, float humidityPct) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] ERROR: WiFi desconectado.");
    return false;
  }

  HTTPClient http;
  secureClient.setInsecure(); // Producción: fijar certificado CA o bundle

  String url = supabaseRestUrl();
  Serial.printf("[HTTP] POST %s\n", url.c_str());

  if (!http.begin(secureClient, url)) {
    Serial.println("[HTTP] ERROR: begin() falló.");
    return false;
  }

  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", SUPABASE_ANON_KEY);
  http.addHeader("Authorization", String("Bearer ") + SUPABASE_ANON_KEY);
  http.addHeader("Prefer", "return=minimal");

  char body[96];
  snprintf(body, sizeof(body), "{\"temperatura\":%.2f,\"humedad\":%.2f}", temperatureC, humidityPct);
  Serial.printf("[HTTP] Body: %s\n", body);

  int code = http.POST(body);
  if (code < 0) {
    Serial.printf("[HTTP] ERROR: envío fallido: %s\n", http.errorToString(code).c_str());
    http.end();
    return false;
  }

  String resp = http.getString();
  Serial.printf("[HTTP] Código: %d\n", code);
  if (resp.length() > 0) {
    Serial.printf("[HTTP] Respuesta: %s\n", resp.c_str());
  }

  http.end();

  if (code == 201 || code == 200) {
    Serial.println("[HTTP] OK: lectura insertada.");
    return true;
  }

  Serial.println("[HTTP] ERROR: código inesperado.");
  return false;
}

void setup() {
  Serial.begin(115200);
  delay(800);

  Serial.println();
  Serial.println("=== ESP32 DHT22 → Supabase ===");

  dht.begin();

  if (!connectWifi()) {
    Serial.println("[Sistema] Reiniciando en 10 s...");
    delay(10000);
    ESP.restart();
  }
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature(); // °C

  if (isnan(h) || isnan(t)) {
    Serial.println("[DHT] ERROR: lectura inválida (NaN). Reintentando...");
    delay(2000);
    return;
  }

  Serial.printf("[DHT] T=%.2f °C  H=%.2f %%\n", t, h);

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Reconectando...");
    WiFi.reconnect();
    delay(3000);
  } else {
    postReading(t, h);
  }

  delay(kReadIntervalMs);
}

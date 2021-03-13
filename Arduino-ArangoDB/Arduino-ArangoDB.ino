#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

#include <WiFiClient.h>
// ***************************************CONEXION WIFI*********************************
const char* ssid = "";
const char* password = "";
HTTPClient http;
//****************************************VARIABLES DE CONEXION AL SERVIDOR*****************************************

String server=""; // URL A LA API

const int pulsadorPin = 4;
const int pulsadorPin2 = 5;
const int ledPin = 2;
String estado = "";
int val=0;
int val2=0;
void setup() {
  // Activamos los pines de entrada y salida
    pinMode(pulsadorPin, INPUT);
    pinMode(ledPin, OUTPUT);
    Serial.begin(9600);
    Serial.print("Conectando con ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi conectado");     
  Serial.println(WiFi.localIP());
}

void loop(){
  val = digitalRead(pulsadorPin);
  val2 = digitalRead(pulsadorPin2);
  
  if(val == HIGH){
    digitalWrite(ledPin, HIGH);
    estado = "Derecha";
    Serial.println(estado);
    envioDatos();
    delay(2500);
    }
  if(val2 == HIGH){
    digitalWrite(ledPin, HIGH);
    estado = "Izquierda";
    Serial.println(estado);
    envioDatos();
    delay(2500);
    }
   if(val == LOW && val2 == LOW){
      digitalWrite(ledPin, LOW);
      estado = "Apagado";
      Serial.println(estado);
      envioDatos();
      delay(2500);
      } 
}


void envioDatos(){
  char json[256];
  StaticJsonBuffer<500> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["estado"] = estado;
  root.printTo(json, sizeof(json));
  http.addHeader("Content-Type", "application/json");
  Serial.println("\n");
  Serial.println(json);
  http.begin(server);
  http.POST(json);   
  http.writeToStream(&Serial);
  }

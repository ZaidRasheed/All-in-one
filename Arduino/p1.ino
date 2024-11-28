#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const int echoPin = 35; 
const int trigPin = 14;  
const int greenLEDPin = 21; 
const int yellowLEDPin = 13;
const int redLEDPin = 12;


const int buttonPin = 32;

// bin depth in cm
const int binDepth=100;

const char* ssid = "Fadi";
const char* password = "0795842434";
const char* serverName = "https://app-p5uzyn3l6q-uc.a.run.app/";

int count=0;
int avg[10] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

// for counting the flashing yellow led when bin is disabled
int yellowCounter=0;

const char* deviceId = "H 65";
bool shouldUpdate = true;
bool deleted=false;


void setup() {
  // Initialize serial communication for debugging
  Serial.begin(115200);

  // Initialize the LED pins as outputs
  pinMode(greenLEDPin, OUTPUT);
  pinMode(yellowLEDPin, OUTPUT);
  pinMode(redLEDPin, OUTPUT);

  // Initialize the ultrasonic sensor pins
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // Initialize the buton pin
  pinMode(buttonPin, INPUT_PULLUP);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");

}

void handleButtonPress() {

  // when buttin is pressed the lights turn off and then the yellow lights up for 3 seconds to indicate that it registered
  // the delays ensure a single button press
  Serial.println("Pressed");
  digitalWrite(greenLEDPin, LOW);
  digitalWrite(yellowLEDPin, LOW); 
  digitalWrite(redLEDPin, LOW);
  delay(1000);
  digitalWrite(yellowLEDPin, HIGH);
  delay(3000);
  digitalWrite(yellowLEDPin, LOW);

  HTTPClient http;
  bool httpBeginSuccess = http.begin(serverName);
  if (!httpBeginSuccess) {
    Serial.println("Failed to initialize HTTP connection");
    return;
  }
  struct Header {
    const char* name;
    const char* value;
  } headers[] = {
    {"Content-Type", "application/json"},
    {"Accept", "application/json"},
    {"Access-Control-Allow-Origin", "*"}
  };

  int total=0;

  for(int i=0;i<10;i++){
    total+=avg[i];
  }

  int dis=total/10;

  String level = "empty";

  if(dis<= 0.2 *binDepth){
    level="full";
  }else if(dis < 0.8 *binDepth){
    level="half";
  }else{
    level="empty";
  }

  StaticJsonDocument<250> doc;
  doc["id"] = deviceId;
  doc["enabled"] = !shouldUpdate;
  doc["level"] = level;

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  Serial.print("JSON Payload: ");
  Serial.println(jsonPayload);  

  for (Header header : headers) {
      http.addHeader(header.name, header.value);
  }
  int httpResponseCode = http.PATCH(jsonPayload);
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    String response = http.getString();
    Serial.print("Response from server: ");
    Serial.println(response);

  } else {
    Serial.print("Error on sending PUT request: ");
    Serial.println(http.errorToString(httpResponseCode));
  }
  
  http.end();
}

int dsitance(){
  long duration;
  int distance;

  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);

  // Calculating the distance
  distance = duration * 0.0343 / 2;
  return distance;
}

void check(){
  HTTPClient http;
  bool httpBeginSuccess = http.begin(serverName);
  if (!httpBeginSuccess) {
    Serial.println("Failed to initialize HTTP connection");
    return;
  }

  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    // Serial.print("GET Response code: ");
    // Serial.println(httpResponseCode);

    String response = http.getString();
    // Serial.print("Response from server: ");
    // Serial.println(response);

    // Parse the JSON array
    DynamicJsonDocument doc(1024); // Adjust size as needed
    DeserializationError error = deserializeJson(doc, response);
    if (error) {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
      http.end();
      return;
    }
    if (!doc.is<JsonArray>()) {
      Serial.println("Expected a JSON array");
      http.end();
      return;
    }
    JsonArray dataArray = doc.as<JsonArray>();
    bool found=false;
    for (JsonObject obj : dataArray) {
      const char* id = obj["id"];
      bool enabled = obj["enabled"];

      if (strcmp(id, deviceId) == 0) {
        // Serial.print("Found matching ID: ");
        // Serial.println(id);
        found=true;
        Serial.print("Enabled: ");
        Serial.println(enabled ? "true" : "false");

        if (enabled) {
          shouldUpdate = true;
        }
        else{
          shouldUpdate=false;
        }
        break; // Exit the loop once found
      }
    }
    if(!found || !shouldUpdate){
      count=0;
      digitalWrite(greenLEDPin, LOW);  
      digitalWrite(yellowLEDPin, LOW); 
      digitalWrite(redLEDPin, LOW);
    }
    if(!found){
      deleted=true;
      Serial.println("No Bin was found with this ID, it could have been deleted.");
      http.end();
      return;
    }
    else{
      deleted=false;
    }
    if (!shouldUpdate){
      Serial.println("Bin is not enabled. Skipping PUT request.");
      http.end();
      return;
    }
  }
}

void updateLevel(){
  // calculate average
  int total=0;

  for(int i=0;i<10;i++){
    total+=avg[i];
  }

  int dis=total/10;

  // Define headers in an array of structs
  struct Header {
    const char* name;
    const char* value;
  } headers[] = {
    {"Content-Type", "application/json"},
    {"Accept", "application/json"},
    {"Access-Control-Allow-Origin", "*"}
  };
  
  // Variables for JSON payload
  String level = "empty";

  if(dis <= 0.2 * binDepth){
    level="full";
  }else if(dis < 0.8 * binDepth){
    level="half";
  }else{
    level="empty";
  }
  HTTPClient http;

  bool httpBeginSuccess = http.begin(serverName);
  if (!httpBeginSuccess) {
    Serial.println("Failed to initialize HTTP connection");
    return;
  }
  StaticJsonDocument<250> doc;
  doc["id"] = deviceId;
  doc["level"] = level;
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);

  // Serial.print("JSON Payload: ");
  // Serial.println(jsonPayload);  

  for (Header header : headers) {
      http.addHeader(header.name, header.value);
  }

  int httpResponseCode = http.PUT(jsonPayload);
  if (httpResponseCode > 0) {
    // Serial.print("HTTP Response code: ");
    // Serial.println(httpResponseCode);

    String response = http.getString();
    // Serial.print("Response from server: ");
    // Serial.println(response);

  } else {
    Serial.print("Error on sending PUT request: ");
    Serial.println(http.errorToString(httpResponseCode));
  }

    // End the HTTP connection
    http.end();

}


void loop() {

  if(digitalRead(buttonPin)) handleButtonPress();

  check();

  if(shouldUpdate && !deleted){
    yellowCounter=0;
    // Read the value from the infrared sensor
    int dis = dsitance();

    // Print the distance value to the serial monitor for debugging
    Serial.print(count+1);
    Serial.print(". ");
    Serial.print("Distance: ");
    Serial.print(dis);
    Serial.println(" cm");

    int total=0;
    Serial.print("Inputs: ");
    for(int i=0;i<10;i++){
      total+=avg[i];
      Serial.print(avg[i]);
      Serial.print(", ");
    }
    Serial.print(". average: ");
    Serial.println(total/10);


    avg[count]=dis;
    if(count==9){
      count=0;
      updateLevel();
    }
    else{
      count++;
    }
    // Update LED status based on the distance reading
    if (dis <= 0.2 * binDepth) {
      // Bin is full (80% or more full)
      digitalWrite(greenLEDPin, LOW);  
      digitalWrite(yellowLEDPin, LOW); 
      digitalWrite(redLEDPin, HIGH);
    } else if (dis < 0.8 * binDepth) {
      // Bin is half-full between 20% and 80 % full
      digitalWrite(greenLEDPin, LOW);  
      digitalWrite(yellowLEDPin, HIGH); 
      digitalWrite(redLEDPin, LOW);
    } else {
      // Bin is less than 20% full
      digitalWrite(greenLEDPin, HIGH);
      digitalWrite(yellowLEDPin, LOW); 
      digitalWrite(redLEDPin, LOW);
    }
  }
  // Logic for the ywllow light to keep flashing if the bin is disabled
  else if(!shouldUpdate && !deleted){
    yellowCounter+=1;
    
    if(yellowCounter==1){
      digitalWrite(yellowLEDPin, HIGH);
    }
    else {
      digitalWrite(yellowLEDPin, LOW);
      yellowCounter=0;
    }
  }
  // If bin is deleted all light are off
  else if(deleted){
    digitalWrite(greenLEDPin, LOW);
    digitalWrite(yellowLEDPin, LOW); 
    digitalWrite(redLEDPin, LOW);
  }

  // Wait .5 second before the next reading
  delay(500);
}
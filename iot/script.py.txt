import RPi.GPIO as GPIO
import time
import json
import paho.mqtt.publish as publish

# GPIO configuration
GPIO.setmode(GPIO.BOARD)
GPIO_TRIG = 7
GPIO_ECHO = 11
GPIO.setup(GPIO_TRIG, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)

# MQTT configuration
mqtt_broker = "102.37.153.145"
mqtt_port = 1883
mqtt_topic = "test"

def measure_distance():
    GPIO.output(GPIO_TRIG, GPIO.LOW)
    time.sleep(2)

    GPIO.output(GPIO_TRIG, GPIO.HIGH)
    time.sleep(0.5)
    GPIO.output(GPIO_TRIG, GPIO.LOW)

    start_time = time.time()
    bounce_back_time = start_time

    while GPIO.input(GPIO_ECHO) == 0:
        pass

    while GPIO.input(GPIO_ECHO) == 1:
        bounce_back_time = time.time()

    pulse_duration = bounce_back_time - start_time
    distance = round(pulse_duration * 17150, 2)

    return distance

try:
    while True:
        distance = measure_distance()
        payload = {"id": "1", "value": distance}
        json_payload = json.dumps(payload)

        # Send to Mosquitto
        publish.single(mqtt_topic, json_payload, hostname=mqtt_broker, port=mqtt_port,
                       auth={'username': "azureuser", 'password': "azureuser"})

        time.sleep(1)  # Adjust the sleep time as needed

except KeyboardInterrupt:
    pass
finally:
    GPIO.cleanup()

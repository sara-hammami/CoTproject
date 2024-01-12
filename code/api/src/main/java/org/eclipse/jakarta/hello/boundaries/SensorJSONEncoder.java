package org.eclipse.jakarta.hello.boundaries;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.websocket.EncodeException;
import jakarta.websocket.Encoder;
import org.eclipse.jakarta.hello.entities.Sensor;

public class SensorJSONEncoder implements Encoder.Text<Sensor> {
    @Override
    public String encode(Sensor sensor) throws EncodeException {

        JsonObject jsonObject = Json.createObjectBuilder()
                .add("id", sensor.getId())
                .add("value", sensor.getvalue())
                .build();
        return jsonObject.toString();

    }


}
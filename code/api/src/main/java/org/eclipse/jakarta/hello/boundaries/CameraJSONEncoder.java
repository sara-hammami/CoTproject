package org.eclipse.jakarta.hello.boundaries;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.websocket.EncodeException;
import jakarta.websocket.Encoder;
import org.eclipse.jakarta.hello.entities.Camera;

public class CameraJSONEncoder implements Encoder.Text<Camera> {
    @Override
    public String encode(Camera camera) throws EncodeException {

        JsonObject jsonObject = Json.createObjectBuilder()
                .add("image", camera.getImage())
                .build();
        return jsonObject.toString();

    }


}
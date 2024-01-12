package org.eclipse.jakarta.hello.boundaries;
import jakarta.ejb.EJB;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;
import org.eclipse.jakarta.hello.entities.Sensor;
import org.eclipse.jakarta.hello.controllers.MqttMessageEventManager;

@ServerEndpoint(value = "/pushes", encoders = {SensorJSONEncoder.class}, decoders = {SensorJSONDecoder.class}) //Annotates path for websocket and with the json encoders and decoders
public class PublishWebsocketEndpoint {
    @EJB
    private MqttMessageEventManager mqttlistener;
    private static Hashtable<String, Session> sessions = new Hashtable<>(); // initialize sessions as empty Hashtable
    public static void broadcastMessage(Sensor sensor) {
        System.out.println("Broadcasting message: " + sensor); // Log to check if the method is called

        for (Session session : sessions.values()) {
            try {
                session.getBasicRemote().sendObject(sensor);
                System.out.println("Message sent to session " + session.getId()); // Log successful message sending
            } catch (IOException | EncodeException e) {
                System.err.println("Error sending message to session " + session.getId() + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
    @OnOpen
    public void onOpen(Session session){
        System.out.println("session opened ");
        this.mqttlistener = new MqttMessageEventManager();
        mqttlistener.Hello(); // print Hello on session start, for debugging
        sessions.put(session.getId(), session); //add the new session

    }
    @OnClose
    public void onClose(Session session, CloseReason reason){
        sessions.remove(session); // delete sessions when client leave
    }
    @OnError
    public void onError(Session session, Throwable error){
        System.out.println("Push WebSocket error for ID " + session.getId() + ": " + error.getMessage());
    }


}
package vn.tizun.service.implement;

import com.google.cloud.firestore.DocumentReference;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.tizun.controller.request.NotificationRequest;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class FCMService {

    @Autowired
    private FirebaseMessaging firebaseMessaging;

    public String sendPushNotification(Long takerId, String title, String body) {
        try {
            Map<String, Object> notificationData = new HashMap<>();
            notificationData.put("userId", takerId);
            notificationData.put("title", title);
            notificationData.put("body", body);

            long currentTimeMillis = System.currentTimeMillis();
            Date date = new Date(currentTimeMillis);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String formattedDate = sdf.format(date);

            notificationData.put("createdAt", formattedDate);
            notificationData.put("isRead", false);

            DocumentReference docRef = FirestoreClient.getFirestore().collection("notifications")
                    .document(UUID.randomUUID().toString());

            docRef.set(notificationData);
            return "Notification saved to Firestore";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error saving notification to Firestore";
        }
    }
}

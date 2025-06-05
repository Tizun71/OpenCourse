package vn.tizun.service.implement;

import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import vn.tizun.controller.request.EventCreationRequest;
import vn.tizun.controller.request.EventUpdateRequest;
import vn.tizun.controller.response.EventResponse;
import vn.tizun.exception.ResourceNotFoundException;
import vn.tizun.model.CourseEntity;
import vn.tizun.model.EventEntity;
import vn.tizun.model.UserEntity;
import vn.tizun.repository.IEventRepository;
import vn.tizun.repository.IUserRepository;
import vn.tizun.service.IEventService;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EventService implements IEventService {

    private final IEventRepository eventRepository;
    private final IUserRepository userRepository;
    private final FCMService fcmService;

    @Override
    public List<EventResponse> listByUserId(Long userId, Date startedDate, Date endedDate) {
        List<EventResponse> eventResponses =
                eventRepository.findByUserIdAndStartedAtBetween(userId, startedDate, endedDate)
                        .stream()
                        .map(e -> EventResponse.builder()
                                .id(e.getId())
                                .title(e.getTitle())
                                .startedAt(e.getStartedAt())
                                .endedAt(e.getEndedAt())
                                .build())
                        .collect(Collectors.toList());
        return eventResponses;
    }

    @Override
    public long create(EventCreationRequest request) {
        EventEntity event = new EventEntity();
        event.setTitle(request.getTitle());
        event.setStartedAt(request.getStartedAt());
        event.setEndedAt(request.getEndedAt());

        UserEntity userEntity = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        event.setUser(userEntity);

        eventRepository.save(event);

        return event.getId();
    }

    @Override
    public void update(EventUpdateRequest request) {
        EventEntity event = getEventEntity(request.getId());
        event.setTitle(request.getTitle());
        event.setStartedAt(request.getStartedAt());
        event.setEndedAt(request.getEndedAt());

        UserEntity userEntity = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        event.setUser(userEntity);

        eventRepository.save(event);
    }

    @Override
    public void delete(Long id) {
        EventEntity event = getEventEntity(id);
        eventRepository.delete(event);
    }

    private EventEntity getEventEntity(Long id){
        return eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
    }

    @Scheduled(fixedRate = 60000)
    public void checkAndNotify() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime deadline = now.plusMinutes(1);

        List<EventEntity> upcoming = eventRepository.findUpcomingLessons(now, deadline);
        for (EventEntity event : upcoming){
            String title = "Thông báo lịch học";
            String body = "Môn học " + event.getTitle() + " sắp bắt đầu lúc" + event.getStartedAt().toString();
            fcmService.sendPushNotification(event.getUser().getId(), title, body);
        }
    }
}

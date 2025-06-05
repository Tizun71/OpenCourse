package vn.tizun.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.tizun.controller.request.EventCreationRequest;
import vn.tizun.controller.request.EventUpdateRequest;
import vn.tizun.controller.response.EventResponse;
import vn.tizun.service.IEventService;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/event")
@Tag(name = "Event Controller")
@Slf4j(topic = "EVENT-CONTROLLER")
@RequiredArgsConstructor
public class EventController {

    private  final IEventService eventService;

    @Operation(summary = "Get event list", description = "API retrieve event from db")
    @GetMapping("/list")
    public Map<String, Object> getList(@RequestParam Long userId,
                                       @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS") Date startedDate,
                                       @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS") Date endedDate) {
        log.info("Get event list");

        List<EventResponse> events = eventService.listByUserId(userId,startedDate,endedDate);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "event list");
        result.put("data", events);

        return result;
    }

    @Operation(summary = "Create Event", description = "API add new Event to db")
    @PostMapping("/add")
    public ResponseEntity<Object> createEvent(@RequestBody @Valid EventCreationRequest request){
        log.info("Creating new event");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.CREATED.value());
        result.put("message", "Event created successfully");
        result.put("data", eventService.create(request));

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
    @Operation(summary = "Update Event", description = "API update Event to db")
    @PostMapping("/upd")
    public ResponseEntity<Object> createEvent(@RequestBody @Valid EventUpdateRequest request){
        log.info("Updating new event");

        eventService.update(request);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.CREATED.value());
        result.put("message", "Event created successfully");
        result.put("data", "");

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }


    @Operation(summary = "Delete Event", description = "API delete event from db")
    @DeleteMapping("/del/{eventId}")
    public Map<String, Object> deleteUser(@PathVariable  @Min(value = 1, message = "eventId must be equals or greater than 1") Long eventId){
        log.info("Deleting event: {}", eventId);

        eventService.delete(eventId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.RESET_CONTENT.value());
        result.put("message", "event deleted successfully");
        result.put("data", "");

        return result;
    }
}

package vn.tizun.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.tizun.controller.request.LessonCreationRequest;
import vn.tizun.controller.request.LessonUpdateRequest;
import vn.tizun.controller.response.LessonResponse;
import vn.tizun.service.ILessonService;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/lesson")
@Tag(name = "Lesson Controller")
@Slf4j(topic = "LESSON-CONTROLLER")
@RequiredArgsConstructor
public class LessonController {
    private final ILessonService lessonService;

//    @Operation(summary = "Get lesson list", description = "API retrieve lesson from db")
//    @GetMapping("/list")
//    public Map<String, Object> getList(@RequestParam(required = false) String keyword,
//                                       @RequestParam(required = false) String sort,
//                                       @RequestParam(defaultValue = "0") int page,
//                                       @RequestParam(defaultValue = "20") int size){
//        log.info("Get lesson list");
//
//        Map<String, Object> result = new LinkedHashMap<>();
//        result.put("status", HttpStatus.OK.value());
//        result.put("message", "lesson list");
//        result.put("data", "");
//
//        return result;
//    }
//
    @Operation(summary = "Get lesson detail", description = "API retrieve lesson detail by ID")
    @GetMapping("/{lessonId}")
    public Map<String, Object> getUserDetail(@PathVariable @Min(value = 1, message = "lessonID must be equal or greater than 1") Long lessonId){
        log.info("Get lesson detail by ID: {}", lessonId);

        LessonResponse lessonDetail = lessonService.findById(lessonId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "lesson");
        result.put("data", lessonDetail);
        return result;
    }

    @Operation(summary = "Create lesson", description = "API add new lesson to db")
    @PostMapping("/add")
    public ResponseEntity<Object> createlesson(@RequestBody @Valid LessonCreationRequest request){

        log.info("Creating new lesson");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.CREATED.value());
        result.put("message", "lesson created successfully");
        result.put("data", lessonService.save(request));

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @Operation(summary = "Update lesson", description = "API update lesson to db")
    @PutMapping("/upd")
    public Map<String, Object> updateUser(@RequestBody LessonUpdateRequest request){

        log.info("Updating lesson with id: {}", request.getId());

        lessonService.update(request);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.ACCEPTED.value());
        result.put("message", "lesson updated successfully");
        result.put("data", "");

        return result;
    }

    @Operation(summary = "Delete lesson", description = "API inactivate lesson from db")
    @DeleteMapping("/del/{lessonId}")
    public Map<String, Object> deleteUser(@PathVariable  @Min(value = 1, message = "lessonId must be equals or greater than 1") Long lessonId){
        log.info("Deleting lesson: {}", lessonId);

        lessonService.delete(lessonId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.RESET_CONTENT.value());
        result.put("message", "lesson deleted successfully");
        result.put("data", "");

        return result;
    }

    @Operation(summary = "Upload lesson video", description = "API upload new lesson video to S3")
    @PostMapping("/upload")
    public ResponseEntity<Object> uploadLesson(Long course_id ,@RequestParam("file") MultipartFile file){

        log.info("Upload new lesson video");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.CREATED.value());
        result.put("message", "video uploaded successfully");
        result.put("data", "");

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @Operation(summary = "Check lesson learned", description = "API check lesson learned to db")
    @PostMapping("/check")
    public ResponseEntity<Object> checkLesson(@RequestParam Long userId, @RequestParam Long lessonId){

        lessonService.addLessonCompleted(userId, lessonId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.CREATED.value());
        result.put("message", "lesson checked successfully");
        result.put("data", "");

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
}

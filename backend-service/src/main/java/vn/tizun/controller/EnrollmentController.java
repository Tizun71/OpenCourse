package vn.tizun.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.tizun.controller.request.EnrollmentRequest;
import vn.tizun.controller.request.EnrollmentUpdateProgressRequest;
import vn.tizun.service.IEnrollmentService;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/enrollment")
@Tag(name = "Enrollment Controller")
@Slf4j(topic = "ENROLLMENT-CONTROLLER")
@RequiredArgsConstructor
public class EnrollmentController {

    private final IEnrollmentService enrollmentService;

    @Operation(summary = "Enroll Course", description = "API add new enrollment to db")
    @PostMapping("/enroll")
    public ResponseEntity<Object> enroll(@RequestBody EnrollmentRequest request){
        log.info("Creating new enrollment");

        enrollmentService.enrollCourse(request);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.CREATED.value());
        result.put("message", "User enroll successfully");
        result.put("data", "");

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @Operation(summary = "Check Enroll Course", description = "API add new enrollment to db")
    @GetMapping("/check")
    public ResponseEntity<Object> checkEnrolled(@RequestParam Long userId, @RequestParam Long courseId){
        log.info("Check user enrolled");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "User has enrolled course");
        result.put("data", enrollmentService.checkUserIsEnroll(userId, courseId));

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @Operation(summary = "Get Status Enroll Course", description = "API add new enrollment to db")
    @GetMapping("/status")
    public ResponseEntity<Object> getStatus(@RequestParam Long userId, @RequestParam Long courseId){

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "User has enrolled course");
        result.put("data", enrollmentService.getEnrollmentStatus(userId, courseId));

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @Operation(summary = "Update progress", description = "API update progress to db")
    @PatchMapping("/upd-progress")
    public ResponseEntity<Object> updateProgress(@RequestBody EnrollmentUpdateProgressRequest request){
        log.info("Updating progress");

        enrollmentService.updateProgress(request);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.NO_CONTENT.value());
        result.put("message", "update progress successfully");
        result.put("data", "");

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}

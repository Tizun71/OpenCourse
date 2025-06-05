package vn.tizun.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.tizun.common.CommonConstants;
import vn.tizun.controller.request.*;
import vn.tizun.controller.response.*;
import vn.tizun.service.ICourseService;
import vn.tizun.service.implement.FCMService;
import vn.tizun.service.implement.UserService;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/course")
@Tag(name = "Course Controller")
@Slf4j(topic = "COURSE-CONTROLLER")
@RequiredArgsConstructor
@Validated
public class CourseController {
    private final ICourseService courseService;
    private final FCMService fcmService;
    private final UserService userService;

    @Operation(summary = "Get course list", description = "API retrieve course from db")
    @GetMapping("/list")
    public Map<String, Object> getList(@RequestParam(required = false) String keyword,
                                       @RequestParam(required = false) String sort,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "20") int size) {
        log.info("Get course list");

        CoursePageResponse courseList = courseService.findAll(keyword, sort, page, size);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("messaege", "course list");
        result.put("data", courseList);

        return result;
    }

    @Operation(summary = "Get course list", description = "API retrieve course from db")
    @GetMapping("/list-all")
    public Map<String, Object> getListAll(@RequestParam(required = false) String keyword,
                                       @RequestParam(required = false) String sort,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "20") int size) {
        log.info("Get course list");

        CoursePageResponse courseList = courseService.findAllStatus(keyword, sort, page, size);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("messaege", "course list");
        result.put("data", courseList);

        return result;
    }

    @Operation(summary = "Get instructor's course list", description = "API retrieve instrustor's course list from db")
    @GetMapping("/{instructorId}/courses")
    public Map<String, Object> getListByInstructorID(@PathVariable @Min(value = 1, message = "InstructorID must be equal or greater than 1") Long instructorId){

        List<CourseResponse> courseList = courseService.listAllByInstructorId(instructorId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "instructor course list");
        result.put("data", courseList);

        return result;
    }

    @Operation(summary = "Get enrolled course list", description = "API retrieve enrolled course list from db")
    @GetMapping("/registed-courses/{userId}")
    public Map<String, Object> getListByUserID(@PathVariable @Min(value = 1, message = "UserID must be equal or greater than 1") Long userId){

        List<RegistedCourseResponse> courseList = courseService.findRegistedCourseByUserID(userId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "registed user course list");
        result.put("data", courseList);

        return result;
    }

    @Operation(summary = "Get course detail", description = "API retrieve course detail by ID")
    @GetMapping("/{courseId}")
    public Map<String, Object> getUserDetail(@PathVariable @Min(value = 1, message = "CourseID must be equal or greater than 1") Long courseId){
        log.info("Get course detail by ID: {}", courseId);

        DetailCourseResponse courseDetail = courseService.getDetailCourse(courseId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "user");
        result.put("data", courseDetail);
        return result;
    }

    @Operation(summary = "Create Course", description = "API add new course to db")
    @PostMapping("/add")
    public ResponseEntity<Object> createCourse(@RequestBody @Valid CourseCreationRequest request){
        log.info("Creating new course");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.CREATED.value());
        result.put("message", "course created successfully");
        result.put("data", courseService.save(request));

        fcmService.sendPushNotification(CommonConstants.ADMIN_ID,
                                    CommonConstants.COURSE_CREATED,
                                "Giảng viên " + userService.findById(request.getInstructorId()).getFullName() + " đã tạo khóa học mới");

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @Operation(summary = "Update Course", description = "API update course to db")
    @PutMapping("/upd")
    public Map<String, Object> updateUser(@RequestBody CourseUpdateRequest request){

        log.info("Updating course with id: {}", request.getCourseId());

        courseService.update(request);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.ACCEPTED.value());
        result.put("message", "course updated successfully");
        result.put("data", "");

        return result;
    }

    @Operation(summary = "Update Course Image", description = "API update course image to S3")
    @PatchMapping("/upd-image")
    public Map<String, Object> changeImage(Long id,MultipartFile file){

        courseService.updateImage(id, file);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.NO_CONTENT.value());
        result.put("message", "course image updated successfully");
        result.put("data", "");

        return result;
    }

    @Operation(summary = "Update Course Status", description = "API update course status")
    @PatchMapping("/upd-status")
    public Map<String, Object> changeStatus(@RequestBody CourseUpdateStatusRequest request){

        courseService.updateStatus(request);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.NO_CONTENT.value());
        result.put("message", "course status updated successfully");
        result.put("data", "");

        return result;
    }


    @Operation(summary = "Delete Category", description = "API inactivate course from db")
    @DeleteMapping("/del/{courseId}")
    public Map<String, Object> deleteUser(@PathVariable  @Min(value = 1, message = "courseId must be equals or greater than 1") Long courseId){
        log.info("Deleting course: {}", courseId);

        courseService.delete(courseId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.RESET_CONTENT.value());
        result.put("message", "course deleted successfully");
        result.put("data", "");

        return result;
    }

    @Operation(summary = "Get user's course enrolled", description = "")
    @GetMapping("/enrolled")
    public Map<String, Object> listEnrolledCourse(@PathVariable @Min(value = 1, message = "UserID must be equal or greater than 1") Long instructorId){

        List<CourseResponse> courseList = courseService.listAllByInstructorId(instructorId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "instructor course list");
        result.put("data", courseList);

        return result;
    }
}

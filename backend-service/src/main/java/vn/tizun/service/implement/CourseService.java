package vn.tizun.service.implement;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import vn.tizun.common.CourseStatus;
import vn.tizun.controller.request.CourseCreationRequest;
import vn.tizun.controller.request.CourseUpdateRequest;
import vn.tizun.controller.request.CourseUpdateStatusRequest;
import vn.tizun.controller.response.*;
import vn.tizun.exception.ResourceNotFoundException;
import vn.tizun.model.*;
import vn.tizun.repository.*;
import vn.tizun.service.ICourseService;
import vn.tizun.service.IS3Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j(topic = "COURSE-SERVICE")
@RequiredArgsConstructor
public class CourseService implements ICourseService {
    private final ICategoryRepository categoryRepository;
    private final IUserRepository userRepository;
    private final ISectionRepository sectionRepository;
    private final IEnrollmentRepository enrollmentRepository;
    private final ICourseRepository courseRepository;
    private final IS3Service s3Service;

    String FOLDER_DIRECTORY = "courses/";

    @Override
    public CoursePageResponse findAll(String keyword, String sort, int page, int size) {
        log.info("findAll start");

        // Sorting
        Sort.Order order = new Sort.Order(Sort.Direction.ASC, "id");
        if (StringUtils.hasLength(sort)) {
            Pattern pattern = Pattern.compile("(\\w+?)(:)(.*)"); // tencot:asc|desc
            Matcher matcher = pattern.matcher(sort);
            if (matcher.find()) {
                String columnName = matcher.group(1);
                if (matcher.group(3).equalsIgnoreCase("asc")) {
                    order = new Sort.Order(Sort.Direction.ASC, columnName);
                } else {
                    order = new Sort.Order(Sort.Direction.DESC, columnName);
                }
            }
        }

        // Xu ly truong hop FE muon bat dau voi page = 1
        int pageNo = 0;
        if (page > 0) {
            pageNo = page - 1;
        }

        // Paging
        Pageable pageable = PageRequest.of(pageNo, size, Sort.by(order));

        Page<CourseEntity> entityPage;

        if (StringUtils.hasLength(keyword)) {
            keyword = "%" + keyword.toLowerCase() + "%";
            entityPage = courseRepository.searchByKeyword(keyword, pageable);
        } else {
            entityPage = courseRepository.findAvailable(pageable);
        }

        return getCoursePageResponse(page, size, entityPage);
    }

    @Override
    public CoursePageResponse findAllStatus(String keyword, String sort, int page, int size) {
        log.info("findAll start");

        // Sorting
        Sort.Order order = new Sort.Order(Sort.Direction.ASC, "id");
        if (StringUtils.hasLength(sort)) {
            Pattern pattern = Pattern.compile("(\\w+?)(:)(.*)"); // tencot:asc|desc
            Matcher matcher = pattern.matcher(sort);
            if (matcher.find()) {
                String columnName = matcher.group(1);
                if (matcher.group(3).equalsIgnoreCase("asc")) {
                    order = new Sort.Order(Sort.Direction.ASC, columnName);
                } else {
                    order = new Sort.Order(Sort.Direction.DESC, columnName);
                }
            }
        }

        // Xu ly truong hop FE muon bat dau voi page = 1
        int pageNo = 0;
        if (page > 0) {
            pageNo = page - 1;
        }

        // Paging
        Pageable pageable = PageRequest.of(pageNo, size, Sort.by(order));

        Page<CourseEntity> entityPage;

        if (StringUtils.hasLength(keyword)) {
            keyword = "%" + keyword.toLowerCase() + "%";
            entityPage = courseRepository.searchByKeyword(keyword, pageable);
        } else {
            entityPage = courseRepository.findAll(pageable);
        }

        return getCoursePageResponse(page, size, entityPage);
    }

    @Override
    public CourseResponse findById(Long id) {

        CourseEntity course = getCourseEntity(id);
        return CourseResponse.builder()
                .id(course.getId())
                .courseName(course.getCourseName())
                .description(course.getDescription())
                .instructorName(course.getUser().getFirstName() + ' ' + course.getUser().getLastName())
                .categoryName(course.getCategory().getCategoryName())
                .courseLevel(course.getCourseLevel())
                .imageUrl(course.getImageURL())
                .build();
    }

    @Override
    public List<RegistedCourseResponse> findRegistedCourseByUserID(Long userId) {
        List<RegistedCourseResponse> response = new ArrayList<>();
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        for (Enrollment enrollment : enrollments){
            CourseEntity course = enrollment.getCourse();
            UserEntity user = enrollment.getUser();
            RegistedCourseResponse rc = RegistedCourseResponse.builder()
                    .id(course.getId())
                    .courseName(course.getCourseName())
                    .instructorName(course.getUser().getFirstName() + ' ' + course.getUser().getLastName())
                    .level(course.getCourseLevel())
                    .progress(enrollment.getProgress())
                    .imageUrl(course.getImageURL())
                    .build();
            response.add(rc);
        }
        return response;
    }

    @Override
    public DetailCourseResponse getDetailCourse(Long id) {
        CourseEntity course = getCourseEntity(id);

        List<SectionEntity> sections = sectionRepository.findAllByCourseId(id);
        List<SectionResponse> sectionResponses = new ArrayList<>();

        for (var section : sections){
            List<LessonResponse> lessonResponses = section.getLessons().stream()
                    .map(lesson -> LessonResponse.builder()
                            .id(lesson.getId())
                            .title(lesson.getTitle())
                            .content(lesson.getContent())
                            .videoUrl(lesson.getVideoUrl())
                            .position(lesson.getPosition())
                            .build())
                    .collect(Collectors.toList());

            var sr = SectionResponse.builder()
                    .id(section.getId())
                    .title(section.getTitle())
                    .position(section.getPosition())
                    .lessons(lessonResponses)
                    .build();
            sectionResponses.add(sr);
        }

        return DetailCourseResponse.builder()
                .id(course.getId())
                .courseName(course.getCourseName())
                .description(course.getDescription())
                .registeredNumber(enrollmentRepository.countEnrollmentsByCourseId(id))
                .courseLevel(course.getCourseLevel().toString())
                .categoryName(course.getCategory().getCategoryName())
                .imageUrl(course.getImageURL())
                .categoryId(course.getCategory().getId())
                .instructorName(course.getUser().getFirstName() + ' ' + course.getUser().getLastName())
                .sections(sectionResponses)
                .status(course.getStatus())
                .build();
    }

    @Override
    public CourseResponse findByCourseName(String courseName) {
        return null;
    }

    @Override
    public long save(CourseCreationRequest req) {

        CourseEntity course = new CourseEntity();
        course.setCourseName(req.getCourseName());
        course.setDescription(req.getDescription());
        course.setImageURL(req.getImageUrl());
        course.setCourseLevel(req.getCourseLevel());
        course.setStatus(CourseStatus.UNPUBLISHED);

        Optional<UserEntity> user = userRepository.findById(req.getInstructorId());
        Optional<CategoryEntity> category = categoryRepository.findById(req.getCategoryId());

        course.setUser(user.get());
        course.setCategory(category.get());

        courseRepository.save(course);
        log.info("Saved course: {}", course);

        return course.getId();
    }

    @Override
    public void update(CourseUpdateRequest req) {

        CourseEntity course = getCourseEntity(req.getCourseId());

        course.setCourseName(req.getCourseName());
        course.setDescription(req.getDescription());
        course.setCourseLevel(req.getCourseLevel());

        Optional<CategoryEntity> category = categoryRepository.findById(req.getCategoryId());
        course.setCategory(category.get());

        course.setImageURL(req.getImageUrl());

        courseRepository.save(course);

        log.info("Updated course: {}", course);
    }

    @Override
    public void updateImage(Long id, MultipartFile file) {
        String image_url = s3Service.uploadFileToS3(FOLDER_DIRECTORY + id, file);

        CourseEntity course = getCourseEntity(id);
        course.setImageURL(image_url);

        courseRepository.save(course);
        log.info("Updated course image: {}", course);

    }

    @Override
    public void updateStatus(CourseUpdateStatusRequest request) {
        CourseEntity course = getCourseEntity(request.getCourseId());
        course.setStatus(request.getStatus());

        courseRepository.save(course);
    }

    private CourseEntity getCourseEntity(Long id){
        return courseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
    }

    @Override
    public void delete(Long id) {
        CourseEntity course = getCourseEntity(id);
        course.setStatus(CourseStatus.DELETED);
        courseRepository.save(course);
    }

    @Override
    public List<CourseResponse> listAllByInstructorId(Long instructorID) {
        List<CourseEntity> courses = courseRepository.findAllByInstructorId(instructorID);

        List<CourseResponse> courseList = courses.stream().map(entity -> CourseResponse.builder()
                .id(entity.getId())
                .courseName(entity.getCourseName())
                .description(entity.getDescription())
                .instructorName(entity.getUser().getFirstName() + ' ' + entity.getUser().getLastName())
                .categoryName(entity.getCategory().getCategoryName())
                .courseLevel(entity.getCourseLevel())
                .imageUrl(entity.getImageURL())
                .status(entity.getStatus())
                .build()
        ).toList();

        return courseList;
    }

    @Override
    public long count() {
        return courseRepository.count();
    }

    private static CoursePageResponse getCoursePageResponse(int page, int size, Page<CourseEntity> CourseEntities) {
        log.info("Convert Course Entity Page");

        List<CourseResponse> CourseList = CourseEntities.stream().map(entity -> CourseResponse.builder()
                .id(entity.getId())
                .courseName(entity.getCourseName())
                .description(entity.getDescription())
                .instructorName(entity.getUser().getFirstName() + ' ' + entity.getUser().getLastName())
                .categoryName(entity.getCategory().getCategoryName())
                .courseLevel(entity.getCourseLevel())
                .imageUrl(entity.getImageURL())
                .status(entity.getStatus())
                .numberOfRegister(entity.getNumberOfRegister())
                .build()
        ).toList();

        CoursePageResponse response = new CoursePageResponse();
        response.setPageNumber(page);
        response.setPageSize(size);
        response.setTotalElements(CourseEntities.getTotalElements());
        response.setTotalPages(CourseEntities.getTotalPages());
        response.setCourses(CourseList);

        return response;
    }


}

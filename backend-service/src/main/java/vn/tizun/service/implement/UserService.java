package vn.tizun.service.implement;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import vn.tizun.common.UserStatus;
import vn.tizun.common.UserType;
import vn.tizun.controller.request.*;
import vn.tizun.controller.response.CourseProgressReponse;
import vn.tizun.controller.response.LessonCompletedResponse;
import vn.tizun.controller.response.UserPageResponse;
import vn.tizun.controller.response.UserResponse;
import vn.tizun.exception.ResourceNotFoundException;
import vn.tizun.model.*;
import vn.tizun.repository.*;
import vn.tizun.service.IUserService;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j(topic = "USER-SERVICE")
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IRoleRepository roleRepository;
    private final IUserHasRoleRepository userHasRoleRepository;
    private final IEnrollmentRepository enrollmentRepository;
    private final ILessonCompletionRepository lessonCompletionRepository;
    private final ILessonRepository lessonRepository;

    @Override
    public UserPageResponse findAll(String keyword, String sort, int page, int size) {
        log.info("findAll start");

        // Sorting
        Sort.Order order = new Sort.Order(Sort.Direction.DESC, "id");
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

        Page<UserEntity> entityPage;

        if (StringUtils.hasLength(keyword)) {
            keyword = "%" + keyword.toLowerCase() + "%";
            entityPage = userRepository.searchByKeyword(keyword, pageable);
        } else {
            entityPage = userRepository.findAll(pageable);
        }

        return getUserPageResponse(page, size, entityPage);
    }

    @Override
    public UserResponse findById(Long id) {
        log.info("Find user by id: {}", id);

        UserEntity userEntity = getUserEntity(id);
        return UserResponse.builder()
                .id(userEntity.getId())
                .firstName(userEntity.getFirstName())
                .lastName(userEntity.getLastName())
                .gender(userEntity.getGender())
                .birthday(userEntity.getBirthday())
                .username(userEntity.getUsername())
                .email(userEntity.getEmail())
                .phone(userEntity.getPhone())
                .type(userEntity.getType())
                .build();
    }

    @Override
    public UserResponse findByUsername(String username) {
        UserEntity userEntity = getUserEntityByUsername(username);
        return UserResponse.builder()
                .id(userEntity.getId())
                .firstName(userEntity.getFirstName())
                .lastName(userEntity.getLastName())
                .gender(userEntity.getGender())
                .birthday(userEntity.getBirthday())
                .username(userEntity.getUsername())
                .email(userEntity.getEmail())
                .phone(userEntity.getPhone())
                .build();
    }

    @Override
    public UserResponse findByEmail(String email) {
        UserEntity userEntity = getUserEntityByEmail(email);
        return UserResponse.builder()
                .id(userEntity.getId())
                .firstName(userEntity.getFirstName())
                .lastName(userEntity.getLastName())
                .gender(userEntity.getGender())
                .birthday(userEntity.getBirthday())
                .username(userEntity.getUsername())
                .email(userEntity.getEmail())
                .phone(userEntity.getPhone())
                .build();
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public long save(UserCreationRequest req) {

        UserEntity user = new UserEntity();
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setGender(req.getGender());
        user.setBirthday(req.getBirthday());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setUsername(req.getUsername());
        user.setType(req.getType());
        user.setStatus(UserStatus.ACTIVE);
        user.setPassword(passwordEncoder.encode("123"));
        userRepository.save(user);
        log.info("Saved user: {}", user);

        return user.getId();
    }

    @Override
    public long createUserAccount(AccountRegisterRequest req, String password) {

        UserEntity user = new UserEntity();
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setEmail(req.getEmail());
        user.setUsername(req.getUsername());
        user.setType(UserType.USER);
        user.setStatus(UserStatus.ACTIVE);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        log.info("Saved user: {}", user);

        Role role = roleRepository.findByName("USER");

        UserHasRole userHasRole = new UserHasRole();
        userHasRole.setUser(user);
        userHasRole.setRole(role);
        userHasRoleRepository.save(userHasRole);

        return user.getId();
    }

    @Override
    public long createUserAccountForAdmin(AccountRegisterForAdminRequest req, String password) {
        UserEntity user = new UserEntity();
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setEmail(req.getEmail());
        user.setUsername(req.getUsername());
        user.setType(req.getType());
        user.setStatus(UserStatus.ACTIVE);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        log.info("Saved user: {}", user);

        Role role = roleRepository.findByName(req.getType().toString());

        UserHasRole userHasRole = new UserHasRole();
        userHasRole.setUser(user);
        userHasRole.setRole(role);
        userHasRoleRepository.save(userHasRole);

        return user.getId();
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(UserUpdateRequest req) {
        log.info("Updating user: {}", req);

        //Get user by id
        UserEntity user = getUserEntity(req.getId());
        //Set data
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setGender(req.getGender());
        user.setBirthday(req.getBirthday());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setUsername(req.getUsername());
        userRepository.save(user);
        //Save to db
        log.info("Updated user: {}", user);
    }

    @Override
    public void changePassword(UserPasswordRequest req) {
        log.info("Changing password for user: {}", req);

        //Get user by id
        UserEntity user = getUserEntity(req.getId());
        if (req.getPassword().equals(req.getConfirmPassword())) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        else {
            // Mật khẩu cũ không đúng, ném lỗi
            throw new IllegalArgumentException("Mật khẩu cũ không đúng");
        }

        userRepository.save(user);
    }

    @Override
    public void changeRole(UserRoleRequest req) {
        log.info("Changing role for user: {}", req);

        UserEntity user = getUserEntity(req.getUserId());
        user.setType(req.getType());

        userRepository.save(user);

        Role role = roleRepository.findByName(req.getType().toString());
        if (role == null) {
            throw new IllegalArgumentException("Role not found for type: " + req.getType());
        }

        userHasRoleRepository.deleteByUserId(user.getId());

        UserHasRole userHasRole = new UserHasRole();
        userHasRole.setUser(user);
        userHasRole.setRole(role);
        userHasRoleRepository.save(userHasRole);
    }

    @Override
    public void lockToggle(Long userId) {
        UserEntity user = getUserEntity(userId);
        if (user.getStatus().equals(UserStatus.ACTIVE)){
            user.setStatus(UserStatus.INACTIVE);
        }
        else if (user.getStatus().equals(UserStatus.INACTIVE)) {
            user.setStatus(UserStatus.ACTIVE);
        }
        userRepository.save(user);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting user: {}", id);

        UserEntity user = getUserEntity(id);
        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);

        log.info("Deleted user: {}", id);
    }

    @Override
    public void addUserRole(UserRoleChangeRequest req) {
        UserEntity user = getUserEntity(req.getId());
        Role role = roleRepository.findByName(req.getRole());
        if (userHasRoleRepository.existsByUserIdAndRoleId(req.getId(), role.getId())){
            throw new IllegalArgumentException("User has had this role");
        }

        UserHasRole userHasRole = new UserHasRole();
        userHasRole.setUser(user);
        userHasRole.setRole(role);
        userHasRoleRepository.save(userHasRole);
    }

    @Override
    public void removeUserRole(UserRoleChangeRequest req) {
        UserEntity user = getUserEntity(req.getId());
        Role role = roleRepository.findByName(req.getRole());

        Optional<UserHasRole> userHasRoleOpt = userHasRoleRepository.findByUserIdAndRoleId(req.getId(), role.getId());

        if (userHasRoleOpt.isPresent()) {
            userHasRoleRepository.delete(userHasRoleOpt.get());
        } else {
            throw new IllegalArgumentException("User doesn't have this role");
        }
    }

    @Override
    public int getTotalLearner() {
        return userRepository.countByType(UserType.USER);
    }

    @Override
    public int getTotalInstructor() {
        return userRepository.countByType(UserType.INSTRUCTOR);
    }

    @Override
    public CourseProgressReponse getProgressOfCourse(Long userId, Long courseId) {
        CourseProgressReponse response = new CourseProgressReponse();

        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId).orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

        List<LessonCompletedResponse> lessonCompletedResponses = new ArrayList<>();
        List<LessonCompletion> lessonCompletions = lessonCompletionRepository.findAllByUserIdAndLessonSectionCourseId(userId, courseId);
        for (LessonCompletion lessonCompletion : lessonCompletions){
            LessonCompletedResponse lessonCompletedResponse = new LessonCompletedResponse();
            LessonEntity lesson = lessonCompletion.getLesson();
            lessonCompletedResponse.setLessonId(lesson.getId());
            lessonCompletedResponse.setLessonName(lesson.getTitle());
            lessonCompletedResponses.add(lessonCompletedResponse);
        }

        response.setCompletedLessons(lessonCompletionRepository.countByUserIdAndLessonSectionCourseId(userId, courseId));
        response.setTotalLessons(lessonRepository.countBySectionCourseId(courseId));
        response.setStatus(enrollment.getStatus());
        response.setProgress(enrollment.getProgress());
        response.setCompletedLesson(lessonCompletedResponses);
        return response;
    }

    private UserEntity getUserEntity(Long id){
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserEntity getUserEntityByUsername(String username){
        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }
        return user;
    }

    private UserEntity getUserEntityByEmail(String email){
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }
        return user;
    }

    private static UserPageResponse getUserPageResponse(int page, int size, Page<UserEntity> userEntities) {
        log.info("Convert User Entity Page");
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

        List<UserResponse> userList = userEntities.stream().map(entity -> UserResponse.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .gender(entity.getGender())
                .birthday(entity.getBirthday())
                .username(entity.getUsername())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .imageUrl(entity.getImageUrl())
                .type(entity.getType())
                .status(entity.getStatus())
                .createdAt(sdf.format(entity.getCreatedAt()))
                .build()
        ).toList();

        UserPageResponse response = new UserPageResponse();
        response.setPageNumber(page);
        response.setPageSize(size);
        response.setTotalElements(userEntities.getTotalElements());
        response.setTotalPages(userEntities.getTotalPages());
        response.setUsers(userList);

        return response;
    }
}

package vn.tizun.service;

import vn.tizun.controller.request.*;
import vn.tizun.controller.response.CourseProgressReponse;
import vn.tizun.controller.response.UserPageResponse;
import vn.tizun.controller.response.UserResponse;

public interface IUserService {
    UserPageResponse findAll(String keyword, String sort, int page, int size);
    UserResponse findById(Long id);
    UserResponse findByUsername(String username);
    UserResponse findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    long save(UserCreationRequest req);
    long createUserAccount(AccountRegisterRequest req, String password);
    long createUserAccountForAdmin(AccountRegisterForAdminRequest req, String password);
    void update(UserUpdateRequest req);
    void changePassword(UserPasswordRequest req);
    void changeRole(UserRoleRequest req);
    void lockToggle(Long userId);
    void delete(Long id);
    void addUserRole(UserRoleChangeRequest req);
    void removeUserRole(UserRoleChangeRequest req);
    int getTotalLearner();
    int getTotalInstructor();
    CourseProgressReponse getProgressOfCourse(Long userId, Long courseId);
}

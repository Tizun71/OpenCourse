package vn.tizun.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import vn.tizun.controller.request.*;
import vn.tizun.controller.response.CourseProgressReponse;
import vn.tizun.controller.response.UserPageResponse;
import vn.tizun.controller.response.UserResponse;
import vn.tizun.model.UserEntity;
import vn.tizun.service.IMailService;
import vn.tizun.service.IUserService;
import vn.tizun.utils.PasswordGenerator;

import java.util.*;

@RestController
@RequestMapping("/user")
@Tag(name = "User Controller")
@Slf4j(topic = "USER-CONTROLLER")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final IUserService userService;
    private final IMailService mailService;

    @Operation(summary = "Get user list", description = "API retrieve user from db")
    @GetMapping("/list")
    public Map<String, Object> getList(@RequestParam(required = false) String keyword,
                                    @RequestParam(required = false) String sort,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "20") int size
                                      ){
        log.info("Get user list");

        UserPageResponse userList = userService.findAll(keyword, sort, page, size);
        
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "user list");
        result.put("data", userList);
        
        return result;
    }

    @Operation(summary = "Get user detail", description = "API retrieve user detail by ID")
    @GetMapping("/{userId}")
    public Map<String, Object> getUserDetail(@PathVariable @Min(value = 1, message = "UserID must be equal or greater than 1") Long userId){
        log.info("Get user detail by ID: {}", userId);

        UserResponse userDetail = userService.findById(userId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "user");
        result.put("data", userDetail);
        return result;
    }

    @Operation(summary = "Create User", description = "API add new user to db")
    @PostMapping("/add")
    public Map<String, Object> createUser(@RequestBody @Valid AccountRegisterForAdminRequest request){

        //check 1: username or email is null or blank
        if (request.getEmail() == null || request.getEmail().isBlank()){
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("status", HttpStatus.BAD_REQUEST.value());
            result.put("message", "email is null or blank");
            result.put("data", "");
            return result;
        }

        if (request.getUsername() == null || request.getUsername().isBlank()){
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("status", HttpStatus.BAD_REQUEST.value());
            result.put("message", "username is null or blank");
            result.put("data", "");
            return result;
        }

        //check 2: username or email is exist
        if (userService.existsByEmail(request.getEmail())){
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("status", HttpStatus.BAD_REQUEST.value());
            result.put("message", "email is exist");
            result.put("data", "");
            return result;
        }

        if (userService.existsByUsername(request.getUsername())){
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("status", HttpStatus.BAD_REQUEST.value());
            result.put("message", "username is exist");
            result.put("data", "");
            return result;
        }

        String passwordGenerator = PasswordGenerator.generateRandomPassword();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.CREATED.value());
        result.put("message", "user created successfully");
        result.put("data", userService.createUserAccountForAdmin(request, passwordGenerator));
        mailService.sendMail_AccountRegister(request, passwordGenerator);
        return result;
    }

    @Operation(summary = "Update User", description = "API update user to db")
    @PutMapping("/upd")
    public Map<String, Object> updateUser(@RequestBody @Valid UserUpdateRequest request){

        log.info("Updating user");
        userService.update(request);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.ACCEPTED.value());
        result.put("message", "user updated successfully");
        result.put("data", "");

        return result;
    }

    @Operation(summary = "Change Password", description = "API change password for user to db")
    @PatchMapping("/change-pwd")
    public Map<String, Object> changePassword(@RequestBody UserPasswordRequest request){

        userService.changePassword(request);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.NO_CONTENT.value());
        result.put("message", "password updated successfully");
        result.put("data", "");

        return result;
    }

    @Operation(summary = "Forget Password", description = "API forget password for user to db")
    @GetMapping("/forget-pwd")
    public Map<String, Object> changePassword(@RequestParam String email){
        System.out.println(email);
        UserResponse user = userService.findByEmail(email);
        AccountRegisterForAdminRequest accountRegisterForAdminRequest = new AccountRegisterForAdminRequest();
        accountRegisterForAdminRequest.setUsername(user.getUsername());
        accountRegisterForAdminRequest.setFirstName(user.getFirstName());
        accountRegisterForAdminRequest.setLastName(user.getLastName());
        accountRegisterForAdminRequest.setEmail(user.getEmail());
        accountRegisterForAdminRequest.setType(user.getType());

        String passwordGenerator = PasswordGenerator.generateRandomPassword();

        UserPasswordRequest userPasswordRequest = new UserPasswordRequest();
        userPasswordRequest.setId(user.getId());
        userPasswordRequest.setPassword(passwordGenerator);
        userPasswordRequest.setConfirmPassword(passwordGenerator);
        userService.changePassword(userPasswordRequest);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.NO_CONTENT.value());
        result.put("message", "password updated successfully");
        result.put("data", "");

        mailService.sendMail_AccountRegister(accountRegisterForAdminRequest, passwordGenerator);

        return result;
    }

    @Operation(summary = "Change Role", description = "API change role for user to db")
    @PatchMapping("/change-role")
    public Map<String, Object> changePassword(@RequestBody UserRoleRequest request){

        userService.changeRole(request);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.NO_CONTENT.value());
        result.put("message", "password updated successfully");
        result.put("data", "");

        return result;
    }

    @Operation(summary = "Lock toggle", description = "API lock toggle for user to db")
    @PatchMapping("/lock-toggle")
    public Map<String, Object> changePassword(@RequestParam Long userId){

        userService.lockToggle(userId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.NO_CONTENT.value());
        result.put("message", "user updated successfully");
        result.put("data", "");

        return result;
    }

    @Operation(summary = "Delete User", description = "API inactivate user from db")
    @PatchMapping("/del/{userId}")
    public Map<String, Object> deleteUser(@PathVariable @Min(value = 1, message = "userId must be equals or greater than 1") Long userId){
        log.info("Deleting user: {}", userId);

        userService.delete(userId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.RESET_CONTENT.value());
        result.put("message", "user deleted successfully");
        result.put("data", "");

        return result;
    }

    @Operation(summary = "Get user detail", description = "API retrieve user detail by ID")
    @GetMapping("/course-progress")
    public Map<String, Object> getLessonProgress(@RequestParam Long userId, @RequestParam Long courseId){
        log.info("Get user progress by ID: {}", userId);

        CourseProgressReponse courseProgressReponse = userService.getProgressOfCourse(userId, courseId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "user");
        result.put("data", courseProgressReponse);
        return result;
    }
}


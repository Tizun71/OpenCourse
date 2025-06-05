package vn.tizun.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.tizun.controller.request.AccountRegisterRequest;
import vn.tizun.controller.request.SignInRequest;
import vn.tizun.controller.response.TokenResponse;
import vn.tizun.service.IAuthenticationService;
import vn.tizun.service.IMailService;
import vn.tizun.service.IUserService;
import vn.tizun.utils.PasswordGenerator;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Slf4j(topic = "AUTHENTICATION-CONTROLLER")
@Tag(name = "Authentication Controller")
@RequiredArgsConstructor
public class AuthenticationController {
    private final IUserService userService;
    private final IAuthenticationService authenticationService;
    private final IMailService mailService;

    @Operation(summary = "Access Token", description = "Login and get access token and refresh token by username and password")
    @PostMapping("/access-token")
    public TokenResponse getAccessToken(@RequestBody SignInRequest request) {
        log.info("Access token request");

        return authenticationService.getAccessToken(request);
    }

//    @Operation(summary = "Refresh token", description = "Get new access token by refresh token")
//    @PostMapping("/refresh-token")
//    public TokenResponse getRefreshToken(@RequestBody String refreshToken) {
//        return "";
//    }

//    @GetMapping("/social-login")
//    public public Map<String, Object> socialAuth(@RequestParam("login_type") String loginType, HttpServletRequest request) {
//
//    }

    @Operation(summary = "Register Account", description = "Register new user to db")
    @PostMapping("/register")
    public Map<String, Object> registerAccount(@RequestBody AccountRegisterRequest request){
        log.info("Register new account");

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

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.CREATED.value());
        result.put("message", "account registered successfully");
        result.put("data", userService.createUserAccount(request, request.getPassword()));

        return result;
    }
}

package vn.tizun.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.tizun.common.CommonConstants;
import vn.tizun.common.MailConstants;
import vn.tizun.controller.request.AccountRegisterForAdminRequest;
import vn.tizun.controller.request.CourseCreationRequest;
import vn.tizun.controller.request.InstructorRegistrationRequest;
import vn.tizun.service.IInstructorRegistrationService;
import vn.tizun.service.IMailService;
import vn.tizun.service.IS3Service;
import vn.tizun.service.IUserService;
import vn.tizun.service.dto.MailDataDto;
import vn.tizun.service.implement.FCMService;
import vn.tizun.service.implement.UserService;
import vn.tizun.utils.PasswordGenerator;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/instructor")
@AllArgsConstructor
public class InstructorRegistrationController {

    private final IInstructorRegistrationService instructorRegistrationService;
    private final FCMService fcmService;
    private final IUserService userService;
    private final IMailService mailService;

    @PostMapping("/request-register")
    public ResponseEntity<Object> requestRegitster(@RequestBody @Valid InstructorRegistrationRequest request){

        instructorRegistrationService.save(request);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.CREATED.value());
        result.put("message", "created successfully");
        result.put("data", "");

        fcmService.sendPushNotification(CommonConstants.ADMIN_ID,
                CommonConstants.NEW_INSTRUCTOR_REGISTRATION,
                "Đã có một đăng kí làm giảng viên mới. Vui lòng kiểm tra");

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PostMapping("/handleApplication")
    public ResponseEntity<Object> handleApplication(@RequestBody @Valid AccountRegisterForAdminRequest request,@RequestParam Long applicationId, @RequestParam boolean isAccepted){
        String passwordGenerator = PasswordGenerator.generateRandomPassword();
        if (isAccepted){
            long userId = userService.createUserAccountForAdmin(request, passwordGenerator);
            instructorRegistrationService.updateStatus(applicationId, isAccepted);
            mailService.sendMail_AccountRegister(request, passwordGenerator);
            fcmService.sendPushNotification(userId,
                    CommonConstants.NEW_INSTRUCTOR_REGISTRATION,
                    "Chào mừng bạn đã trở thành giảng viên của chúng tôi");
        }
        else {
            MailDataDto mailData = new MailDataDto();
            mailData.setTo(request.getEmail());
            mailData.setSubject(MailConstants.COMMON_TITLE);
            Map<String, Object> props = new HashMap<>();
            props.put("name", request.getFirstName());
            props.put("description", "Chúng tôi rất tiếc phải thông báo rằng hồ sơ của bạn hiện tại chưa đáp ứng đủ các tiêu chí để trở thành giảng viên trên hệ thống. Chúng tôi đánh giá cao sự quan tâm và mong muốn đồng hành của bạn. Bạn hoàn toàn có thể cập nhật thêm thông tin và nộp lại hồ sơ trong tương lai gần. Xin chân thành cảm ơn bạn đã dành thời gian và tin tưởng vào nền tảng của chúng tôi.");
            mailData.setProps(props);

            mailService.sendMail(mailData, MailConstants.TEMPLE_COMMON);
        }
        return new ResponseEntity<>("", HttpStatus.CREATED);
    }

    @GetMapping("/listApplication")
    public ResponseEntity<Object> listApplication(){

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "created successfully");
        result.put("data", instructorRegistrationService.getAll());

        fcmService.sendPushNotification(CommonConstants.ADMIN_ID,
                CommonConstants.NEW_INSTRUCTOR_REGISTRATION,
                "Đã có một đăng kí làm giảng viên mới. Vui lòng kiểm tra");

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}

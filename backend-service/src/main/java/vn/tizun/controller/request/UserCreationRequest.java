package vn.tizun.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import vn.tizun.common.Gender;
import vn.tizun.common.UserType;

import java.io.Serializable;
import java.util.Date;

@Getter
public class UserCreationRequest implements Serializable {
    @NotBlank(message = "firstname must be not blank")
    private String firstName;

    @NotBlank(message = "lastname must be not blank")
    private String lastName;
    private Gender gender;
    private Date birthday;
    private String username;

    @Email(message = "Email invalid")
    private String email;
    private String phone;
    private UserType type;
}

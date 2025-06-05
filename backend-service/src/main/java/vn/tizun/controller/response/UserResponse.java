package vn.tizun.controller.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import vn.tizun.common.Gender;
import vn.tizun.common.UserStatus;
import vn.tizun.common.UserType;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse implements Serializable {
    private Long id;
    private String firstName;
    private String lastName;
    private Gender gender;
    private Date birthday;
    private String username;
    private String email;
    private String phone;
    private String imageUrl;
    private UserStatus status;
    private UserType type;
    private String createdAt;

    @JsonProperty("fullName")
    public String getFullName() {
        return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
    }
}

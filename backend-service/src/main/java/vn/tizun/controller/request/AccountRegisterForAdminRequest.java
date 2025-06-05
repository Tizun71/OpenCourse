package vn.tizun.controller.request;

import lombok.Getter;
import lombok.Setter;
import vn.tizun.common.UserType;

@Setter
@Getter
public class AccountRegisterForAdminRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private UserType type;
}

package vn.tizun.controller.request;

import lombok.Getter;

@Getter
public class AccountRegisterRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
}

package vn.tizun.controller.request;

import lombok.Getter;

@Getter
public class SignInRequest {
    private String username;
    private String password;
//    private String platform; // web, mobile, tablet
//    private String deviceToken; // for push notify
//    private String versionApp;
}

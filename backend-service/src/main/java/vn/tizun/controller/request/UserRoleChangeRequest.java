package vn.tizun.controller.request;

import lombok.Getter;
import vn.tizun.common.UserType;

@Getter
public class UserRoleChangeRequest {
    private Long id;
    private String role;
}

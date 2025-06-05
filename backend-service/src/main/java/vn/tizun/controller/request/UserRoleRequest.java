package vn.tizun.controller.request;

import lombok.Getter;
import vn.tizun.common.UserType;

@Getter
public class UserRoleRequest {
    private Long userId;
    private UserType type;
}

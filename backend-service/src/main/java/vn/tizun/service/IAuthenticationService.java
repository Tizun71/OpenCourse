package vn.tizun.service;

import vn.tizun.controller.request.SignInRequest;
import vn.tizun.controller.response.TokenResponse;

public interface IAuthenticationService {
    TokenResponse getAccessToken(SignInRequest request);
    TokenResponse getRefreshToken(String request);

}

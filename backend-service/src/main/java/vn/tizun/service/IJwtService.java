package vn.tizun.service;

import org.springframework.security.core.GrantedAuthority;
import vn.tizun.common.TokenType;

import java.util.Collection;
import java.util.List;

public interface IJwtService {
    String generateAccessToken(long userId, String username, List<String> authorities);
    String generateRefreshToken(long userId, String username, List<String> authorities);
    String exactUsername(String token, TokenType type);
}

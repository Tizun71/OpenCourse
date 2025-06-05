package vn.tizun.service.implement;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import vn.tizun.repository.IUserRepository;

@Service
@RequiredArgsConstructor
public class UserServiceDetail {

    private final IUserRepository userRepository;

    public UserDetailsService UserServiceDetail() {
        return userRepository::findByUsername;
    }

}
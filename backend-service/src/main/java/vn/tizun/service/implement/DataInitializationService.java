package vn.tizun.service.implement;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.tizun.common.UserStatus;
import vn.tizun.common.UserType;
import vn.tizun.model.CategoryEntity;
import vn.tizun.model.Role;
import vn.tizun.model.UserEntity;
import vn.tizun.model.UserHasRole;
import vn.tizun.repository.ICategoryRepository;
import vn.tizun.repository.IRoleRepository;
import vn.tizun.repository.IUserHasRoleRepository;
import vn.tizun.repository.IUserRepository;

@Service
@AllArgsConstructor
public class DataInitializationService {
    private final IRoleRepository roleRepository;
    private final IUserRepository userRepository;
    private final ICategoryRepository categoryRepository;
    private final IUserHasRoleRepository userHasRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initRoles() {
        if (roleRepository.count() == 0) {
            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            adminRole.setDescription("Full access in system");
            roleRepository.save(adminRole);

            Role userRole = new Role();
            userRole.setName("USER");
            userRole.setDescription("User can learn and earn certificate");
            roleRepository.save(userRole);
            Role instructorRole = new Role();

            instructorRole.setName("INSTRUCTOR");
            instructorRole.setDescription("Instructor can create course");
            roleRepository.save(instructorRole);
        }

        if (userRepository.count() == 0){
            UserEntity user = new UserEntity();
            user.setFirstName("Admin");
            user.setLastName("ad");
            user.setUsername("admin");
            user.setType(UserType.ADMIN);
            user.setStatus(UserStatus.ACTIVE);
            user.setPassword(passwordEncoder.encode("admin"));
            userRepository.save(user);

            Role role = roleRepository.findByName("ADMIN");

            UserHasRole userHasRole = new UserHasRole();
            userHasRole.setUser(user);
            userHasRole.setRole(role);
            userHasRoleRepository.save(userHasRole);

            role = roleRepository.findByName("USER");

            userHasRole = new UserHasRole();
            userHasRole.setUser(user);
            userHasRole.setRole(role);
            userHasRoleRepository.save(userHasRole);

            role = roleRepository.findByName("INSTRUCTOR");

            userHasRole = new UserHasRole();
            userHasRole.setUser(user);
            userHasRole.setRole(role);
            userHasRoleRepository.save(userHasRole);
        }
    }

    @PostConstruct
    public void initCategories(){
        if (categoryRepository.count() == 0){
            CategoryEntity category = new CategoryEntity();
            category.setCategoryName("IT - Computer Science");
            category.setDescription("Bao gồm phần mềm, phần cứng, khoa học máy tính");
            categoryRepository.save(category);
        }
    }
}

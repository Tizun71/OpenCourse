package vn.tizun.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.tizun.service.ICategoryService;
import vn.tizun.service.ICourseService;
import vn.tizun.service.IUserService;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/statistic")
@AllArgsConstructor
public class StatisticController {

    private final IUserService userService;
    private final ICategoryService categoryService;
    private final ICourseService courseService;

    @GetMapping("/admin")
    public Map<String, Object> adminStat(){

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("totalLearners", userService.getTotalLearner());
        res.put("totalInstructors", userService.getTotalInstructor());
        res.put("totalCategories", categoryService.count());
        res.put("totalCourses", courseService.count());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.RESET_CONTENT.value());
        result.put("message", "Statistic Admin");
        result.put("data", res);

        return result;
    }
}

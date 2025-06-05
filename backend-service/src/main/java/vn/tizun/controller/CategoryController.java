package vn.tizun.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import vn.tizun.controller.request.CategoryCreationRequest;
import vn.tizun.controller.request.CategoryUpdateRequest;
import vn.tizun.controller.request.UserCreationRequest;
import vn.tizun.controller.request.UserUpdateRequest;
import vn.tizun.controller.response.CategoryPageResponse;
import vn.tizun.controller.response.CategoryResponse;
import vn.tizun.model.CategoryEntity;
import vn.tizun.service.ICategoryService;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/category")
@Tag(name = "Category Controller")
@Slf4j(topic = "CATEGORY-CONTROLLER")
@RequiredArgsConstructor
@Validated
public class CategoryController {
    private final ICategoryService categoryService;

    @Operation(summary = "Get category list", description = "API retrieve category from db")
    @GetMapping("/list")
    public Map<String, Object> getList(){
        log.info("Get category list");

        List<CategoryResponse> categoryList = categoryService.findAll();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "category list");
        result.put("data", categoryList);

        return result;
    }

    @Operation(summary = "Get category detail", description = "API retrieve category detail by ID")
    @GetMapping("/{categoryId}")
    public Map<String, Object> getUserDetail(@PathVariable @Min(value = 1, message = "CategoryID must be equal or greater than 1") Long categoryId){
        log.info("Get category detail by ID: {}", categoryId);

        CategoryResponse categoryDetail = categoryService.findById(categoryId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "category");
        result.put("data", categoryDetail);
        return result;
    }

    @Operation(summary = "Create Category", description = "API add new category to db")
    @PostMapping("/add")
//    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> createCategory(@RequestBody @Valid CategoryCreationRequest request){

        log.info("Creating new category");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.CREATED.value());
        result.put("message", "category created successfully");
        result.put("data", categoryService.save(request));

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @Operation(summary = "Update Category", description = "API update category to db")
    @PutMapping("/upd")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Map<String, Object> updateUser(@RequestBody CategoryUpdateRequest request){

        log.info("Updating category with id: {}", request.getId());

        categoryService.update(request);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.ACCEPTED.value());
        result.put("message", "category updated successfully");
        result.put("data", "");

        return result;
    }

    @Operation(summary = "Delete Category", description = "API inactivate category from db")
    @DeleteMapping("/del/{categoryId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Map<String, Object> deleteUser(@PathVariable  @Min(value = 1, message = "categoryId must be equals or greater than 1") Long categoryId){
        log.info("Deleting category: {}", categoryId);

        categoryService.delete(categoryId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.RESET_CONTENT.value());
        result.put("message", "category deleted successfully");
        result.put("data", "");

        return result;
    }
}

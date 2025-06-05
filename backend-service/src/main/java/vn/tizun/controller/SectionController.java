package vn.tizun.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import vn.tizun.controller.request.*;
import vn.tizun.controller.response.SectionResponse;
import vn.tizun.controller.response.SectionSelectResponse;
import vn.tizun.controller.response.UserPageResponse;
import vn.tizun.controller.response.UserResponse;
import vn.tizun.model.SectionEntity;
import vn.tizun.service.ISectionService;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/section")
@Tag(name = "Section Controller")
@Slf4j(topic = "SECTION-CONTROLLER")
@RequiredArgsConstructor
@Validated
public class SectionController {
    private final ISectionService sectionService;

    @Operation(summary = "Get section list", description = "API retrieve section of course from db")
    @GetMapping("/list")
    public Map<String, Object> getList(@RequestParam(required = true) Long courseId
    ){
        log.info("Get section list");

        List<SectionResponse> sections = sectionService.listDetail(courseId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "section list");
        result.put("data", sections);

        return result;
    }

    @Operation(summary = "Get section list", description = "API retrieve section of course from db")
    @GetMapping("/list-select")
    public Map<String, Object> getListSelect(@RequestParam(required = true) Long courseId
    ){
        log.info("Get section list");

        List<SectionSelectResponse> sections = sectionService.list(courseId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.OK.value());
        result.put("message", "section list");
        result.put("data", sections);

        return result;
    }


    @Operation(summary = "Create Section", description = "API add new section to db")
    @PostMapping("/add")
    public ResponseEntity<Object> createSection(@RequestBody @Valid SectionCreationRequest request){

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.CREATED.value());
        result.put("message", "section created successfully");
        result.put("data", sectionService.save(request));

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @Operation(summary = "Update Section", description = "API update section to db")
    @PutMapping("/upd")
    public Map<String, Object> updateUser(@RequestBody @Valid SectionUpdateRequest request){

        log.info("Updating section");
        sectionService.update(request);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.ACCEPTED.value());
        result.put("message", "user updated successfully");
        result.put("data", "");

        return result;
    }

    @Operation(summary = "Delete Section", description = "API soft deleted section from db")
    @DeleteMapping("/del/{sectionId}")
    public Map<String, Object> deleteUser(@PathVariable @Min(value = 1, message = "sectionId must be equals or greater than 1") Long sectionId){
        log.info("Deleting user: {}", sectionId);

        sectionService.delete(sectionId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", HttpStatus.RESET_CONTENT.value());
        result.put("message", "user deleted successfully");
        result.put("data", "");

        return result;
    }
}

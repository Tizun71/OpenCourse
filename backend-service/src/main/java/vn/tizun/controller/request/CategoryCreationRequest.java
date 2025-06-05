package vn.tizun.controller.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.io.Serializable;

@Getter
public class CategoryCreationRequest implements Serializable {
    @NotBlank(message = "category name must be not blank")
    private String categoryName;

    private String description;
}

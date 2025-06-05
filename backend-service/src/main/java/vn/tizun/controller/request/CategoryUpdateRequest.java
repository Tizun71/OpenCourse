package vn.tizun.controller.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class CategoryUpdateRequest implements Serializable {
    @NotNull(message = "Id must be not null")
    @Min(value = 1, message = "categoryId must be equals or greater than 1")
    private Long id;

    @NotBlank(message = "category name must be not blank")
    private String categoryName;

    private String description;
}

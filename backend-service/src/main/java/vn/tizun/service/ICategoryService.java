package vn.tizun.service;

import vn.tizun.controller.request.CategoryCreationRequest;
import vn.tizun.controller.request.CategoryUpdateRequest;
import vn.tizun.controller.response.CategoryPageResponse;
import vn.tizun.controller.response.CategoryResponse;
import vn.tizun.model.CategoryEntity;

import java.util.List;

public interface ICategoryService {
    List<CategoryResponse> findAll();
    CategoryResponse findById(Long id);
    CategoryResponse findByCategoryName(String categoryName);
    long save(CategoryCreationRequest req);
    void update(CategoryUpdateRequest req);
    void delete(Long id);
    int count();
}

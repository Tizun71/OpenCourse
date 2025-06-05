package vn.tizun.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.tizun.controller.request.LessonCreationRequest;
import vn.tizun.controller.request.LessonUpdateRequest;
import vn.tizun.controller.response.LessonPageResponse;
import vn.tizun.controller.response.LessonResponse;

@Service
public interface ILessonService {
    LessonPageResponse findAll(String keyword, String sort, int page, int size);
    LessonResponse findById(Long id);
    LessonResponse findByLessonName(String LessonName);
    long save(LessonCreationRequest req);
    void update(LessonUpdateRequest req);
    void delete(Long id);
    void addLessonCompleted(Long userId, Long lessonId);
}

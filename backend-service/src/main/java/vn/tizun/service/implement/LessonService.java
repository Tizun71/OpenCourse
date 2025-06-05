package vn.tizun.service.implement;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.tizun.controller.request.LessonCreationRequest;
import vn.tizun.controller.request.LessonUpdateRequest;
import vn.tizun.controller.response.LessonPageResponse;
import vn.tizun.controller.response.LessonResponse;
import vn.tizun.exception.ResourceNotFoundException;
import vn.tizun.model.LessonCompletion;
import vn.tizun.model.LessonEntity;
import vn.tizun.model.SectionEntity;
import vn.tizun.model.UserEntity;
import vn.tizun.repository.ILessonCompletionRepository;
import vn.tizun.repository.ILessonRepository;
import vn.tizun.repository.ISectionRepository;
import vn.tizun.repository.IUserRepository;
import vn.tizun.service.ILessonService;
import vn.tizun.service.IS3Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LessonService implements ILessonService {

    private final ILessonRepository lessonRepository;
    private final ISectionRepository sectionRepository;
    private final ILessonCompletionRepository lessonCompletionRepository;
    private final IUserRepository userRepository;

    @Override
    public LessonPageResponse findAll(String keyword, String sort, int page, int size) {
        return null;
    }

    @Override
    public LessonResponse findById(Long id) {
        LessonEntity lesson = getLessonEntity(id);
        return LessonResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .content(lesson.getContent())
                .videoUrl(lesson.getVideoUrl())
                .build();
    }

    @Override
    public LessonResponse findByLessonName(String LessonName) {
        return null;
    }

    @Override
    public long save(LessonCreationRequest req) {
        LessonEntity lesson = new LessonEntity();
        lesson.setTitle(req.getTitle());
        lesson.setContent(req.getContent());
        lesson.setVideoUrl(req.getVideoUrl());
        Optional<SectionEntity> section = sectionRepository.findById(req.getSectionId());
        lesson.setSection(section.get());

        lesson.setPosition(lessonRepository.findMaxPosition() + 1);

        lessonRepository.save(lesson);
        log.info("Saved lesson: {}", lesson);

        return lesson.getId();
    }

    @Override
    public void update(LessonUpdateRequest req) {

        LessonEntity lesson = getLessonEntity(req.getId());

        lesson.setTitle(req.getTitle());
        lesson.setContent(req.getContent());
        lesson.setPosition(req.getPosition());

        lessonRepository.save(lesson);
        log.info("Updated lesson:{}", lesson);

    }

    @Override
    public void delete(Long id) {
        LessonEntity lesson = getLessonEntity(id);
        lessonRepository.delete(lesson);
    }

    @Override
    public void addLessonCompleted(Long userId, Long lessonId) {
        LessonCompletion lessonCompletion = new LessonCompletion();
        LessonEntity lesson = getLessonEntity(lessonId);
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        lessonCompletion.setLesson(lesson);
        lessonCompletion.setUser(user);
        lessonCompletionRepository.save(lessonCompletion);
    }

    private LessonEntity getLessonEntity(Long id){
        return lessonRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
    }


}

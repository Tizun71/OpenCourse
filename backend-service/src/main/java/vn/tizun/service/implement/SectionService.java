package vn.tizun.service.implement;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import vn.tizun.controller.request.SectionCreationRequest;
import vn.tizun.controller.request.SectionUpdateRequest;
import vn.tizun.controller.response.LessonResponse;
import vn.tizun.controller.response.SectionResponse;
import vn.tizun.controller.response.SectionSelectResponse;
import vn.tizun.exception.ResourceNotFoundException;
import vn.tizun.model.CourseEntity;
import vn.tizun.model.SectionEntity;
import vn.tizun.repository.ICourseRepository;
import vn.tizun.repository.ISectionRepository;
import vn.tizun.service.ISectionService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SectionService implements ISectionService {

    private final ISectionRepository sectionRepository;
    private final ICourseRepository courseRepository;

    @Override
    public List<SectionResponse> listDetail(Long courseId) {
        List<SectionEntity> sections = sectionRepository.findAllByCourseId(courseId);
        List<SectionResponse> sectionResponses = new ArrayList<>();

        for (var section : sections){
            List<LessonResponse> lessonResponses = section.getLessons().stream()
                    .map(lesson -> LessonResponse.builder()
                            .id(lesson.getId())
                            .title(lesson.getTitle())
                            .content(lesson.getContent())
                            .videoUrl(lesson.getVideoUrl())
                            .position(lesson.getPosition())
                            .build())
                    .collect(Collectors.toList());

            var sr = SectionResponse.builder()
                    .id(section.getId())
                    .title(section.getTitle())
                    .position(section.getPosition())
                    .lessons(lessonResponses)
                    .build();
            sectionResponses.add(sr);
        }
        return sectionResponses;
    }

    @Override
    public List<SectionSelectResponse> list(Long courseId) {
        return sectionRepository.findAllByCourseId(courseId)
                .stream()
                .map(section -> SectionSelectResponse.builder()
                        .id(section.getId())
                        .title(section.getTitle())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public long save(SectionCreationRequest req) {

        SectionEntity section = new SectionEntity();
        section.setTitle(req.getTitle());
        section.setPosition(sectionRepository.findMaxPosition() + 1);

        Optional<CourseEntity> course = courseRepository.findById(req.getCourseId());
        section.setCourse(course.get());

        sectionRepository.save(section);

        return section.getId();
    }

    @Override
    public void update(SectionUpdateRequest req) {
        SectionEntity section = getSectionEntity(req.getId());
        section.setTitle(req.getTitle());
        section.setPosition(req.getPosition());

        sectionRepository.save(section);
    }

    @Override
    public void delete(Long id) {
        SectionEntity section = getSectionEntity(id);
        sectionRepository.delete(section);
    }

    private SectionEntity getSectionEntity(Long id){
        return sectionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Section not found"));
    }
}

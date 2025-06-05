package vn.tizun.controller.response;

import lombok.Getter;
import lombok.Setter;
import vn.tizun.common.EnrollmentStatus;

import java.util.List;

@Getter
@Setter
public class CourseProgressReponse {
    private float progress;
    private int completedLessons;
    private int totalLessons;
    private List<LessonCompletedResponse> completedLesson;
    private EnrollmentStatus status;
}

--Trigger tính lại số người đăng ký khi có người đăng ký hoặc hủy đăng ký
CREATE OR REPLACE FUNCTION update_total_enrollments()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tbl_course
    SET number_of_register = (
        SELECT COUNT(*)
        FROM tbl_enrollment
        WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
    )
    WHERE id = COALESCE(NEW.course_id, OLD.course_id);

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_update_enrollments
AFTER INSERT OR DELETE OR UPDATE ON tbl_enrollment
FOR EACH ROW
EXECUTE FUNCTION update_total_enrollments();

--Trigger tính progress trong bảng enrollment khi user học xong 1 bài học
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
    v_course_id INTEGER;
    v_enrollment_id INTEGER;
    total_lessons INTEGER;
    completed_lessons INTEGER;
BEGIN
    SELECT s.course_id INTO v_course_id
    FROM tbl_lesson l
    JOIN tbl_section s ON l.section_id = s.id
    WHERE l.id = NEW.lesson_id;

    SELECT id INTO v_enrollment_id
    FROM tbl_enrollment
    WHERE user_id = NEW.user_id AND course_id = v_course_id;

    IF v_enrollment_id IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT COUNT(*) INTO total_lessons
    FROM tbl_lesson l
    JOIN tbl_section s ON l.section_id = s.id
    WHERE s.course_id = v_course_id;

    IF total_lessons = 0 THEN
        RETURN NEW;
    END IF;

    SELECT COUNT(*) INTO completed_lessons
    FROM tbl_lesson_completion c
    JOIN tbl_lesson l ON c.lesson_id = l.id
    JOIN tbl_section s ON l.section_id = s.id
    WHERE c.user_id = NEW.user_id AND s.course_id = v_course_id;

    UPDATE tbl_enrollment
    SET progress = ROUND((completed_lessons::numeric / total_lessons) * 100)
    WHERE id = v_enrollment_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_progress_after_completion
AFTER INSERT ON tbl_lesson_completion
FOR EACH ROW
EXECUTE FUNCTION update_enrollment_progress();
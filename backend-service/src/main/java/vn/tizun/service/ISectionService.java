package vn.tizun.service;


import vn.tizun.controller.request.SectionCreationRequest;
import vn.tizun.controller.request.SectionUpdateRequest;
import vn.tizun.controller.response.SectionResponse;
import vn.tizun.controller.response.SectionSelectResponse;

import java.util.List;

public interface ISectionService {
    List<SectionResponse> listDetail(Long courseId);
    List<SectionSelectResponse> list(Long courseId);
    long save(SectionCreationRequest req);
    void update(SectionUpdateRequest req);
    void delete(Long id);
}

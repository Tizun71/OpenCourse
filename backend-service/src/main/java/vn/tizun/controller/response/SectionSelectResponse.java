package vn.tizun.controller.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
public class SectionSelectResponse {
    private Long id;
    private String title;
}

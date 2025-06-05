package vn.tizun.controller.request;

import lombok.Getter;

@Getter
public class SectionUpdateRequest {
    private Long id;
    private String title;
    private int position;
}

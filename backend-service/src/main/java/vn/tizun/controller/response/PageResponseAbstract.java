package vn.tizun.controller.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class PageResponseAbstract {
    private int pageNumber;
    private int pageSize;
    private int totalPages;
    private long totalElements;
}

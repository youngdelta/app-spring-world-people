package com.example.worldpopulation.config.annotation;

public interface Pageable {
    Integer getPageNum();
    Integer getPageSize();
    void setPageNum(Integer pageNum);
    void setPageSize(Integer pageSize);
}
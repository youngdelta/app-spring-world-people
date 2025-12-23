package com.example.worldpopulation.config.aop;

import java.lang.reflect.Method;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.example.worldpopulation.config.annotation.Pageable;
import com.example.worldpopulation.config.annotation.PageableQuery;
import com.github.pagehelper.PageHelper;

import lombok.extern.slf4j.Slf4j;

/**
 * PageHelper 자동 적용 AOP
 * @PageableQuery 어노테이션이 붙은 메서드 실행 전에 자동으로 PageHelper.startPage()를 호출
 */
@Slf4j
@Aspect
@Component
@Order(1)  // 트랜잭션보다 먼저 실행되어야 함
public class PageHelperAspect {
    
    @Around("@annotation(com.example.worldpopulation.config.annotation.PageableQuery)")
    public Object handlePaging(ProceedingJoinPoint joinPoint) throws Throwable {
        
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        PageableQuery pageableQuery = method.getAnnotation(PageableQuery.class);

        // 메서드 파라미터에서 Pageable 구현체 찾기
        Object[] args = joinPoint.getArgs();
        Pageable pageableParam = findPageableParam(args);
        
        if (pageableParam != null) {
            // 페이징 파라미터 검증 및 설정
            Integer pageNum = validateAndGetPageNum(
                pageableParam.getPageNum(), 
                pageableQuery.defaultPageNum()
            );
            
            Integer pageSize = validateAndGetPageSize(
                pageableParam.getPageSize(), 
                pageableQuery.defaultPageSize(),
                pageableQuery.maxPageSize()
            );
            
            // PageHelper 시작
            PageHelper.startPage(pageNum, pageSize);
            
            log.debug("PageHelper AOP 적용 - Method: {}, PageNum: {}, PageSize: {}", method.getName(), pageNum, pageSize);
        } else {
            // Pageable 파라미터가 없으면 기본값 사용
            PageHelper.startPage(
                pageableQuery.defaultPageNum(), 
                pageableQuery.defaultPageSize()
            );
            
            log.debug("PageHelper AOP 적용 (기본값) - Method: {}, PageNum: {}, PageSize: {}", method.getName(), pageableQuery.defaultPageNum(), pageableQuery.defaultPageSize());
        }
        
        try {
            // 실제 메서드 실행
            return joinPoint.proceed();
        } finally {
            // PageHelper ThreadLocal 정리 (선택사항, PageHelper가 자동으로 정리함)
            PageHelper.clearPage();
        }
    }
    
    /**
     * 메서드 파라미터에서 Pageable 구현체 찾기
     */
    private Pageable findPageableParam(Object[] args) {
        if (args == null || args.length == 0) {
            return null;
        }
        
        for (Object arg : args) {
            if (arg instanceof Pageable) {
                return (Pageable) arg;
            }
        }
        return null;
    }
    
    /**
     * 페이지 번호 검증
     */
    private Integer validateAndGetPageNum(Integer pageNum, int defaultPageNum) {
        if (pageNum == null || pageNum < 1) {
            return defaultPageNum;
        }
        return pageNum;
    }
    
    /**
     * 페이지 크기 검증
     */
    private Integer validateAndGetPageSize(Integer pageSize, int defaultPageSize, int maxPageSize) {
        if (pageSize == null || pageSize < 1) {
            return defaultPageSize;
        }
        if (pageSize > maxPageSize) {
            log.warn("요청한 pageSize({})가 최대값({})을 초과하여 최대값으로 조정됩니다.", 
                    pageSize, maxPageSize);
            return maxPageSize;
        }
        return pageSize;
    }
}
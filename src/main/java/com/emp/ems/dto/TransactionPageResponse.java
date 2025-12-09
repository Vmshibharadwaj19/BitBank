package com.emp.ems.dto;

import java.util.List;
import com.emp.ems.entities.Transaction;

public class TransactionPageResponse {
    private List<Transaction> content;
    private int totalPages;
    private long totalElements;
    private int currentPage;
    private int pageSize;
    private boolean hasNext;
    private boolean hasPrevious;

    public TransactionPageResponse(List<Transaction> content, int totalPages, 
                                   long totalElements, int currentPage, 
                                   int pageSize, boolean hasNext, boolean hasPrevious) {
        this.content = content;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
    }

    // Getters
    public List<Transaction> getContent() { return content; }
    public int getTotalPages() { return totalPages; }
    public long getTotalElements() { return totalElements; }
    public int getCurrentPage() { return currentPage; }
    public int getPageSize() { return pageSize; }
    public boolean isHasNext() { return hasNext; }
    public boolean isHasPrevious() { return hasPrevious; }
}


package com.algo.Complaint_register.dto;

public class UserStatsDTO {

    private long total;
    private long submitted;
    private long assigned;
    private long inProgress;
    private long resolved;
    private long closed;

    public UserStatsDTO(long total, long submitted, long assigned,
                        long inProgress, long resolved, long closed) {
        this.total = total;
        this.submitted = submitted;
        this.assigned = assigned;
        this.inProgress = inProgress;
        this.resolved = resolved;
        this.closed = closed;
    }

    public long getTotal() { return total; }
    public long getSubmitted() { return submitted; }
    public long getAssigned() { return assigned; }
    public long getInProgress() { return inProgress; }
    public long getResolved() { return resolved; }
    public long getClosed() { return closed; }
}
package com.algo.Complaint_register.service;

import com.algo.Complaint_register.util.RedisUtil;
import org.springframework.stereotype.Service;

@Service
public class JwtBlacklistService {

    private final RedisUtil redisUtil;
    private static final String PREFIX = "JWT_BLACKLIST:";

    public JwtBlacklistService(RedisUtil redisUtil) {
        this.redisUtil = redisUtil;
    }

    public void blacklistToken(String token, long expirationMillis) {
        redisUtil.set(
                PREFIX + token,
                "BLACKLISTED",
                expirationMillis / 1000
        );
    }

    public boolean isBlacklisted(String token) {
        return redisUtil.exists(PREFIX + token);
    }
}
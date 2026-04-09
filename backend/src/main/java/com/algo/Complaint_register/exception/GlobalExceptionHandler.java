package com.algo.Complaint_register.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestControllerAdvice   // ✅ IMPORTANT (instead of @ControllerAdvice)
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ===============================
    // Resource Not Found
    // ===============================
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> resourceNotFoundHandler(ResourceNotFoundException ex) {

        Map<String, Object> error = new HashMap<>();
        error.put("message", ex.getMessage());

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // ===============================
    // Validation Errors
    // ===============================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validationErrorHandling(MethodArgumentNotValidException ex) {

        Map<String, String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        field -> field.getField(),
                        field -> field.getDefaultMessage()
                ));

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // ===============================
    // OTP / Business Logic Errors
    // ===============================
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {

        Map<String, Object> error = new HashMap<>();
        error.put("message", ex.getMessage());

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST); // ✅ 400 instead of 500
    }

    // ===============================
    // Catch All (Fallback)
    // ===============================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex) {

        logger.error("Unhandled exception: ", ex);

        Map<String, Object> error = new HashMap<>();
        error.put("message", "Something went wrong");

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
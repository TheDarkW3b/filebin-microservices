package com.filebin.user_service.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class WrongFileExtensionException extends RuntimeException{
        String message;
}

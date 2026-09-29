package com.rythufresh.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin(origins = "*")
public class ImageController {

    private static final String UPLOAD_DIR =
            "src/main/resources/static/images/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file)
            throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No File Selected");
        }

        File directory = new File(UPLOAD_DIR);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        Path path = Paths.get(UPLOAD_DIR + file.getOriginalFilename());

        Files.write(path, file.getBytes());

        return ResponseEntity.ok(file.getOriginalFilename());
    }

}
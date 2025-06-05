package vn.tizun.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.tizun.service.IS3Service;
import vn.tizun.service.implement.S3Service;

import java.io.IOException;

@RestController
@RequestMapping("/s3/upload")
@RequiredArgsConstructor
public class VideoUploadController {

    private final IS3Service s3Service;

    @PostMapping("/video")
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file) {
            String fileUrl = s3Service.uploadFileToS3("video", file);
            return ResponseEntity.ok().body(fileUrl);
    }

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        String fileUrl = s3Service.uploadFileToS3("image", file);
        return ResponseEntity.ok().body(fileUrl);
    }

}


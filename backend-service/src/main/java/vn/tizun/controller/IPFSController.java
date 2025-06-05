package vn.tizun.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.tizun.service.implement.IPFSService;

@RestController
@RequestMapping("/ipfs")
@Tag(name = "IPFS Controller")
@Slf4j(topic = "IPFS-CONTROLLER")
@Validated
@RequiredArgsConstructor
public class IPFSController {

    @Autowired
    private final IPFSService ipfsService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        log.info("Upload file");

        String ipfsHash = ipfsService.uploadToIPFS(file);
        if (ipfsHash != null) {
            return ResponseEntity.ok(ipfsHash);
        } else {
            return ResponseEntity.status(500).body("Upload to IPFS failed.");
        }
    }

    @PostMapping("/upload-json")
    public ResponseEntity<String> uploadJSON(@RequestBody String jsonData) {
        String ipfsHash = ipfsService.uploadJSONToIPFS(jsonData);
        log.info(ipfsHash);
        if (ipfsHash != null) {
            return ResponseEntity.ok(ipfsHash);
        } else {
            return ResponseEntity.status(500).body("Upload JSON to IPFS failed.");
        }
    }

}

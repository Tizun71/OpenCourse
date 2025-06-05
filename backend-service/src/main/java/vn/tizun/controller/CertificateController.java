package vn.tizun.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import vn.tizun.common.CommonConstants;
import vn.tizun.common.EnrollmentStatus;
import vn.tizun.common.MailConstants;
import vn.tizun.controller.request.CertificateGenerateRequest;
import vn.tizun.controller.request.CertificateVerifyRequest;
import vn.tizun.service.IMailService;
import vn.tizun.service.IS3Service;
import vn.tizun.service.dto.MailDataDto;
import vn.tizun.service.dto.MetadataDto;
import vn.tizun.service.implement.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/certificate")
@AllArgsConstructor
public class CertificateController {
    private CertificateService certificateService;
    private IPFSService ipfsService;
    private EthereumService ethereumService;
    private IS3Service s3Service;
    private FCMService fcmService;
    private CourseService courseService;
    private EnrollmentService enrollmentService;
    private QrCodeService qrCodeService;

    private IMailService mailService;

    @PostMapping("/generate")
    public ResponseEntity<String> getCertificate(@RequestBody CertificateGenerateRequest request) {
        try {
            byte[] imageBytes = certificateService.generateCertificateImage(request);
//            String fileName = "certificate_" + request.getFamilyName() + ".png";
//            String image_url = ipfsService.uploadImageByteToIPFS(imageBytes, fileName);
//            String ipfs_url = ipfsService.uploadJSONToIPFS(certificateService.generateNftMetadata(request, image_url));
            String url = s3Service.uploadByteToS3("/certificate", imageBytes);
//            return ResponseEntity.ok(ipfs_url);
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

//    @PostMapping("/generate-metadata")
//    public ResponseEntity<String> getMetadata(@RequestBody CertificateGenerateRequest request) {
//        try {
//            return ResponseEntity.ok(certificateService.generateNftMetadata(request, "123"));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
    @PostMapping("/verify-metadata")
    public ResponseEntity<String> verifyMetadata(@RequestBody CertificateVerifyRequest request) {
        try {
//            String message = "123";
            String pubKey = "0x04ff39bec5fb55df625407ce152336fb51cbfcca7bbfaf40a79e19525621f2a83cd4cfa42483b25e09551dcf53565d24a0e1e9f0438ce5e2dd5fa9fad288947184";
//            String signature = "304502210081ef99944f6cbc69acdfbadfdf3c1e74fb4d6c2b300d334c25eff5232d6c2efa022079473573f258433e8bdb58902e2210f1386173701eb9b80ca9f020c0f9bf2e94";
            boolean isValid = certificateService.verifySignature(request.getMessage(), request.getSignature(), pubKey);
            System.out.println("Valid? " + isValid);
            return ResponseEntity.ok(Boolean.toString(isValid));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/mint")
    public ResponseEntity<?> mintNft(@RequestBody CertificateGenerateRequest request) {
        try {
            enrollmentService.updateStatus(request.getUserId(), request.getCourseId(), EnrollmentStatus.COMPLETED);

            // Generate chứng chỉ image
            byte[] imageBytes = certificateService.generateCertificateImage(request);
            // Đẩy image lên S3
            String cer_url_name = s3Service.uploadByteToS3("certificate", imageBytes);
            //  Tạo file metadata và upload lên Pinata
            String cer_url = "https://kltn-mooc-blockchain.s3.ap-southeast-1.amazonaws.com/" + cer_url_name;
            MetadataDto metadataDto = certificateService.generateNftMetadata(request, cer_url);
            String ipfs_url = ipfsService.uploadJSONToIPFS(metadataDto.getBeautyMetadata());
            // Call Mint tại Smart Contract
            String hashContent = certificateService.SHA256Converter(metadataDto.getRealMetadata());
            System.out.println(hashContent);
            String txHash = ethereumService.callMintFromBlockchain(request.getWalletAddress(), ipfs_url, hashContent);

            // Gửi Mail cho người học
            MailDataDto mailData = new MailDataDto();
            mailData.setTo(request.getEmail());
            mailData.setSubject(MailConstants.CERTIFICATE_MINT);
            Map<String, Object> props = new HashMap<>();
            props.put("name", request.getFullName());
            props.put("certificateImageUrl", cer_url);
            props.put("blockchainLink", "https://sepolia.etherscan.io/tx/"+txHash);
            mailData.setProps(props);

            mailService.sendMail(mailData, MailConstants.TEMPLATE_CERTIFICATE_MINT);
            // Gửi thông báo cho người học
            fcmService.sendPushNotification(request.getUserId(),
                    CommonConstants.CERTIFICATE_CREATED,
                    "Chứng chỉ " + courseService.findById(request.getCourseId()).getCourseName() + " của bạn đã được tạo. Vui lòng kiểm tra Email");

            //Set trạng thái hoàn thành khóa học
            return ResponseEntity.ok("Mint thành công! TxHash: " + txHash);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi mint NFT: " + e.getMessage());
        }
    }

    @PostMapping("/hash")
    public ResponseEntity<?> hash(@RequestBody Map<String, Object> content) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        String normalizedJson = mapper.writeValueAsString(content);
        String hash = certificateService.SHA256Converter(normalizedJson);
        return ResponseEntity.ok(Map.of("hash", hash));
    }

//    @PostMapping("/test")
//    public ResponseEntity<?> test(@RequestBody CertificateGenerateRequest request) throws Exception {
//
//        String jsonData = certificateService.generateNftMetadata(request, "123");
//        return ResponseEntity.ok(certificateService.SHA256Converter(jsonData));
//    }
}

package vn.tizun.service.implement;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Service
public class IPFSService {
    @Value("${pinata.api.key}")
    private String apiKey;

    @Value("${pinata.api.secret}")
    private String apiSecret;

    @Value("${pinata.base.url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String uploadToIPFS(MultipartFile file) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("pinata_api_key", apiKey);
            headers.set("pinata_secret_api_key", apiSecret);
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            Map<String, Object> body = new HashMap<>();
            body.put("file", file.getBytes());

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    baseUrl + "/pinning/pinFileToIPFS",
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                assert responseBody != null;
                return "ipfs://" + responseBody.get("IpfsHash");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String uploadJSONToIPFS(String jsonData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("pinata_api_key", apiKey);
            headers.set("pinata_secret_api_key", apiSecret);
            headers.setContentType(MediaType.APPLICATION_JSON);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode contentNode = mapper.readTree(jsonData);

            Map<String, Object> body = new HashMap<>();
            body.put("pinataContent", contentNode);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    baseUrl + "/pinning/pinJSONToIPFS",
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                assert responseBody != null;
                return "ipfs://" + responseBody.get("IpfsHash");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String uploadImageByteToIPFS(byte[] imageBytes, String fileName) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("pinata_api_key", apiKey);
            headers.set("pinata_secret_api_key", apiSecret);
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Tạo ByteArrayResource đại diện cho file
            ByteArrayResource byteArrayResource = new ByteArrayResource(imageBytes) {
                @Override
                public String getFilename() {
                    return fileName;
                }
            };

            // Metadata chứa thông tin folder (Pinata sẽ hiểu đây là thư mục ảo)
            Map<String, Object> metadataMap = new HashMap<>();
            metadataMap.put("name", fileName); // file nằm trong folder "certificate"

            HttpHeaders metadataHeaders = new HttpHeaders();
            metadataHeaders.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> metadataEntity = new HttpEntity<>(
                    new ObjectMapper().writeValueAsString(metadataMap), metadataHeaders
            );

            // Body multipart
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", byteArrayResource);
            body.add("pinataMetadata", metadataEntity);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    baseUrl + "/pinning/pinFileToIPFS",
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                assert responseBody != null;
                return "ipfs://" + responseBody.get("IpfsHash");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}

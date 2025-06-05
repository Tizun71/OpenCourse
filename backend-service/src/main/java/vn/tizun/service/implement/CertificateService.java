package vn.tizun.service.implement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import org.bouncycastle.crypto.params.ECDomainParameters;
import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECParameterSpec;
import org.bouncycastle.jce.spec.ECPrivateKeySpec;
import org.bouncycastle.jce.spec.ECPublicKeySpec;
import org.bouncycastle.math.ec.ECPoint;
import org.bouncycastle.util.encoders.Hex;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import vn.tizun.controller.request.CertificateGenerateRequest;
import vn.tizun.exception.ResourceNotFoundException;
import vn.tizun.model.CertificateEntity;
import vn.tizun.model.CourseEntity;
import vn.tizun.repository.ICourseRepository;
import vn.tizun.service.dto.MetadataDto;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.interfaces.ECPrivateKey;
import java.security.interfaces.ECPublicKey;
import java.time.Instant;
import java.util.Arrays;

@Service
public class CertificateService {

    @Value("${eth.walletPrivateKey}")
    private String walletPrivateKey;

    private final ICourseRepository courseRepository;

    public CertificateService(ICourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public byte[] generateCertificateImage(CertificateGenerateRequest request) throws Exception {
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("templates/certificate-template.png");
        if (inputStream == null) {
            throw new FileNotFoundException("Không tìm thấy ảnh mẫu chứng chỉ!");
        }

        BufferedImage image = ImageIO.read(inputStream);

        Graphics2D g2d = image.createGraphics();

        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        InputStream fontStream = getClass().getClassLoader().getResourceAsStream("fonts/GreatVibes-Regular.ttf");
        Font customFont = Font.createFont(Font.TRUETYPE_FONT, fontStream).deriveFont(64f);
        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        ge.registerFont(customFont);
        g2d.setFont(customFont);
        g2d.setColor(Color.BLACK);

        FontMetrics metrics = g2d.getFontMetrics();
        int x = (image.getWidth() - metrics.stringWidth(request.getFullName())) / 2;
        int y = 450;
        g2d.drawString(request.getFullName(), x, y);

        CourseEntity course = courseRepository.findById(request.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        int xCourseName = (image.getWidth() - metrics.stringWidth(course.getCourseName())) / 2;
        int yCourseName = y + 160;
        g2d.drawString(course.getCourseName(), xCourseName, yCourseName);

        int xInstructor = (image.getWidth() - metrics.stringWidth(course.getCourseName())) / 2 - 150;
        int yInstructor = y + 230;
        g2d.drawString(course.getUser().getFirstName(), xInstructor, yInstructor);
        g2d.dispose();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        return baos.toByteArray();
    }

    public MetadataDto generateNftMetadata(CertificateGenerateRequest request, String certificateImageUrl) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode metadata = mapper.createObjectNode();

        CourseEntity course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        metadata.put("name", "Chứng chỉ " + course.getCourseName());
        metadata.put("description", "chứng nhận đã hoàn thành khóa học " + course.getCourseName() + " trên nền tảng Open Course của học viên " + request.getFullName());
        metadata.put("image", certificateImageUrl);

        ArrayNode content = mapper.createArrayNode();
        content.add(createAttribute(mapper, "Learner", request.getFullName()));
        content.add(createAttribute(mapper, "Course Name", course.getCourseName()));
        content.add(createAttribute(mapper, "Category", course.getCategory().getCategoryName()));
        content.add(createAttribute(mapper, "Level", course.getCourseLevel().toString()));
        content.add(createAttribute(mapper, "IssuedAt", Instant.now().toString()));
        content.add(createAttribute(mapper, "Instructor", course.getUser().getFirstName() + " " + course.getUser().getLastName()));

        metadata.set("attributes", content);
        metadata.put("IssuerAddress", "0xc8De4Aa71cF5767f0D7D5a649b58B2BeA9afC370");
        metadata.put("OwnerAddress", request.getWalletAddress());
        metadata.put("HashAlgorithm", "SHA256");

        try {
            MetadataDto metadataDto = new MetadataDto();
            ObjectWriter writer = mapper.writerWithDefaultPrettyPrinter();
            metadataDto.setRealMetadata(mapper.writeValueAsString(metadata));
            metadataDto.setBeautyMetadata(writer.writeValueAsString(metadata));
            return metadataDto;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    private ObjectNode createAttribute(ObjectMapper mapper, String traitType, String value) {
        ObjectNode attribute = mapper.createObjectNode();
        attribute.put("trait_type", traitType);
        attribute.put("value", value);
        return attribute;
    }

    public String SHA256Converter(String text){
        System.out.println(text);
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(text.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                hexString.append(String.format("%02x", b));
            }
            System.out.println(hexString.toString());
            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    public static byte[] signMessage(String message, String hexPrivateKey) throws Exception {
        Security.addProvider(new BouncyCastleProvider());
        ECPrivateKey privateKey = getEcPrivateKeyFromHex(hexPrivateKey);
        Signature signature = Signature.getInstance("SHA256withECDSA", "BC");

        String prefix = "\u0019Ethereum Signed Message:\n" + message.length();
        String ethMessage = prefix + message;

        signature.initSign(privateKey);
        signature.update(ethMessage.getBytes(StandardCharsets.UTF_8));

        return signature.sign();
    }

    public static ECPrivateKey getEcPrivateKeyFromHex(String hexPrivateKey) throws Exception {
        Security.addProvider(new BouncyCastleProvider());

        BigInteger privateKeyInt = new BigInteger(hexPrivateKey, 16);
        ECParameterSpec ecSpec = ECNamedCurveTable.getParameterSpec("secp256k1");

        ECPrivateKeySpec privateKeySpec = new ECPrivateKeySpec(privateKeyInt, ecSpec);
        KeyFactory keyFactory = KeyFactory.getInstance("EC", "BC");

        return (ECPrivateKey) keyFactory.generatePrivate(privateKeySpec);
    }

    public static boolean verifySignature(String message, String signatureBytes, String hexPublicKey) throws Exception {
        Security.addProvider(new BouncyCastleProvider());

        // Tạo lại thông điệp theo chuẩn Ethereum
        String prefix = "\u0019Ethereum Signed Message:\n" + message.length();
        String ethMessage = prefix + message;
        byte[] messageBytes = ethMessage.getBytes(StandardCharsets.UTF_8);

        // Parse public key
        ECPublicKey publicKey = getEcPublicKeyFromHex(hexPublicKey);

        // Kiểm tra chữ ký
        Signature signature = Signature.getInstance("SHA256withECDSA", "BC");
        signature.initVerify(publicKey);
        signature.update(messageBytes);

        return signature.verify(hexStringToByteArray(signatureBytes));
    }

    public static ECPublicKey getEcPublicKeyFromHex(String hexPublicKey) throws Exception {
        Security.addProvider(new BouncyCastleProvider());

        byte[] pubKeyBytes = hexStringToByteArray(hexPublicKey.replaceFirst("0x", ""));
        ECParameterSpec ecSpec = ECNamedCurveTable.getParameterSpec("secp256k1");

        org.bouncycastle.math.ec.ECPoint point = ecSpec.getCurve().decodePoint(pubKeyBytes);
        ECPublicKeySpec pubSpec = new ECPublicKeySpec(point, ecSpec);

        KeyFactory keyFactory = KeyFactory.getInstance("EC", "BC");
        return (ECPublicKey) keyFactory.generatePublic(pubSpec);
    }

    public static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte)
                    ((Character.digit(s.charAt(i), 16) << 4) +
                            Character.digit(s.charAt(i+1), 16));
        }
        return data;
    }

    public static String bytesToHex(byte[] bytes) {
        StringBuilder hex = new StringBuilder();
        for (byte b : bytes) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }
}

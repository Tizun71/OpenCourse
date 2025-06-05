package vn.tizun.service.implement;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

@Service
public class QrCodeService {
    public File generateQrCodeFile(String text, int width, int height) throws WriterException, IOException {
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(text, BarcodeFormat.QR_CODE, width, height);

        File tempFile = File.createTempFile("qr_", ".png");
        Path path = tempFile.toPath();
        MatrixToImageWriter.writeToPath(matrix, "PNG", path);
        return tempFile;
    }
}

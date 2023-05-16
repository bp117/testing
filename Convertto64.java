import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

public class KeystoreToBase64Converter {

    public static void main(String[] args) {
        String keystorePath = "path/to/keystore.jks";
        
        try {
            byte[] keystoreBytes = Files.readAllBytes(Paths.get(keystorePath));
            String base64String = Base64.getEncoder().encodeToString(keystoreBytes);
            
            System.out.println("Base64-encoded Keystore:");
            System.out.println(base64String);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

package com.paf.skillhub.utils.GCSUtils;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.Acl;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.paf.skillhub.utils.fileUpload.Res;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class GCSService {

  private final Storage storage;
  private static final String BUCKET_NAME = "skill-hub";
  private static final String SERVICE_ACCOUNT_KEY_PATH = getPathToGoogleCredentials();

  private static String getPathToGoogleCredentials()
  {
    String currentDirectory = System.getProperty("user.dir");
    Path filePath = Paths.get(currentDirectory, "gcs.json");
    return filePath.toString();
  }

  public GCSService() throws IOException
  {
    this.storage = StorageOptions.newBuilder()
        .setCredentials(ServiceAccountCredentials.fromStream(new FileInputStream(SERVICE_ACCOUNT_KEY_PATH)))
        .build()
        .getService();
  }

  public Res uploadFileToGCS(Path filePath, String contentType)
  {
    Res res = new Res();

    try {
      String blobName = UUID.randomUUID() + "-" + filePath.getFileName().toString();
      BlobId blobId = BlobId.of(BUCKET_NAME, blobName);
      BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();

      // Upload the file to GCS
      storage.create(blobInfo, Files.readAllBytes(filePath));

      // Make the file public
      storage.createAcl(blobId, Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER));

      String fileUrl = "https://storage.googleapis.com/" + BUCKET_NAME + "/" + blobName;
      System.out.println("FILE URL: " + fileUrl);

      res.setStatus(200);
      res.setMessage("File Successfully Uploaded To GCS");
      res.setUrl(fileUrl);

      // Optionally delete the local file
      Files.delete(filePath);
    }
    catch (Exception e)
    {
      System.out.println(e.getMessage());
      res.setStatus(500);
      res.setMessage(e.getMessage());
    }

    return res;
  }
}
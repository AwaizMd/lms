const AWS = require('aws-sdk');
const { get, map, reduce } = require('lodash');

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
});

const s3 = new AWS.S3({
  s3ForcePathStyle: true,
  region: process.env.REGION,
});

const getFile = (key, bucket) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };
  return new Promise((resolve, reject) => {
    s3.getObject(params, (error, data) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(data);
    });
  });
};

const uploadFileToS3 = (fileName, buffer) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: buffer,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (error, data) => {
      if (error) {
        console.log(`File upload error for file ${fileName} ${error}`);
        reject(error);
      } else {
        console.log(`S3 upload successful ${JSON.stringify(data)}`);
        resolve(data);
      }
    });
  });
};

const listDirectories = (folderName) => {
  return new Promise((resolve, reject) => {
    const s3params = {
      Bucket: process.env.BUCKET_NAME,
      MaxKeys: process.env.MAX_KEY_LIMIT,
      Delimiter: '/',
      Prefix: folderName + '/',
    };
    s3.listObjectsV2(s3params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const s3ListWithType = (folderName) => {
  return new Promise((resolve, reject) => {
    listDirectories(folderName)
      .then((data) => {
        const bucketUrl = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/`;
        var directories = map(data.CommonPrefixes, function (item) {
          return {
            Key: get(item, 'Prefix', ''),
            LastModified: '',
            Size: '',
            Type: 'directory',
          };
        });

        var files = reduce(
          data.Contents,
          function (modifiedItem, item) {
            if (item.Size > 0) {
              modifiedItem.push({
                Key: get(item, 'Key', ''),
                LastModified: get(item, 'LastModified', ''),
                Size: get(item, 'Size', ''),
                Type: 'file',
              });
            }
            return modifiedItem;
          },
          []
        );

        resolve({
          success: true,
          files: files,
          bucket_url: bucketUrl,
          directories: directories,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const s3params = {
      Bucket: process.env.BUCKET_NAME,
      Key: filePath,
    };
    s3.deleteObject(s3params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const copyFile = (oldFile, newFile) => {
  const bucketName = process.env.BUCKET_NAME;
  return new Promise((resolve, reject) => {
    const s3params = {
      Bucket: bucketName,
      CopySource: `${bucketName}/${oldFile}`,
      Key: newFile,
    };
    s3.copyObject(s3params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const headFile = async (file) => {
  try {
    const bucketName = process.env.BUCKET_NAME;
    console.log(bucketName, process.env.S3_ACCESS_KEY, process.env.S3_SECRET_KEY);
    const existsCheck = await s3
      .headObject({
        Bucket: bucketName,
        Key: decodeURIComponent(file),
      })
      .promise();
    if (existsCheck) {
      return existsCheck;
    }
  } catch (e) {
    return false;
  }
};

const getS3Key = (s3URL) => {
  try {
    s3URL = decodeURIComponent(s3URL);
  } catch (e) {
    console.log(e);
  }
  const bucket = process.env.BUCKET_NAME;
  const sameBucket = s3URL.includes(bucket);
  const sliceCount = s3URL
    .replace(/(http|https):\/\//i, '')
    .split('/')[0]
    .includes(bucket)
    ? 1
    : 2;
  return {
    key: s3URL
      .replace(/(http|https):\/\//i, '')
      .split('/')
      .slice(sliceCount)
      .join('/'),
    sameBucket: sameBucket,
  };
};

const createFolder = (folderName) => {
  folderName = folderName + '/';
  return new Promise((resolve, reject) => {
    const s3params = {
      Bucket: process.env.BUCKET_NAME,
      Key: folderName,
    };
    s3.putObject(s3params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const moveDirectory = async (source, destination) => {
  const listObjectsResponse = await s3
    .listObjects({
      Bucket: process.env.BUCKET_NAME,
      Prefix: source + '/',
    })
    .promise();
  const folderPrefix = listObjectsResponse.Prefix;
  await Promise.all(
    listObjectsResponse.Contents.map(async (fileInfo) => {
      await s3
        .copyObject({
          Bucket: process.env.BUCKET_NAME,
          CopySource: `${process.env.BUCKET_NAME}/${fileInfo.Key}`, // old file Key
          Key: `${destination}/${fileInfo.Key.replace(folderPrefix, '')}`, // new file Key
        })
        .promise();
      await s3
        .deleteObject({
          Bucket: process.env.BUCKET_NAME,
          Key: fileInfo.Key,
        })
        .promise();
    })
  );
};

const getSignedURL = async (filePath, method) => {
  try {
    const bucketName = process.env.BUCKET_NAME;
    if (method && method.toLowerCase() === 'download') {
      method = 'getObject';
    } else {
      method = 'putObject';
    }
    const s3Params = {
      Bucket: bucketName,
      Key: filePath,
      Expires: 30000,
    };
    const res = await s3.getSignedUrlPromise(method, s3Params);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getFile,
  getSignedURL,
  moveDirectory,
  createFolder,
  getS3Key,
  headFile,
  copyFile,
  deleteFile,
  s3ListWithType,
  uploadFileToS3,
};

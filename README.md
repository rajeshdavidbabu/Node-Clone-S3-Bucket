# Node Clone AWS S3 Bucket
<p>
  <a href="https://github.com/rajeshdavidbabu/Node-Clone-S3-Bucket/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/express.svg?maxAge=2592000&style=flat-square"
         alt="License">
  </a>
</p>

A Node.js Service to clone AWS S3 buckets locally, it can clone entire bucket or just only target directories inside a bucket.

### Whats a bucket?
A bucket is storage space for your files and folders on AWS and it goes by the name S3(Simple Storage Service). We can access the files and folders inside the bucket through REST APIs to upload, download, delete, create and modify content inside them. AWS provides a node module to make our lives easier, and its called AWS-SDK.

### Whats an AWS-SDK?
AWS-SDK is a set of Javascript methods to make our lives easier when working with AWS. It's more like a library to abstract away the network calls, and other important methods and provides us with a set of clean and easy to APIs for development.

## Detailed Description
There are a lot of ways to clone/download an AWS S3 Bucket locally, the simplest way is of course to use an AWS CLI. As a Javascript developer, I was curious to implement this on Node and without using any CLI or other external applications.

The Node service, once started, creates a copy of the directory structure locally, followed by downloading files from AWS into their respective directories through writestreams.

## Requirements
- Node 10.15.1 and above.
- AWS-SDK
- ... and few other useful modules.

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install dependencies.

```bash
npm install
```

## Configuration
The project requires the AWS S3 information to access data and download files from the same. So in the under **_config/test.json_**, please add your AWS S3 information to access buckets. If you are new to AWS, please create an account first and follow the instructions mentioned [here](https://supsystic.com/documentation/id-secret-access-key-amazon-s3/) to get your access information.

```javascript
"aws": {
    "access_key_id": "<your access key>",
    "secret_access_key": "<your secret key>",
    "region": "eu-west-1",
    "bucket": "<your bucket>",
    "host": "https://s3-eu-west-1.amazonaws.com",
    "rootDirectory": "<your root directory>"
  }
```
the rootDirectory can be left as an empty or even be removed. The rootDirectory indicates if you want to clone the entire bucket is starting from the first folder or do you want to target specific directories.

To clone an entire bucket, I would remove it or add an empty string. If I want to clone a specific directory, I would add the prefix of the directory as follows:

If my S3 bucket has nested directories and the directory that I want to target is nested two levels deep then I would prefix it such a way that I clone only my nested directory **_(be mindful of the "/" at the end)_**. 

```javascript
"rootDirectory": "main_dir/sub_dir_1/sub_dir_2/"
```
In this case, only the target directory will be downloaded, nevertheless maintaining the same directory structure on the local machine (refer the sample inside config folder).

## Run

```bash
npm run start
```

## Lint (ES-lint)
```bash
npm run lint
npm run fix-lint
```

## Usage
Once run, the project creates a local folder called **_local_S3_** and treats it as local AWS S3 to store downloaded buckets. The bucket to download is extracted from the config and your bucket will be created under the same folder name. Eg: If your bucket name was **_test_bucket_**. On the same level of your **_index.js_** you would find a **_local_S3/test_bucket/<all contents of bucket>_**.

#### Note
> The file path of the local_S3 can be edited by changing the **_TARGET_DIR_** inside **_/lib/helpers/file_path.js_**.

> And the name of the local_S3 folder can be changed by updating the config.

## Extended Usage
Might be used in a case where you would like to download S3 files, append or modify them and re-upload them again.

## Logs
Every successful completion and error occurrence is accompanied by Bunyan logs. The process would complete even if some of the files failed to download and the final output would also have the error count.

```
**Success logs**: 
{"name":"S3 Bucket Clone","hostname”:”host.com.com","pid":28856,"level":30,"msg":"Cloning finished successfully !!!","time":"2019-02-26T11:44:14.298Z","v":0}

**Failure logs**:
{"name":"S3 Bucket Clone","hostname":"host.com","pid":29059,"level":50,"error":"Download failed","msg":"Error occured during download","time":"2019-02-26T12:49:16.510Z","v":0}
{"name":"S3 Bucket Clone","hostname":"host.com","pid":29059,"level":50,"error":"Download failed","msg":"Error occured during download","time":"2019-02-26T12:49:16.839Z","v":0}
{"name":"S3 Bucket Clone","hostname":"host.com","pid":29059,"level":30,"DOWNLOAD_ERRORS_COUNT":2,"msg":"Failed file downloads","time":"2019-02-26T12:49:17.143Z","v":0}
{"name":"S3 Bucket Clone","hostname":"host.com","pid":29063,"level":50,"error":"Download failed","msg":"Cloning failed to finish, please try again !!!","time":"2019-02-26T12:50:56.679Z","v":0}
```

## Known Issues
- This project ideally works seamlessly for small to medium sized buckets where all file-types are known. For large buckets full of unknowns, this is not suitable.
- Doesn't support illegal file names.
- Doesn't indicate progress as of now.

## Roadmap
- Writing unit/integration tests.
- Setting up build process.
- Fix known issues.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Also, let me know if you would like to contribute to any of the Roadmap items.

## License

MIT © Rajesh Babu

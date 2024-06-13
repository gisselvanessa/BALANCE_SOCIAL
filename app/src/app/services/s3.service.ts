import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

import { UploadResponse } from 'aws-s3-upload-ash/dist/types';
import AWSS3UploadAshClient from 'aws-s3-upload-ash';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  S3CustomClient: AWSS3UploadAshClient = new AWSS3UploadAshClient(environment.aws);

  constructor() {

  }

  async uploadFile(file: File) {

    
    return new Promise((resolve, reject) => {
      this.S3CustomClient.uploadFile(file, file.type, undefined, file.name.replace(/\s+/g, ''), 'private')
      .then((data: UploadResponse) => {
        resolve(data.location);
      })
      .catch((err: any) => {
        console.error(err)
        reject(err);
      });
    });
  };
}

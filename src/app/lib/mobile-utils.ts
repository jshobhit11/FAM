/// <reference types="cordova" />
/// <reference types="cordova-plugin-file" />

import { AppLauncher } from '@capacitor/app-launcher';

declare var cordova: any;

export class MobileUtils {
  public static downloadFileOnMobile(fileName: string, fileType: string, blob: any) {
    const filePath = cordova.file.externalRootDirectory + 'Download/';
    console.log(fileName);
    console.log(filePath);

    window.resolveLocalFileSystemURL(
      cordova.file.externalRootDirectory,
      (dirEntry: DirectoryEntry) => {
        dirEntry.getDirectory(
          'Download',
          { create: true },
          (subDirEntry) => {
            console.log('Directory created or already exists:', subDirEntry);
          },
          (error) => {
            console.error('Failed to create directory:', error.code);
          },
        );
      },
      (error) => {
        console.error('Failed to resolve file system URL:', error.code);
      },
    );

    window.resolveLocalFileSystemURL(
      filePath,
      (dirEntry: DirectoryEntry) => {
        console.log(dirEntry);
        if (dirEntry.isDirectory) {
          const date = new Date();
          const formattedDate = `${date.getFullYear().toString().slice(2, 4)}${String(date.getMonth() + 1).padStart(2, '0')}${String(
            date.getDate(),
          ).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(
            date.getSeconds(),
          ).padStart(2, '0')}`;
          dirEntry.getFile(
            fileName + `_${formattedDate}.` + fileType,
            { create: true, exclusive: false },
            (fileEntry: FileEntry) => {
              console.log(fileEntry);
              this.writeFile(fileEntry, blob);
            },
            this.onError,
          );
        }
      },
      this.onError,
    );
  }

  public static downloadFileOnMobileByNameOnly(fileName: string, blob: any) {
    const filePath = cordova.file.externalRootDirectory + 'Download/';
    console.log(fileName);
    console.log(filePath);

    const fileType = fileName.split(/(?=\.\w+$)/)[1];
    fileName = fileName.split(/(?=\.\w+$)/)[0];

    window.resolveLocalFileSystemURL(
      cordova.file.externalRootDirectory,
      (dirEntry: DirectoryEntry) => {
        dirEntry.getDirectory(
          'Download',
          { create: true },
          (subDirEntry) => {
            console.log('Directory created or already exists:', subDirEntry);
          },
          (error) => {
            console.error('Failed to create directory:', error.code);
          },
        );
      },
      (error) => {
        console.error('Failed to resolve file system URL:', error.code);
      },
    );

    window.resolveLocalFileSystemURL(
      filePath,
      (dirEntry: DirectoryEntry) => {
        console.log(dirEntry);
        if (dirEntry.isDirectory) {
          const date = new Date();
          const formattedDate = `${date.getFullYear().toString().slice(2, 4)}${String(date.getMonth() + 1).padStart(2, '0')}${String(
            date.getDate(),
          ).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(
            date.getSeconds(),
          ).padStart(2, '0')}`;
          dirEntry.getFile(
            fileName + `_${formattedDate}` + fileType,
            { create: true, exclusive: false },
            (fileEntry: FileEntry) => {
              console.log(fileEntry);
              this.writeFile(fileEntry, blob);
            },
            this.onError,
          );
        }
      },
      this.onError,
    );
  }

  public static writeFile(fileEntry: FileEntry, data: Blob) {
    const fileType = fileEntry.nativeURL.split(/(?=\.\w+$)/)[1];

    fileEntry.createWriter((fileWriter) => {
      fileWriter.onwriteend = () => {
        console.log('Successful file write: ' + fileEntry.toURL());
        cordova.plugins.fileOpener2.showOpenWithDialog(
          fileEntry.nativeURL, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Downloads/starwars.pdf
          'application/' + fileType.split('.')[1],
          {
            error: function (e) {
              console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
            },
            success: function () {
              console.log('file opened successfully');
            },
            position: [0, 0],
          },
        );
      };

      fileWriter.onerror = (e) => {
        console.error('Failed file write: ' + e.toString());
      };

      fileWriter.write(data);
    });
  }

  public static onError(error: any) {
    console.error('Error: ', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    console.error('Error Code:', error.code);
    console.error('Error Source:', error.source);
    console.error('Error Target:', error.target);
    console.error('Error HTTP Status:', error.http_status);
    console.error('Error Exception:', error.exception);
    console.error('Error Body:', error.body);
    console.error('Complete Error Object:', error);
    alert('Cannot save file. Please contact administrator');
  }

  public static async openGisApp(val1: string, val2: string, val3: string) {
    const appLaunchable = await AppLauncher.canOpenUrl({ url: 'com.infinite.gis' });
    if (appLaunchable.value) {
      cordova.plugins.OpenIntent.openGisIntent(
        val1,
        val2,
        val3,
        function (response) {
          console.log('openGisIntent ========> ', response);
        },
        function (error) {
          console.log(error);
        },
      );
    } else {
      console.log('App is not available');
    }
  }

  public static isMobile() {
    if (cordova !== undefined) {
      return true;
    } else {
      return false;
    }
  }
}

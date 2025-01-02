import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize, switchMap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private storage: AngularFireStorage) {}

  // Hàm upload ảnh lên Firebase và trả về URL
  uploadImage(file: File, folderPath: string): Observable<string> {
    const filePath = `${folderPath}/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    let downloadURL: string;

    return new Observable<string>((observer) => {
      task
        .snapshotChanges()
        .pipe(
          finalize(async () => {
            try {
              // Chờ hoàn tất upload, sau đó lấy URL
              downloadURL = await fileRef.getDownloadURL().toPromise();
              observer.next(downloadURL); // Gửi URL tới subscriber
              observer.complete(); // Kết thúc luồng
            } catch (error) {
              observer.error(error); // Báo lỗi nếu xảy ra
            }
          })
        )
        .subscribe();
    });
  }
}

import { Injectable } from "@angular/core";
let xlsx = require('xlsx');
@Injectable({ providedIn: 'root' })
export class CommonService {

    base64ToArrayBuffer(base64): Uint8Array {
        let binary_string = window.atob(base64);
        let len = binary_string.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    }

    fileUploadToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    }

    resizeImage(image) {
        return new Promise((resolve) => {
            let fr = new FileReader;
            fr.onload = () => {
                var img = new Image();
                img.onload = () => {
                    console.log(img.width);
                    let width = img.width < 900 ? img.width : 900;
                    let height = img.width < 900 ? img.height : width * img.height / img.width;
                    console.log(width, height);
                    let canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    let ctx = canvas.getContext('2d');
                    if (ctx != null) {
                        ctx.drawImage(img, 0, 0, width, height);
                    }
                    let data = canvas.toDataURL('image/png');
                    resolve(data);
                };

                // @ts-ignore
                img.src = fr.result;
            };

            fr.readAsDataURL(image);
        })
    }

    /**
     * Chuyen Date sang timestamp
     * 
     * @param format 
     * @param value 
     * @returns 
     */
    convertDateToUnixTime(format, value) {
        let result = null;
        if (!value) {
            return result;
        }
        if (format == 'DD/MM/YYYY') {
            const dateString = value; // Oct 23
            const dateParts: any = dateString.split("/");
            // month is 0-based, that's why we need dataParts[1] - 1
            const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            result = Math.floor(dateObject.getTime() / 1000);
        }
        return result;
    }

    formatDateFromTimestamp(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    async exportExcel(data, fileName) {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
        const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

        // const buffer = await wb.xlsx.writeBuffer();
        var newBlob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(newBlob);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        return;
    }

}
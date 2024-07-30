import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberToText' })
export class NumberToTextPipe implements PipeTransform {
    defaultNumbers = ' hai ba bốn năm sáu bảy tám chín';
    chuHangDonVi = ('1 một' + this.defaultNumbers).split(' ');
    chuHangChuc = ('lẻ mười' + this.defaultNumbers).split(' ');
    chuHangTram = ('không một' + this.defaultNumbers).split(' ');
    dvBlock = '1 nghìn triệu tỷ'.split(' ');

    transform(value: string): string {
        let str = parseInt(value) + '';
        let i = 0;
        let arr = [];
        let index = str.length;
        let result = [];
        let rsString = '';

        if (index == 0 || str == 'NaN') {
            return '';
        }

        // Chia chuỗi số thành một mảng từng khối có 3 chữ số
        while (index >= 0) {
            arr.push(str.substring(index, Math.max(index - 3, 0)));
            index -= 3;
        }

        // Lặp từng khối trong mảng trên và convert từng khối đấy ra chữ Việt Nam
        for (i = arr.length - 1; i >= 0; i--) {
            if (arr[i] != '' && arr[i] != '000') {
                result.push(this.convert_block_three(arr[i]));

                // Thêm đuôi của mỗi khối
                if (this.dvBlock[i]) {
                    result.push(this.dvBlock[i]);
                }
            }
        }

        // Join mảng kết quả lại thành chuỗi string
        rsString = result.join(' ');

        // Trả về kết quả kèm xóa những ký tự thừa
        return rsString.replace(/[0-9]/g, '').replace(/ /g, ' ').replace(/ $/, '');
    }

    convert_block_three(number) {
        if (number == '000') return '';
        let _a = number + ''; //Convert biến 'number' thành kiểu string

        //Kiểm tra độ dài của khối
        switch (_a.length) {
            case 0: return '';
            case 1: return this.chuHangDonVi[_a];
            case 2: return this.convert_block_two(_a);
            case 3:
                let chuc_dv = '';
                if (_a.slice(1, 3) != '00') {
                    chuc_dv = this.convert_block_two(_a.slice(1, 3));
                }
                let tram = this.chuHangTram[_a[0]] + ' trăm';
                return tram + ' ' + chuc_dv;
        }
    }

    convert_block_two(number) {
        let dv = this.chuHangDonVi[number[1]];
        let chuc = this.chuHangChuc[number[0]];
        let append = '';

        // Nếu chữ số hàng đơn vị là 5
        if (number[0] > 0 && number[1] == 5) {
            dv = 'lăm'
        }

        // Nếu số hàng chục lớn hơn 1
        if (number[0] > 1) {
            append = ' mươi';

            if (number[1] == 1) {
                dv = ' mốt';
            }
        }

        return chuc + '' + append + ' ' + dv;
    }
}
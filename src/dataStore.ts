// Since this is stored in-memory, there are no issues if multiple instances are deployed

let data: any[] = [];

export function getData() {
    return data;
}

export function setData(newData: any[]) {
    data = newData;
}
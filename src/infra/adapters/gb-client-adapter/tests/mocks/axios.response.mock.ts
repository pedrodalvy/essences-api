import { Observable, of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpStatus } from '@nestjs/common';

type MockParams = {
  responseData: any;
  httpStatusCode?: HttpStatus;
};

export const axiosResponseMock = ({
  responseData,
  httpStatusCode = HttpStatus.OK,
}: MockParams): Observable<AxiosResponse<any>> => {
  return of({
    data: responseData,
    status: httpStatusCode,
    statusText: HttpStatus[httpStatusCode],
  } as AxiosResponse<any>);
};

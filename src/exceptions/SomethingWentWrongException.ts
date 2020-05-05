import HttpException from './HttpException';

class SomethingWentWrongException extends HttpException {
  constructor(err:string) {
    super(500, err);
  }
}

export default SomethingWentWrongException;